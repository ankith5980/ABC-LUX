import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { createHtmlPlugin } from "vite-plugin-html";

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    tailwindcss(),
    createHtmlPlugin({
      inject: {
        tags: [
          {
            injectTo: "head",
            tag: "link",
            attrs: {
              rel: "preload",
              as: "image",
              type: "image/webp",
              href: "/src/assets/Pendant-Light-33212-25-D800xH780-Gold.webp",
            },
          },
        ],
      },
    }),
  ],
});
