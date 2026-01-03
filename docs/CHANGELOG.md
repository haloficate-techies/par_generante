# Changelog

## 2025-12-13

- Modularised `src/App.jsx` by extracting hook/service logic:
  - Added `use-banner-state`, `use-mode-features`, `use-raffle-data`, `use-background-removal`, `use-render-scheduler`, and `use-preview-modal`.
  - Moved canvas rendering to `src/services/banner-renderer.js` and export utilities to `src/services/banner-exporter.js`.
- Updated `docs/ARCHITECTURE.md` to describe the new hooks/services and the refined application flow.
- Added render scheduling guards to prevent infinite re-render loops during bulk export.

## 2026-01-04

- Refactor/internal: extracted a pure mode registry core and kept a legacy adapter in `src/app/mode-registry.js`.
- Refactor/internal: added ModeContext assembly and injected registry access into hooks/services.

