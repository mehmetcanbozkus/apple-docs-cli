---
name: apple-docs
description: Search Apple Developer Documentation — APIs, frameworks, WWDC videos, sample code, and platform compatibility. Uses the apple-docs CLI to fetch real-time data from developer.apple.com.
---

# apple-docs

Query Apple Developer Documentation from the command line. Provides real-time access to API docs, framework symbols, WWDC video transcripts and code examples, sample code, and platform compatibility info.

## When to use

- When you need up-to-date Apple API documentation (SwiftUI, UIKit, Foundation, etc.)
- When checking platform availability or minimum OS versions
- When looking for WWDC session content, transcripts, or code examples
- When exploring framework symbols (classes, structs, protocols, enums)
- When finding sample code from Apple
- When discovering related or alternative APIs

## Setup

```bash
npx apple-docs search "SwiftUI"
```

Or install globally:

```bash
npm i -g apple-docs
```

## Instructions

Based on the user's question: $ARGUMENTS

1. Determine which `apple-docs` command(s) best answer the question
2. Run them using the Bash tool
3. Present the results concisely, focusing on what the user needs

## Commands

```
apple-docs version                     # Show current version
apple-docs search <query>              # Search Apple documentation
apple-docs doc <url>                   # Get full doc page content
apple-docs tech [category]             # List Apple technologies/frameworks
apple-docs symbols <framework>         # Browse framework symbols (--type class|struct|enum|protocol)
apple-docs wwdc [year]                 # Browse WWDC videos
apple-docs wwdc-search <query>         # Search WWDC transcripts & code
apple-docs wwdc-video <year> <id>      # Get WWDC video transcript + code
apple-docs wwdc-code [framework]       # Get WWDC code examples
apple-docs wwdc-topics [topicId]       # Browse WWDC topics
apple-docs wwdc-years                  # List available WWDC years
apple-docs sample [query]              # Browse sample code
apple-docs related <url>               # Find related APIs
apple-docs similar <url>               # Find similar/alternative APIs
apple-docs platform <url>              # Check platform compatibility
apple-docs updates [category]          # Documentation updates
apple-docs overviews [category]        # Technology overviews
apple-docs references <url>            # Resolve API references
```

## Flags

- `--type <type>` — Symbol type filter (class, struct, enum, protocol)
- `--limit <n>` — Max results
- `--year <year>` — Year filter
- `--framework <fw>` — Framework filter
- `--topic <topic>` — Topic filter
- `--platform <p>` — Platform filter (ios, macos, watchos, tvos, visionos)
- `--language <lang>` — Language filter (swift, occ)
- `--depth <d>` — Search depth (shallow, medium, deep)

## Tips

- Start with `search` for general questions
- Use `doc <url>` to get full details on a specific API found in search results
- Use `symbols <framework> --type <type>` to find specific classes/structs/protocols
- Use `platform <url>` to check OS version requirements
- Use `wwdc-search` to find implementation guidance from WWDC talks
- Chain commands when needed: search → doc → related
