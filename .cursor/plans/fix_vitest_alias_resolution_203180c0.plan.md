---
name: Fix Vitest Alias Resolution
overview: Fix Vitest alias resolution by switching from regex-based to string-based aliases, removing duplicate alias placement, and fixing test file detection patterns.
todos:
  - id: update-alias-config
    content: Update alias.config.js to use object-based aliases instead of regex
    status: completed
  - id: update-vitest-config
    content: Update vitest.config.js to remove test.alias and fix include/exclude
    status: completed
  - id: update-package-scripts
    content: Simplify test script in package.json
    status: completed
  - id: verify-tests
    content: Run npm test to verify all tests pass
    status: completed
---

# Fix Vitest + Vite Alias Resolution

## Root Cause Analysis

**Issue 1: Regex aliases not resolving in Vitest**

- The current `alias.config.js` uses regex patterns (`/^@domains\//`) 
- Vitest's resolver handles regex differently than Vite in some edge cases
- **Solution**: Use simple string patterns instead (most compatible)

**Issue 2: Duplicate alias placement**

- `vitest.config.js` puts aliases in BOTH `resolve.alias` AND `test.alias`
- This can cause conflicts; Vitest only needs `resolve.alias`
- **Solution**: Remove `test.alias`, keep only `resolve.alias`

**Issue 3: Helper file detected as test**

- Include pattern `src/**/__tests__/**/*.{js,jsx}` catches `test-utils.js`
- This file has no `describe`/`it` blocks, causing "No test suite found"
- **Solution**: Exclude files with `-utils` suffix OR rename the file

## Configuration Strategy

Use **simple string aliases** (not regex) in a shared config file. This format is the most compatible across Vite, Vitest, and other tools.

## Final File Contents

### 1. [alias.config.js](alias.config.js)

```javascript
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Simple string-based aliases (most compatible with Vite + Vitest)
const alias = {
  // Barrel exports (exact match)
  "@app": path.resolve(__dirname, "src/app/index.js"),
  "@components": path.resolve(__dirname, "src/components/index.js"),
  "@hooks": path.resolve(__dirname, "src/hooks/index.js"),
  "@services": path.resolve(__dirname, "src/services/index.js"),
  "@modes": path.resolve(__dirname, "src/modes/index.js"),
  "@utils": path.resolve(__dirname, "src/utils/index.js"),
  "@data": path.resolve(__dirname, "src/data/index.js"),
  "@domains": path.resolve(__dirname, "src/domains"),

  // Deep imports (folder prefixes)
  "@app/": path.resolve(__dirname, "src/app/"),
  "@components/": path.resolve(__dirname, "src/components/"),
  "@hooks/": path.resolve(__dirname, "src/hooks/"),
  "@services/": path.resolve(__dirname, "src/services/"),
  "@modes/": path.resolve(__dirname, "src/modes/"),
  "@utils/": path.resolve(__dirname, "src/utils/"),
  "@data/": path.resolve(__dirname, "src/data/"),
  "@domains/": path.resolve(__dirname, "src/domains/"),
};

export default alias;
```



### 2. [vite.config.js](vite.config.js)

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import alias from "./alias.config.js";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias,
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
```



### 3. [vitest.config.js](vitest.config.js)

```javascript
import { defineConfig } from "vitest/config";
import alias from "./alias.config.js";

export default defineConfig({
  resolve: {
    alias,
  },
  test: {
    include: ["src/**/*.test.{js,jsx}"],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/__tests__/*-utils.{js,jsx}",
      "**/__tests__/test-utils.{js,jsx}",
    ],
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.js",
  },
});
```



### 4. [package.json](package.json) scripts section (unchanged, verify only)

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint --cache --max-warnings=0 \"src/**/*.{js,jsx}\"",
    "test": "vitest run",
    "check": "npm run lint && npm run test"
  }
}
```



## Why This Works

1. **String aliases**: Vite and Vitest both support object-based aliases where keys are strings. This is simpler and more reliable than regex patterns.
2. **Order matters**: The exact match (`@hooks`) should come before prefix match (`@hooks/`). In an object, iteration order is preserved for string keys.
3. **No duplicate alias**: Removing `test.alias` ensures Vitest uses only `resolve.alias`, avoiding any conflict.
4. **Proper test exclusion**: The exclude pattern prevents helper files from being treated as test suites.

## Verification Commands

```bash
# 1. Verify alias appears in config
npx vitest --config vitest.config.js list

# 2. Run tests
npx vitest run

# 3. Run via npm script
npm run test
```



## Troubleshooting

If still failing: