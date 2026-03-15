# apple-docs

CLI for querying Apple Developer Documentation. Searches docs, browses frameworks, WWDC videos, sample code, and more.

Built on top of [apple-docs-mcp](https://github.com/kimsungwhee/apple-docs-mcp) — uses its library directly, no MCP server needed.

## Install

```bash
npm i -g apple-docs
```

Or run directly:

```bash
npx apple-docs search "SwiftUI List"
```

### Claude Code Skill

```bash
npx skills add mtcnbzks/apple-docs-cli
```

Then use `/apple-docs` in Claude Code to query Apple documentation.

## Usage

```
apple-docs <command> [args] [--flags]
```

### Search & Documentation

```bash
# Search Apple docs
apple-docs search "SwiftUI List"
apple-docs search "CoreML" --type documentation

# Get full doc page content
apple-docs doc "https://developer.apple.com/documentation/swiftui/list"

# Browse all Apple frameworks
apple-docs tech
apple-docs tech "App Frameworks" --limit 10

# Browse symbols in a framework
apple-docs symbols swiftui
apple-docs symbols uikit --type class --limit 20
apple-docs symbols foundation --type protocol --language swift
```

### WWDC

```bash
# List videos by year
apple-docs wwdc 2025
apple-docs wwdc 2024 --limit 10

# Search transcripts and code
apple-docs wwdc-search "async await"

# Get full video content (transcript + code)
apple-docs wwdc-video 2025 245

# Browse code examples
apple-docs wwdc-code SwiftUI --limit 5

# Browse topics
apple-docs wwdc-topics swift

# List available years
apple-docs wwdc-years
```

### Sample Code

```bash
apple-docs sample "camera"
apple-docs sample --framework SwiftUI
```

### API Analysis

```bash
# Related APIs
apple-docs related "https://developer.apple.com/documentation/swiftui/list"

# Similar/alternative APIs
apple-docs similar "https://developer.apple.com/documentation/swiftui/list"

# Platform compatibility
apple-docs platform "https://developer.apple.com/documentation/swiftui/list"

# Resolve referenced types
apple-docs references "https://developer.apple.com/documentation/swiftui/list"
```

### Updates & Overviews

```bash
apple-docs updates
apple-docs updates --technology SwiftUI --year 2025
apple-docs overviews --platform ios
```

## Flags

| Flag | Description |
|------|-------------|
| `--type <type>` | Symbol/search type filter (class, struct, enum, protocol) |
| `--limit <n>` | Max results |
| `--year <year>` | Year filter |
| `--framework <fw>` | Framework filter |
| `--topic <topic>` | Topic filter |
| `--platform <p>` | Platform filter (ios, macos, watchos, tvos, visionos) |
| `--query <q>` | Search query filter |
| `--technology <t>` | Technology filter |
| `--language <lang>` | Language filter (swift, occ) |
| `--depth <d>` | Search depth (shallow, medium, deep) |

## License

MIT
