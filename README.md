# Banner Generator

A React + Vite tool for generating square banner images (1080 × 1080) that can be previewed, downloaded as PNG, or exported in bulk for every brand. Tailwind powers the UI while custom canvas utilities render each layout mode (football, esports, togel, dll.).

## Prerequisites

- Node.js 18+
- npm 9+

## Getting Started

```bash
npm install
npm run dev
```

Visit the URL displayed by Vite (default `http://localhost:5173`) to access the builder.

## Useful Scripts

| Command          | Description                                          |
| ---------------- | ---------------------------------------------------- |
| `npm run dev`    | Start Vite dev server with hot reload.               |
| `npm run build`  | Build production assets into `dist/`.               |
| `npm run preview`| Preview the production build locally.               |
| `npm run lint`   | Run ESLint on all `src/**/*.{js,jsx}` files.        |
| `npm run test`   | Execute Vitest + Testing Library smoke tests.       |

## Tests

Tests live under `src/__tests__` and rely on Vitest with React Testing Library. They cover smoke rendering of the main app and BannerHeader component to avoid regressions.

## Project Structure (Ringkas)

- `src/App.jsx` – Core application logic (state, canvas rendering, download).
- `src/components/` – UI components (`MatchListForm`, `BannerHeader`, dsb.).
- `src/hooks/` – Custom hooks for background handling, togel controls, streaming theme.
- `src/data/app-data.js` – Brand/pool data + helper functions.
- `src/utils/canvas-utils.js` – Canvas drawing utilities.
- `docs/` – Arsitektur & panduan aset.

## Continuous Integration

CI workflows run lint, tests, and build on every push/PR via GitHub Actions (lihat `.github/workflows/ci.yml`). This keeps the project deploy-ready at all times.
