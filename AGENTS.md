# Commands

install: bun install
run: bun run dev
build: bun run build

# Astro Code style

Tailwind for css
Use the `cn()` utility from `@/lib/cn` for conditional classes
Typescript for code
Named imports always
Use `@/*` for imports from `src/` directory
Use Named exports for utility functions
Use `class` prop (not `className`) - Astro convention

# Content

Blog posts in `src/content/posts/` as Markdown with YAML frontmatter. frontmatter Schema defined in `src/content.config.ts` using Zod (import from `astro/zod`).

```yaml
---
title: "Post Title" # Required: string
preview: "Brief description" # Required: string (for list view)
date: "2024-04-14" # Required: date (ISO format)
tags: ["Tag1", "Tag2"] # Required: string array
---
Markdown content here...
```

## Adding a Blog Post

1. Create `src/content/posts/post-slug.md`
2. Include required frontmatter fields (title, preview, date, tags)
3. Write content in Markdown
4. Post automatically appears on homepage (sorted by date descending)