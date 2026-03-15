---
description: Search Apple Developer Documentation — APIs, frameworks, WWDC videos, sample code
allowed-tools: Bash
---

You have access to the `apple-docs` CLI for querying Apple Developer Documentation in real time.

Use it whenever you need up-to-date Apple docs, API details, platform availability, WWDC content, or sample code.

## Available Commands

```
apple-docs search <query>              # Search Apple documentation
apple-docs doc <url>                   # Get full doc page content
apple-docs tech [category]             # List Apple technologies/frameworks
apple-docs symbols <framework>         # Browse framework symbols
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

## Instructions

Based on the user's question: $ARGUMENTS

1. Determine which `apple-docs` command(s) best answer the question
2. Run them using the Bash tool
3. Present the results concisely, focusing on what the user needs

### Tips
- Start with `search` for general questions
- Use `doc <url>` to get full details on a specific API found in search results
- Use `symbols <framework> --type <type>` to find specific classes/structs/protocols
- Use `platform <url>` to check OS version requirements
- Use `wwdc-search` to find implementation guidance from WWDC talks
- Chain commands when needed: search → doc → related
