module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended", "plugin:vitest/recommended"],
  parserOptions: {
    ecmaFeatures: { jsx: true },
    sourceType: "module",
  },
  plugins: ["react", "vitest"],
  settings: {
    react: { version: "detect" },
  },
  rules: {
    "react/prop-types": "off",
  },

  overrides: [
    {
      files: ["src/__tests__/**/*.js", "src/__tests__/**/*.jsx", "src/setupTests.js"],
      env: { "vitest/env": true },
    },

    /**
     * Boundary Rule #1: App layer should not import cross-layer modules
     * NOTE: allow app/config/modules/** to import domains/data (it is an adapter layer).
     */
    {
      files: ["src/app/**/*.js", "src/app/**/*.jsx"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                group: ["**/components/**"],
                message: "App layer must not import from components. Use props or adapters.",
              },
              {
                group: ["**/domains/**"],
                message: "App layer must not import domains directly. Use adapters or data/helpers.",
              },
              {
                group: ["**/utils/**"],
                message: "App layer must not import utils directly unless they are app-scoped.",
              },
              {
                group: ["**/data/**"],
                message: "App layer must not import data directly. Use adapters or injection.",
              },
              {
                group: ["**/hooks/**"],
                message: "App layer must not import hooks. Use props or adapters.",
              },
              {
                group: ["**/services/**"],
                message: "App layer must not import services directly. Use adapters or injection.",
              },
              {
                group: ["**/modes/**"],
                message: "App layer must not import modes directly. Use adapters or injection.",
              },
            ],
          },
        ],
      },
    },
    {
      files: ["src/app/index.js", "src/app/config/**/*.js", "src/app/config/**/*.jsx"],
      rules: {
        "no-restricted-imports": "off",
      },
    },


    /**
     * Boundary Rule #2 + #3 combined:
     * - Components cannot import AppEnvironment
     * - Components cannot deep-import app/config/modules/**
     */
    {
      files: ["src/components/**/*.js", "src/components/**/*.jsx"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                group: ["**/app/app-environment*"],
                message: "Components should not import AppEnvironment. Use props instead.",
              },
              {
                group: ["**/app/config/modules/**"],
                message:
                  "Do not deep-import app/config/modules outside app/. Use approved entrypoints (e.g. app/config/globals.js) or pass via props.",
              },
            ],
          },
        ],
      },
    },

    /**
     * Boundary Rule #3 (general): No deep imports to app/config/modules from outside app/
     */
    {
      files: ["src/hooks/**", "src/services/**", "src/modes/**", "src/data/**"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                group: ["**/app/config/modules/**"],
                message:
                  "Do not deep-import app/config/modules outside app/. Use approved entrypoints (e.g. app/config/globals.js) or pass via props.",
              },
            ],
          },
        ],
      },
    },

    /**
     * Boundary Rule #4: Utils must be pure
     */
    {
      files: ["src/utils/**/*.js", "src/utils/**/*.jsx"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                group: ["**/app/config/modules/**"],
                message:
                  "Do not deep-import app/config/modules outside app/. Use approved entrypoints (e.g. app/config/globals.js) or pass via props.",
              },
              { group: ["**/app/**"], message: "Utils cannot import from app layer. Pass as parameter instead." },
              { group: ["**/domains/**"], message: "Utils cannot import from domains layer. Pass as parameter instead." },
              { group: ["**/hooks/**"], message: "Utils cannot import from hooks layer." },
              { group: ["**/components/**"], message: "Utils cannot import from components layer." },
              { group: ["**/modes/**"], message: "Utils cannot import from modes layer." },
              { group: ["**/services/**"], message: "Utils cannot import from services layer." },
            ],
          },
        ],
      },
    },

    /**
     * Boundary Rule #5: Domains isolation (cross-domain restrictions)
     */
    {
      files: ["src/domains/brand/**"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                group: ["**/app/config/modules/**"],
                message:
                  "Do not deep-import app/config/modules outside app/. Use approved entrypoints (e.g. app/config/globals.js) or pass via props.",
              },
              { group: ["**/domains/teams/**"], message: "Brand domain cannot import from teams domain." },
              { group: ["**/domains/togel/**"], message: "Brand domain cannot import from togel domain." },
              { group: ["**/components/**"], message: "Domains cannot import from components." },
              { group: ["**/app/**"], message: "Domains cannot import from app layer." },
            ],
          },
        ],
      },
    },
    {
      files: ["src/domains/teams/**"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                group: ["**/app/config/modules/**"],
                message:
                  "Do not deep-import app/config/modules outside app/. Use approved entrypoints (e.g. app/config/globals.js) or pass via props.",
              },
              { group: ["**/domains/brand/**"], message: "Teams domain cannot import from brand domain." },
              { group: ["**/domains/togel/**"], message: "Teams domain cannot import from togel domain." },
              { group: ["**/components/**"], message: "Domains cannot import from components." },
              { group: ["**/app/**"], message: "Domains cannot import from app layer." },
            ],
          },
        ],
      },
    },
    {
      files: ["src/domains/togel/**"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                group: ["**/app/config/modules/**"],
                message:
                  "Do not deep-import app/config/modules outside app/. Use approved entrypoints (e.g. app/config/globals.js) or pass via props.",
              },
              { group: ["**/domains/brand/**"], message: "Togel domain cannot import from brand domain." },
              { group: ["**/domains/teams/**"], message: "Togel domain cannot import from teams domain." },
              { group: ["**/components/**"], message: "Domains cannot import from components." },
              { group: ["**/app/**"], message: "Domains cannot import from app layer." },
            ],
          },
        ],
      },
    },
  ],
};
