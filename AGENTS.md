# AGENTS.md

Agent guidelines for josephcampuzano.com

## Project Overview

This is a personal website/blog built with Astro

## Tech Stack

- **Astro 5.6.1** - Static Site Generator
- **Tailwind CSS 4.1.13** - Utility-first CSS framework (with typography plugin)
- **TypeScript** - Type safety
- **Cloudflare Pages** - Hosting and deployment
- **Content Collections** - Blog post management with Zod schema validation

### Content Management

- Blog posts are stored as Markdown files in `src/content/posts/`
- Content schema is defined in `src/content/config.ts`
- Required frontmatter fields:
  - `title`: string
  - `preview`: string
  - `date`: date (coerced)
  - `tags`: array of strings

### Routing

- File-based routing in `src/pages/`
- Dynamic routes use `[slug].astro` pattern
- Blog posts are accessible at `/posts/[slug]`

## Development Workflow

```bash
# Start development server
bun run dev

# Build for production
bun run build

# Preview production build locally
bun run preview

# Deploy to Cloudflare Pages
bun run deploy

# Generate Cloudflare Workers types
bun run cf-typegen
```

**Note**: This project uses Bun as the package manager (see `bun.lock`).
