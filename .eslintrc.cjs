module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended", "plugin:vitest/recommended"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,

































































    },
    sourceType: "module",
  },
  overrides: [
    {
      files: ["src/__tests__/**/*.js", "src/__tests__/**/*.jsx", "src/setupTests.js"],
      env: {
        "vitest/env": true,
      },
    },
    // Boundary Rule #2: Components cannot import AppEnvironment
    {
      files: ["src/components/**/*.js", "src/components/**/*.jsx"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                group: ["../app/app-environment*", "../../app/app-environment*"],
                message: "Components should not import AppEnvironment. Use props instead.",
              },
            ],
          },
        ],
      },
    },
    // Boundary Rule #3: No deep imports to app/config/modules from outside app/
    {
      files: ["src/hooks/**", "src/components/**", "src/services/**", "src/modes/**", "src/utils/**", "src/domains/**", "src/data/**"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                group: ["**/app/config/modules/**"],
                message: "Import from app/index.js instead of deep config modules.",
              },
            ],
          },
        ],
      },
    },
    // Boundary Rule #4: Utils must be pure (no imports from upper layers)
    {
      files: ["src/utils/**/*.js", "src/utils/**/*.jsx"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                group: ["**/app/**"],
                message: "Utils cannot import from app layer. Pass as parameter instead.",
              },
              {
                group: ["**/domains/**"],
                message: "Utils cannot import from domains layer. Pass as parameter instead.",
              },
              {
                group: ["**/hooks/**"],
                message: "Utils cannot import from hooks layer.",
              },
              {
                group: ["**/components/**"],
                message: "Utils cannot import from components layer.",
              },
              {
                group: ["**/modes/**"],
                message: "Utils cannot import from modes layer.",
              },
              {
                group: ["**/services/**"],
                message: "Utils cannot import from services layer.",
              },
            ],
          },
        ],
      },
    },
    // Boundary Rule #5: Domains must be isolated (no cross-domain imports)
    {
      files: ["src/domains/brand/**"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                group: ["**/domains/teams/**"],
                message: "Brand domain cannot import from teams domain. Extract shared logic to data/helpers if needed.",
              },
              {
                group: ["**/domains/togel/**"],
                message: "Brand domain cannot import from togel domain. Extract shared logic to data/helpers if needed.",
              },
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
                group: ["**/domains/brand/**"],
                message: "Teams domain cannot import from brand domain. Extract shared logic to data/helpers if needed.",
              },
              {
                group: ["**/domains/togel/**"],
                message: "Teams domain cannot import from togel domain. Extract shared logic to data/helpers if needed.",
              },
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
                group: ["**/domains/brand/**"],
                message: "Togel domain cannot import from brand domain. Extract shared logic to data/helpers if needed.",
              },
              {
                group: ["**/domains/teams/**"],
                message: "Togel domain cannot import from teams domain. Extract shared logic to data/helpers if needed.",
              },
            ],
          },
        ],
      },
    },
  ],
  plugins: ["react", "vitest"],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "react/prop-types": "off",
  },
};
