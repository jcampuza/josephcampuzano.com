// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  vite: {
    server: {
      allowedHosts: [".ts.net"],
    },
    // @ts-ignore tailwindcss plugin has issues
    plugins: [tailwindcss()],
  },

  prefetch: {
    defaultStrategy: "viewport",
  },

  adapter: cloudflare(),
});
