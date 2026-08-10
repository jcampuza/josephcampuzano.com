// @ts-check
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";

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
