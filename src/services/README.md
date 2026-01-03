# Services Directory

Core services that orchestrate rendering, exporting, and background removal for Banner Generator.

## Overview

- `banner-renderer.js` – canvas-based renderer with caching, multi-mode input, and asset orchestration.
- `banner-exporter.js` – PNG and ZIP exporters that reuse the renderer and JSZip.
- `background-removal.js` – integration with the configured remove-bg service (player/logo).

## Architecture

```
App.jsx / hooks --> render configuration --> render_banner --> utils/canvas
                               |
                               +--> exporter (PNG/ZIP)
                               |
                               +--> background removal helpers
```

## Usage Examples

### Render a banner

```javascript
const canvasRef = useRef(null);
await renderBanner({
  canvasRef,
  assets: { loadCachedOptionalImage },
  state: bannerState,
  helpers: { deriveBrandPalette, formatMatchDateLabel, formatMatchTimeLabel },
  caches: { brandPaletteCacheRef, baseLayerCacheRef, headerLayerCacheRef },
});
```

### Export PNG

```javascript
await exportPng({
  renderBanner,
  canvasRef,
  filenamePrefix: "banner-mode",
});
```

### Export ZIP

```javascript
await exportZip({
  renderBanner,
  canvasRef,
  brandOptions: AVAILABLE_BRAND_LOGOS,
  createBrandSlug,
  resolveFooterSrcForBrand,
  backgroundLookup: BACKGROUND_LOOKUP,
  modeBackgroundDefaults: MODE_BACKGROUND_DEFAULTS,
  defaultEsportMiniBanner: DEFAULT_ESPORT_MINI_BANNER,
  prefetchImages,
  activeMode,
  isTogelMode,
  togelBackgroundSrc,
  togelPool,
  includeMiniBanner,
  onProgress: (progress) => console.log("export", progress),
});
```

### Remove background

```javascript
if (isBackgroundRemovalConfigured()) {
  const cleaned = await removePlayerBackground(dataUrl, { signal });
}
```

## Parameter Guidance

- `renderBanner` accepts rich parameter objects (`state`, `togel`, `raffle`, `helpers`, etc.) so that each hook can pass only the relevant parts without peeking inside.
- `exportZip` relies on config helpers (`createBrandSlug`, `resolveFooterSrcForBrand`, `backgroundLookup`, etc.) that should be imported from hooks or `app/index`.
- Background removal helpers throw descriptive errors when the env variables (`VITE_REMOVE_BG_ENDPOINT`, `VITE_REMOVE_LOGO_BG_ENDPOINT`, `VITE_REMOVE_BG_TOKEN`) are missing.

## Best Practices

- Import canvas helpers directly from `../utils/canvas`.
- Keep `renderBanner` side-effect free by passing `overrides` for batching instead of mutating `state`.
- Use the `onProgress` callback in `exportZip` to update UI when exporting many brands.
- Wrap background removal calls in `try/catch` because it performs network requests.

## Troubleshooting

- **renderer returns null** – verify `canvasRef.current` is available before calling `renderBanner`.
- **ZIP export seems slow** – the exporter yields to the frame every three brands; avoid calling it on very large brand sets without `yieldToFrame`.
- **Background removal errors** – ensure the configured endpoints respond with `image` or `dataUrl` fields; the helper tries to parse both JSON and binary responses.

## Related Docs

- `docs/ARCHITECTURE.md` – overall architecture context.
- `src/utils/README.md` – utilities used by these services.

