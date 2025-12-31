import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@app": path.resolve(__dirname, "./src/app"),
      "@app/assets": path.resolve(__dirname, "./src/app/config/modules/assets"),
      "@app/match": path.resolve(__dirname, "./src/app/config/modules/match"),
      "@app/togel": path.resolve(__dirname, "./src/app/config/modules/togel"),
      "@app/theme": path.resolve(__dirname, "./src/app/config/modules/theme"),
      "@app/layout": path.resolve(__dirname, "./src/app/config/modules/layout"),
      "@app/shared": path.resolve(__dirname, "./src/app/config/modules/shared"),
      "@app/mode": path.resolve(__dirname, "./src/app/config/modules/mode"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.js",
  },
});
