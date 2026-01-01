import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import alias from "./alias.config.js";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias,
  },
  test: {
    alias,
    include: [
      "src/**/*.test.{js,jsx}",
      "src/**/__tests__/**/*.{js,jsx}",
    ],
    exclude: [
      "**/__tests__/test-utils.{js,jsx}",
      "**/__tests__/*-utils.{js,jsx}",
    ],
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.js",
  },
});

