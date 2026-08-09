# Joseph Campuzano's Personal Website

This is my personal website built with Astro and configured for deployment on Vercel. The site features a modern, responsive design powered by Tailwind CSS.

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

## ☁️ Deploy to Vercel

Import the Git repository in Vercel. Vercel automatically detects Astro; no framework or output
directory override is required. The build command is:

- Build command: `bun run build`

### GitHub activity setup

The `/activity` page and `/api/github-activity.json` endpoint serve a normalized public GitHub
activity summary for `jcampuza`. Successful responses are cached by Vercel's CDN for one hour and
served stale while the cache revalidates for up to one day.

1. Create a GitHub token that can read public profile/repository activity.
2. Add `GITHUB_TOKEN` to the Vercel project's Production and Preview environments.
3. For local development, create a local `.env` file:

```bash
GITHUB_TOKEN=github_pat_or_token_here
```

### Custom domain setup

Add the production domains in Vercel, then configure the exact DNS records Vercel provides. The
domain can continue using Cloudflare as its DNS provider; the Vercel records should be DNS-only.

## 📄 License

This project is open source and available under the MIT License.
