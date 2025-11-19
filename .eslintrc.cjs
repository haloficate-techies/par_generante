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
        "vitest/globals": true,
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
