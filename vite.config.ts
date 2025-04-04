import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
  define: { "process.env": { NODE_ENV: "production" } },
  plugins: [vue({ features: { customElement: true } })],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    minify: "terser",
    lib: {
      name: "importmap-manager",
      entry: "./src/main.ts",
      formats: ["umd"],
    },
    rollupOptions: {
      output: {
        entryFileNames: "importmap-manager.js",
      },
    },
  },

});
