// @ts-check
import { defineConfig, envField } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";

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

  env: {
    schema: {
      GITHUB_TOKEN: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
    },
  },

  adapter: vercel(),
});
