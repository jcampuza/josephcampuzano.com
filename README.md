# Joseph Campuzano's Personal Website

This is my personal website built with Astro and configured for deployment on Cloudflare Workers. The site features a modern, responsive design powered by Tailwind CSS.

## 🚀 Tech Stack

- [Astro](https://astro.build) - Static Site Generator
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework

## 🛠️ Development

### Prerequisites

- Node.js (Latest LTS version recommended)
- Bun

### Available Commands

```bash
# Start the development server
bun run dev

# Build the project
bun run build

# Preview the production build locally
bun run preview

# Preview Cloudflare Workers static assets locally
bun run cf:dev

# Deploy to Cloudflare Workers
bun run cf:deploy

```

## 📝 Project Structure

- `/src` - Source code
  - `/components` - Reusable React components
  - `/layouts` - Page layouts
  - `/pages` - Astro pages
  - `/styles` - Global styles and Tailwind configuration
  - `/content` - Content management
    - `/posts` - Blog posts and articles
    - `config.ts` - Content collection configuration

## 📚 Content Management

The site uses Astro's content collections for managing blog posts and articles. Content is stored in Markdown format with frontmatter for metadata.

### Blog Posts

Blog posts are stored in `/src/content/posts` as Markdown files. Each post requires the following frontmatter:

```yaml
---
title: "Post Title"
preview: "Brief description of the post"
date: "2024-04-14"
tags: ["tag1", "tag2"]
---
```

### Content Collections

The content schema is defined in `src/content/config.ts` and includes:

- Title
- Preview text
- Publication date
- Tags

## 🔧 Configuration

- `astro.config.mjs` - Astro configuration
- `tailwind.config.mjs` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `wrangler.jsonc` - Cloudflare Workers deployment configuration

## ☁️ Deploy to Cloudflare Workers

This project uses the static-assets Workers deployment model:

- Build command: `bun run build`
- Build output directory: `dist`
- Deploy command: `bun run cf:deploy` (or `wrangler deploy`)

### GitHub activity setup

The `/activity` page and `/api/github-activity.json` endpoint use Cloudflare KV to cache a
normalized public GitHub activity summary for `jcampuza`.

1. Create a GitHub token that can read public profile/repository activity.
2. Store it for deployment:

```bash
wrangler secret put GITHUB_TOKEN
```

3. For local `bun run cf:dev`, create a local `.dev.vars` file:

```bash
GITHUB_TOKEN=github_pat_or_token_here
```

4. Rerun binding type generation after changing `wrangler.jsonc`:

```bash
wrangler types
```

The `GITHUB_ACTIVITY` KV namespace is declared in `wrangler.jsonc`. The endpoint refreshes from
GitHub at most once per hour and serves stale KV data if GitHub is temporarily unavailable.

### Cloudflare dashboard setup (Workers Builds)

1. In Cloudflare, go to **Workers & Pages** and select **Create**.
2. Import this Git repository.
3. Set the build command to `bun run build`.
4. Set the deploy command to `wrangler deploy`.
5. Add any environment variables/secrets used by the project.
6. Deploy and verify the generated `*.workers.dev` URL.

### Custom domain setup

To use a custom domain with Workers, the domain must be managed in Cloudflare DNS (Cloudflare zone). Add the custom domain in your Worker settings after deployment, then switch nameservers when you are ready to cut over traffic.

## 📄 License

This project is open source and available under the MIT License.
