# Joseph Campuzano's Personal Website

This is my personal website built with Astro and deployed on Cloudflare Pages. The site features a modern, responsive design powered by Tailwind CSS.

## 🚀 Tech Stack

- [Astro](https://astro.build) - Static Site Generator
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [Cloudflare Pages](https://pages.cloudflare.com) - Hosting platform

## 🛠️ Development

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn

### Available Commands

```bash
# Start the development server
npm run dev

# Build the project
npm run build

# Preview the production build locally
npm run preview

# Deploy to Cloudflare Pages
npm run deploy

# Generate Cloudflare Workers types
npm run cf-typegen
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

## 🚀 Deployment

The site is automatically deployed to Cloudflare Pages when changes are pushed to the main branch. The deployment process includes:

1. Building the static site with Astro
2. Deploying to Cloudflare Pages using Wrangler

## 🔧 Configuration

- `astro.config.mjs` - Astro configuration
- `tailwind.config.mjs` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `wrangler.toml` - Cloudflare Workers configuration

## 📄 License

This project is open source and available under the MIT License.
