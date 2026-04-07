#!/usr/bin/env node

import {createRequire} from 'node:module';
import {callTool} from './mcp.js';

const require = createRequire(import.meta.url);
const {version} = require('../package.json') as {version: string};

const [, , command, ...rest] = process.argv;

if (command === '--version' || command === '-v' || command === 'version') {
	console.log(version);
	process.exit(0);
}

function parseArgs(argv: string[]): {
	positional: string[];
	flags: Record<string, string>;
} {
	const positional: string[] = [];
	const flags: Record<string, string> = {};

	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i]!;
		if (arg.startsWith('--')) {
			const key = arg.slice(2);
			flags[key] = argv[++i] || '';
		} else if (arg.startsWith('-') && arg.length === 2) {
			const key = arg.slice(1);
			flags[key] = argv[++i] || '';
		} else {
			positional.push(arg);
		}
	}

	return {positional, flags};
}

const {positional, flags} = parseArgs(rest);
const num = (key: string) =>
	flags[key] ? parseInt(flags[key]!, 10) : undefined;

const HELP = `Usage: apple-docs <command> [args] [--flags]

Commands:
  version                     Show current version
  search <query>              Search Apple documentation
  doc <url>                   Get documentation content
  tech [category]             List Apple technologies
  symbols <framework>         Browse framework symbols
  wwdc [year] [topic]         Browse WWDC videos
  wwdc-search <query>         Search WWDC transcripts
  wwdc-video <year> <id>      Get WWDC video content
  wwdc-code [framework]       Get WWDC code examples
  wwdc-topics [topicId]       Browse WWDC topics
  wwdc-years                  List available WWDC years
  sample [query]              Browse sample code
  related <url>               Find related APIs
  similar <url>               Find similar APIs
  platform <url>              Check platform compatibility
  updates [category]          Documentation updates
  overviews [category]        Technology overviews
  references <url>            Resolve API references

Flags:
  --type <type>         Symbol/search type filter
  --limit <n>           Max results
  --year <year>         Year filter
  --framework <fw>      Framework filter
  --topic <topic>       Topic filter
  --platform <p>        Platform filter (ios, macos, watchos, tvos, visionos)
  --query <q>           Search query filter
  --technology <t>      Technology filter
  --language <lang>     Language filter (swift, occ)
  --depth <d>           Search depth (shallow, medium, deep)
  --version, -v         Show version`;

function need(val: string | undefined, usage: string): string {
	if (!val) {
		console.error(usage);
		process.exit(1);
	}
	return val!;
}

async function main() {
	switch (command) {
		case 'search':
			console.log(
				await callTool('search_apple_docs', {
					query: need(
						positional.join(' ') || undefined,
						'Usage: apple-docs search <query>',
					),
					type: flags['type'] || 'all',
				}),
			);
			break;

		case 'doc':
			console.log(
				await callTool('get_apple_doc_content', {
					url: need(positional[0], 'Usage: apple-docs doc <url>'),
					includeRelatedApis: flags['related'] === 'true',
					includeReferences: flags['refs'] === 'true',
					includeSimilarApis: flags['similar'] === 'true',
					includePlatformAnalysis: flags['platforms'] === 'true',
				}),
			);
			break;

		case 'tech':
			console.log(
				await callTool('list_technologies', {
					category: positional[0],
					language: flags['language'],
					limit: num('limit'),
				}),
			);
			break;

		case 'symbols':
			console.log(
				await callTool('search_framework_symbols', {
					framework: need(
						positional[0],
						'Usage: apple-docs symbols <framework>',
					),
					symbolType: flags['type'] || 'all',
					namePattern: flags['pattern'],
					language: flags['language'] || 'swift',
					limit: num('limit'),
				}),
			);
			break;

		case 'wwdc':
			console.log(
				await callTool('list_wwdc_videos', {
					year: positional[0],
					topic: positional[1] || flags['topic'],
					hasCode: flags['code'] === 'true' ? true : undefined,
					limit: num('limit'),
				}),
			);
			break;

		case 'wwdc-search':
			console.log(
				await callTool('search_wwdc_content', {
					query: need(
						positional.join(' ') || undefined,
						'Usage: apple-docs wwdc-search <query>',
					),
					searchIn: flags['in'] || 'both',
					year: flags['year'],
					language: flags['language'],
					limit: num('limit'),
				}),
			);
			break;

		case 'wwdc-video':
			console.log(
				await callTool('get_wwdc_video', {
					year: need(
						positional[0],
						'Usage: apple-docs wwdc-video <year> <videoId>',
					),
					videoId: need(
						positional[1],
						'Usage: apple-docs wwdc-video <year> <videoId>',
					),
					includeTranscript: flags['no-transcript'] !== 'true',
					includeCode: flags['no-code'] !== 'true',
				}),
			);
			break;

		case 'wwdc-code':
			console.log(
				await callTool('get_wwdc_code_examples', {
					framework: positional[0] || flags['framework'],
					topic: flags['topic'],
					year: flags['year'],
					language: flags['language'],
					limit: num('limit'),
				}),
			);
			break;

		case 'wwdc-topics':
			console.log(
				await callTool('browse_wwdc_topics', {
					topicId: positional[0],
					includeVideos: flags['no-videos'] !== 'true',
					year: flags['year'],
					limit: num('limit'),
				}),
			);
			break;

		case 'wwdc-years':
			console.log(await callTool('list_wwdc_years', {}));
			break;

		case 'sample':
			console.log(
				await callTool('get_sample_code', {
					searchQuery: positional.join(' ') || undefined,
					framework: flags['framework'],
					beta: flags['beta'] || 'include',
					limit: num('limit'),
				}),
			);
			break;

		case 'related':
			console.log(
				await callTool('get_related_apis', {
					apiUrl: need(
						positional[0],
						'Usage: apple-docs related <url>',
					),
				}),
			);
			break;

		case 'similar':
			console.log(
				await callTool('find_similar_apis', {
					apiUrl: need(
						positional[0],
						'Usage: apple-docs similar <url>',
					),
					searchDepth: flags['depth'] || 'medium',
					filterByCategory: flags['category'],
				}),
			);
			break;

		case 'platform':
			console.log(
				await callTool('get_platform_compatibility', {
					apiUrl: need(
						positional[0],
						'Usage: apple-docs platform <url>',
					),
					compareMode: flags['mode'] || 'single',
					includeRelated: flags['related'] === 'true',
				}),
			);
			break;

		case 'updates':
			console.log(
				await callTool('get_documentation_updates', {
					category: positional[0] || 'all',
					technology: flags['technology'],
					year: flags['year'],
					searchQuery: flags['query'],
					limit: num('limit'),
				}),
			);
			break;

		case 'overviews':
			console.log(
				await callTool('get_technology_overviews', {
					category: positional[0],
					platform: flags['platform'] || 'all',
					searchQuery: flags['query'],
					limit: num('limit'),
				}),
			);
			break;

		case 'references':
			console.log(
				await callTool('resolve_references_batch', {
					sourceUrl: need(
						positional[0],
						'Usage: apple-docs references <url>',
					),
					maxReferences: num('limit'),
					filterByType: flags['type'] || 'all',
				}),
			);
			break;

		default:
			console.log(HELP);
			if (command) {
				console.error(`\nUnknown command: ${command}`);
				process.exit(1);
			}
	}
}

main()
	.then(() => process.exit(0))
	.catch((err: Error) => {
		console.error(`Error: ${err.message}`);
		process.exit(1);
	});
