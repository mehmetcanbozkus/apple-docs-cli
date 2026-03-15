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

export async function callTool(
	name: string,
	toolArgs: Record<string, unknown> = {},
): Promise<string> {
	const result = await handleToolCall(name, toolArgs, server);
	return extractText(result as ToolResult);
}
