# Modes Directory

Modes directory separates rendering (layouts) from configuration (modules) and drives the per-mode flows consumed by `src/App.jsx`.

## Structure

- `layouts/` – canvas rendering implementations per mode.
- `modules/` – feature flag definitions (what controls are shown per mode).
- Layout files register themselves into `AppEnvironment` on import, which is why the files execute immediately.

```
App.jsx/hooks -> render configuration -> services/banner-renderer -> modes/layouts/*
                                                     |
                                                     +--> modes/modules/* (feature flags)
```

## Layout Renderers

- `match-mode.js` – Shared renderer for football/basketball/esports. Chooses between the grid view (`drawMatches`) and the big match layout (`drawBigMatchLayout`) depending on `activeSubMenu`.
- `raffle-mode.js` – Renders raffle event capsule + winners table via `drawRaffleDateCapsule` and `drawRaffleWinnersTable`.
- `togel-mode.js` – Delegates to `drawTogelResult` to paint digits, pool labels, and streaming info.

### Render Parameters

Each renderer expects a `ctx` (the banner canvas context), palette data, and mode-specific payloads:

- Matches: `matchesWithImages`, `matchesStartY`, `brandPalette`, `miniBannerLayout`, `bigMatchDetails`.
- Raffle: `raffleData` (winners/info/event label) + `matchesStartY`.
- Togel: `togelData` (digits, pool code/label, draw time, streaming info) + `matchesStartY`.

## Modules

- `match-modes.js` registers the shared match module for `default`, `football`, `basketball`, `esports`, and `raffle`.
- `togel-mode.js` registers the dedicated togel module. Each module exposes `type` + feature flags such as `showTitle`, `showMatches`, and `showTogelControls`.

## Usage Notes

1. Layouts import helpers directly from `src/utils/canvas/` and register themselves via `AppEnvironment.getModeRegistry()` to keep rendering logic declarative.
2. Modules augment the mode registry with feature metadata used by `useModeFeatures` and `MatchListForm`.
3. The files execute upon import (side-effects) intentionally so bundling/hot reload loads the modes automatically. Treat them as initialization scripts.

## Adding a New Mode

1. Add a renderer under `layouts/` (or reuse an existing one) and export the `render*Layout` function.
2. Register it with `AppEnvironment.getModeRegistry().registerModeLayout(modeId, { renderContent: render*Layout })`.
3. Add a module definition under `modules/` to control feature flags and register it via `registerModeModule(modeId, { type, features })`.
4. Ensure `src/App.jsx` selects the mode ID when calling `useModeFeatures`.

## Troubleshooting

- **No rendering occurs** – confirm the layout file is imported/registered; check browser console for `Mode layout "<mode>" belum terdaftar`.
- **Mode shares wrong features** – update the module feature object (e.g., `includeMiniBanner`) and restart the app so the registry reinitializes.
- **Canvas utilities fail** - ensure renderer imports from `src/utils/canvas`.

