import AppleDeveloperDocsMCPServer from '@kimsungwhee/apple-docs-mcp';
import {handleToolCall} from '@kimsungwhee/apple-docs-mcp/dist/tools/handlers.js';

const server = new AppleDeveloperDocsMCPServer();

type ToolResult = {
	content: Array<{type: string; text: string}>;
	isError?: boolean;
};

function extractText(result: ToolResult): string {
	const text = result.content
		.filter((c) => c.type === 'text')
		.map((c) => c.text)
		.join('\n');
	if (result.isError) {
		throw new Error(text || 'Tool call failed');
	}
	return text;
}

// Apple's search page is client-side rendered, so the upstream cheerio-based
// parser finds zero results. We call the POST JSON API directly instead.
async function searchAppleDocs(
	query: string,
	type: string = 'all',
): Promise<string> {
	const res = await fetch(
		'https://developer.apple.com/search/services/search.php',
		{
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({q: query, targetResultLocale: 'en_US'}),
		},
	);
	if (!res.ok) {
		throw new Error(`Apple search API returned ${res.status}`);
	}

	// Response is newline-delimited JSON (first line = results, second = done)
	const body = await res.text();
	const firstLine = body.split('\n')[0];
	if (!firstLine) throw new Error('Empty response from Apple search API');

	const payload = JSON.parse(firstLine) as {
		type: string;
		data: Array<Record<string, {metadata: Record<string, unknown>}>>;
	};

	interface SearchResult {
		kind: string;
		title: string;
		description: string;
		url: string;
		availability?: string;
		hierarchy?: string;
		apiKind?: string;
	}

	const results: SearchResult[] = [];

	for (const item of payload.data ?? []) {
		const [kind, value] = Object.entries(item)[0]!;
		const meta = value.metadata as Record<string, unknown>;

		if (kind === 'documentation') {
			const docKind = (meta.kind as string) || '';
			let resultType = 'documentation';
			if (docKind === 'sampleCode') resultType = 'sample-code';
			else if (docKind === 'article') resultType = 'documentation-article';

			if (type !== 'all' && resultType !== type) continue;

			results.push({
				kind: resultType,
				title: meta.title as string,
				description: meta.description as string,
				url: meta.permalink as string,
				availability: meta.availability as string | undefined,
				hierarchy: meta.hierarchy as string | undefined,
				apiKind: docKind,
			});
		} else if (kind === 'devsite') {
			if (type !== 'all' && type !== 'documentation') continue;
			results.push({
				kind: 'documentation',
				title: meta.title as string,
				description: meta.description as string,
				url: meta.sourceURL as string,
			});
		} else if (kind === 'developer') {
			if (type !== 'all' && type !== 'video') continue;
			const titles = meta.titles as string[] | undefined;
			const descs = meta.descriptions as string[] | undefined;
			const links = meta.permalinks as string[] | undefined;
			const itemTypes = meta.itemTypes as string[] | undefined;
			if (titles?.[0] && links?.[0]) {
				results.push({
					kind: 'video',
					title: titles[0],
					description: descs?.[0] || '',
					url: links[0],
					apiKind: itemTypes?.[0],
				});
			}
		}
	}

	// Format markdown output matching upstream style
	const searchUrl = `https://developer.apple.com/search/?q=${encodeURIComponent(query)}`;
	let out = '# Apple Documentation Search Results\n\n';
	out += `**Query:** "${query}"\n`;
	out += `**Filter:** ${type}\n`;
	out += `**Results found:** ${results.length}\n\n`;

	if (results.length === 0) {
		out += '## No Results Found\n\n';
		out += `No results found for "${query}".\n\n`;
		out += `[View search on Apple Developer](${searchUrl})`;
		return out;
	}

	// Group by kind
	const groups: Record<string, SearchResult[]> = {};
	for (const r of results) {
		const label = kindLabel(r.kind);
		(groups[label] ??= []).push(r);
	}

	for (const [label, items] of Object.entries(groups)) {
		out += `## ${label}\n\n`;
		items.forEach((r, i) => {
			out += `### ${i + 1}. ${r.title}\n\n`;
			if (r.hierarchy) out += `**Framework:** ${r.hierarchy}\n`;
			out += `**Type:** ${r.kind.replace(/-/g, ' ')}\n`;
			if (r.availability) out += `**Availability:** ${r.availability}\n`;
			if (r.description) out += `**Description:** ${r.description}\n`;
			out += `**URL:** ${r.url}\n\n`;
		});
	}

	out += `---\n\n[View all results on Apple Developer](${searchUrl})`;
	return out;
}

function kindLabel(kind: string): string {
	const map: Record<string, string> = {
		documentation: 'API Documentation',
		'documentation-article': 'Articles',
		'sample-code': 'Sample Code',
		video: 'WWDC Videos',
	};
	return map[kind] || 'Other';
}

export async function callTool(
	name: string,
	toolArgs: Record<string, unknown> = {},
): Promise<string> {
	if (name === 'search_apple_docs') {
		return searchAppleDocs(
			toolArgs.query as string,
			(toolArgs.type as string) || 'all',
		);
	}
	const result = await handleToolCall(name, toolArgs, server);
	return extractText(result as ToolResult);
}
