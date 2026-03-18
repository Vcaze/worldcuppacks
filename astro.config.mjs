// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import customErrorOverlayPlugin from "./vite-error-overlay-plugin.js";

const isFastDev = process.env.FAST_DEV === "1";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: cloudflare(),
  integrations: [
    {
      name: "framewire",
      hooks: {
        "astro:config:setup": ({ injectScript, command }) => {
          if (command === "dev" && !isFastDev) {
            injectScript(
              "page",
              `import loadFramewire from "framewire.js";
              loadFramewire(true);`
            );
          }
        },
      },
    },
    tailwind(),
    react(),
  ],
  vite: {
    plugins: isFastDev ? [] : [customErrorOverlayPlugin()],
    cacheDir: 'node_modules/.cache/.vite',
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'zustand',
        'framer-motion',
        'date-fns',
        'clsx',
        'class-variance-authority',
        'tailwind-merge',
        'zod',
      ],
    },
  },
  devToolbar: {
    enabled: false,
  },
  image: {
    domains: [],
  },
  server: {
    allowedHosts: true,
    host: true,
  },
  security: {
    checkOrigin: false
  }
});
