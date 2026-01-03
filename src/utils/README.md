# Utils Directory

Koleksi utilitas untuk rendering canvas, formatting data, dan manipulasi image dalam Banner Generator.

## 📁 Struktur Directory

```
src/utils/
├── canvas/                      # Canvas drawing utilities
│   ├── background.js           # Background & overlay rendering
│   ├── color.js                # Color blending & luminance
│   ├── constants.js            # Shared constants & helpers
│   ├── date.js                 # Date formatting for canvas
│   ├── footer.js               # Footer & mini-banner rendering
│   ├── geometry.js             # Rounded rectangles & shapes
│   ├── header.js               # Header & logo rendering
│   ├── image.js                # Image cover/fit utilities
│   ├── index.js                # Barrel export
│   ├── matches.js              # Match card rendering
│   ├── matches/
│   │   └── helpers.js          # Match-specific helpers
│   ├── raffle/
│   │   ├── capsule.js          # Date capsule rendering
│   │   ├── format.js           # Raffle text formatting
│   │   ├── index.js            # Barrel export
│   │   └── table.js            # Winners table rendering
│   └── togel/
│       ├── digits.js           # Digit normalization
│       ├── index.js            # Barrel export
│       ├── render.js           # Togel result rendering
│       └── streaming-style.js  # Streaming theme colors
├── formatters/                  # Data formatters
│   ├── match.js                # Match date/time formatting
│   └── raffle.js               # Raffle date/prize formatting
├── canvas/                    # Canvas rendering helpers
├── color-utils.js              # Color manipulation utilities
├── draw-logo-tile.js           # Logo tile rendering
├── image-loader.js             # Image loading & processing
└── index.js                    # Main barrel export
```

---

## 🚀 Usage Examples

### Formatters

```javascript
import {
  formatMatchDateLabel,
  formatMatchTimeLabel,
  formatRaffleEventLabel,
} from '../utils';

// Format match date
const dateLabel = formatMatchDateLabel('2025-12-30');
// Output: "Selasa, 30 Desember 2025"

// Format raffle event
const eventLabel = formatRaffleEventLabel(raffleInfo);
// Output: "EVENT TAHUN BARU 2025"
```

### Canvas Utilities (Modern Approach)

```javascript
import {
  drawBackground,
  drawHeader,
  drawMatches,
  drawFooter,
} from '../utils/canvas';

// Draw background
drawBackground(ctx, backgroundImage, canvasWidth, canvasHeight);

// Draw header with logo
drawHeader(ctx, {
  brandLogo: logoImage,
  title: 'JADWAL PERTANDINGAN',
  palette: brandPalette,
});

// Draw match cards
drawMatches(ctx, {
  matches: visibleMatches,
  startY: 200,
  layout: 'standard',
});
```

### Canvas Utilities

```javascript
import { drawBackground, drawHeader } from '../utils/canvas';

drawBackground(ctx, backgroundImage, width, height);
drawHeader(ctx, options);
```

Note: import canvas helpers from `../utils/canvas` to keep rendering helpers centralized.

### Color Utilities

```javascript
import {
  hexToRgb,
  mixColors,
  lightenColor,
  darkenColor,
  deriveBrandPalette,
} from '../utils/color-utils';

// Convert hex to RGB
const rgb = hexToRgb('#6366f1');
// { r: 99, g: 102, b: 241 }

// Mix two colors
const mixed = mixColors('#6366f1', '#ec4899', 0.5);
// Returns blended hex color

// Derive palette from brand logo
const palette = deriveBrandPalette(logoImage);
// {
//   headerStart: '#...',
//   headerEnd: '#...',
//   footerStart: '#...',
//   footerEnd: '#...',
//   accent: '#...'
// }
```

### Image Loading

```javascript
import {
  loadOptionalImage,
  loadTeamLogoImage,
  readFileAsDataURL,
} from '../utils/image-loader';

// Load image with fallback
const image = await loadOptionalImage(imageUrl);
// Returns Image or null

// Load team logo with auto-processing
const logo = await loadTeamLogoImage(logoUrl, {
  applyAutoProcessing: true, // Removes white background
});

// Read uploaded file
const dataUrl = await readFileAsDataURL(file, {
  maxDimension: 640,
  outputType: 'image/png',
});
```

### Logo Drawing

```javascript
import { drawLogoTile } from '../utils/draw-logo-tile';

// Draw circular logo with border
drawLogoTile(
  ctx,
  logoImage,
  x,
  y,
  size,
  'Team Name', // Fallback for initials
  {
    scale: 1.2,
    offsetX: 0,
    offsetY: 0,
    paddingRatio: 0.08,
  }
);
```

---

## 📦 Main Exports

### From `src/utils/index.js`

```javascript
// Date/Time Formatters
export { formatMatchDateLabel, formatMatchTimeLabel } from './formatters/match';

// Raffle Formatters
export {
  formatRaffleEventLabel,
  formatRaffleDateLabel,
  extractRaffleSlug,
  formatPrizeAmountLabel,
  mapRaffleWinners,
} from './formatters/raffle';
```

### From `src/utils/canvas/index.js`

```javascript
// All canvas drawing functions
export * from './background';  // drawBackground, drawOverlay
export * from './header';      // drawBrandLogo, drawHeader
export * from './matches';     // drawMatches, drawScoreboardMatches, drawBigMatchLayout
export * from './footer';      // drawFooter, drawMiniFooterBanner
export * from './togel';       // drawTogelResult
export * from './raffle';      // drawRaffleDateCapsule, drawRaffleWinnersTable
export * from './color';       // Color blending utilities
export * from './geometry';    // Rounded rect helpers
export * from './image';       // drawImageCover
export * from './constants';   // Shared constants
```

---

## 🎨 Key Functions Reference

### Background Rendering

**`drawBackground(ctx, backgroundImage, canvasWidth, canvasHeight)`**
- Renders background image using cover-fit logic
- Fills entire canvas maintaining aspect ratio

**`drawOverlay(ctx, palette, canvasWidth, canvasHeight, options)`**
- Draws gradient overlay for better text contrast
- Uses brand palette colors

### Header Rendering

**`drawBrandLogo(ctx, brandImage, x, y, width, height, options)`**
- Renders brand logo with optional overlay/shadow
- Supports custom positioning and sizing

**`drawHeader(ctx, config)`**
- Complete header with logo, title, and gradients
- Auto-centers text and logo

### Match Rendering

**`drawMatches(ctx, config)`**
- Renders match cards in grid layout
- Supports team logos, names, dates, times
- Handles player images for big match mode

**`drawBigMatchLayout(ctx, config)`**
- Special layout for single match highlight
- Larger logos and player images

### Togel Rendering

**`drawTogelResult(ctx, config)`**
- Renders togel result panel
- Shows pool name, draw time, digit results
- Supports streaming info integration

### Raffle Rendering

**`drawRaffleWinnersTable(ctx, config)`**
- Renders winners table with usernames and prizes
- Auto-formats prize amounts as IDR
- Handles pagination for long lists

---

## 🔧 Canvas Helper Functions

### Text Fitting

**`applyFittedFont(ctx, text, options)`**
```javascript
applyFittedFont(ctx, 'Long Team Name', {
  maxSize: 24,
  minSize: 12,
  maxWidth: 200,
  weight: 600,
  family: '"Poppins", sans-serif',
});
// Returns: actual font size used
```

### Logo Tile Drawing

**`drawLogoTile(ctx, image, x, y, size, fallbackName, options)`**
- Circular logo with border and shadow
- Shows initials if image unavailable
- Supports scale, offset, flip adjustments

### Rounded Rectangles

**`drawRoundedRectPath(ctx, x, y, width, height, radius)`**
- Creates rounded rectangle path
- Optimized with Path2D caching

**`fillRoundedRectCached(ctx, x, y, width, height, radius)`**
- Fills rounded rectangle using cached path
- Performance optimized for repeated draws

### Image Cover

**`drawImageCover(ctx, image, x, y, width, height, options)`**
```javascript
drawImageCover(ctx, playerImage, 0, 0, 500, 700, {
  scale: 1.2,
  offsetX: 0.2,
  offsetY: -0.1,
  flipHorizontal: true,
});
```

---

## 🎨 Color Utilities API

### Basic Conversions

- `hexToRgb(hex)` - Hex to RGB object
- `rgbToHex(r, g, b)` - RGB to hex string
- `rgbToHsl(r, g, b)` - RGB to HSL object

### Color Manipulation

- `mixColors(baseHex, targetHex, amount)` - Blend two colors
- `lightenColor(hex, amount)` - Lighten by mixing with white
- `darkenColor(hex, amount)` - Darken by mixing with black
- `colorDistance(colorA, colorB)` - Calculate color distance

### Brand Palette

- `deriveBrandPalette(image)` - Extract palette from logo
  - Analyzes logo pixels
  - Finds dominant vibrant colors
  - Returns gradient-ready palette

### Canvas Color Helpers

- `blendHexColors(sourceHex, targetHex, ratio)` - Similar to mixColors
- `pickReadableTextColor(startHex, endHex)` - Auto black/white text
- `getRelativeLuminanceSafe(hex)` - Calculate luminance
- `averageHexColor(startHex, endHex)` - Get midpoint color

---

## 🖼️ Image Loading Features

### SVG Support

- Auto-detects SVG URLs
- Converts SVG to PNG data URL for canvas compatibility
- Parses viewBox/width/height for proper scaling

### Background Removal

- `ensureTransparentBackground(image)` - Auto-removes white backgrounds
- Used by `loadTeamLogoImage` with `applyAutoProcessing: true`
- Smart corner sampling algorithm

### Caching

- `loadTeamLogoImage` includes built-in cache
- Reduces redundant network requests
- Separate cache keys for raw vs processed images

### Upload Processing

- `readFileAsDataURL(file, options)` - Process user uploads
- Auto-resizes large images
- Maintains aspect ratio
- Returns base64 data URL

---

## 📝 Best Practices

### ✅ DO

```javascript
// Use direct imports from canvas modules
import { drawBackground } from '../utils/canvas';

// Use formatters from barrel export
import { formatMatchDateLabel } from '../utils';

// Cache image loader for repeated use
const { loadImage } = useImageCache(loadOptionalImage);

// Use color utilities for consistent branding
const palette = deriveBrandPalette(brandLogo);
```

### ❌ DON'T

```javascript
// Avoid reimplementing canvas helpers
// Use exports from '../utils/canvas' instead

// Don't duplicate color conversion logic
// Use existing utilities instead of reimplementing

// Don't bypass image cache
// Use hooks/services that provide caching
```

---

## 🔄 Migration Guide

### Direct Imports

```javascript
import { drawBackground, drawHeader } from '../utils/canvas';

drawBackground(ctx, bg, w, h);
drawHeader(ctx, config);
```

**Benefits:**
- Tree-shaking friendly
- Better IDE autocomplete
- Clearer dependencies

---

## 🐛 Common Issues

### Issue: "Image not loading"
**Solution:** Use `loadOptionalImage` which handles CORS, proxies, and SVG conversion automatically.

### Issue: "Text too small/large"
**Solution:** Use `applyFittedFont` to auto-fit text within constraints.

### Issue: "Logo has white background"
**Solution:** Use `loadTeamLogoImage` with `applyAutoProcessing: true`.

### Issue: "Colors look wrong on canvas"
**Solution:** Ensure proper palette derivation with `deriveBrandPalette`.

---

## 📚 Related Files

- `src/data/image-proxy.js` - Image proxy configuration
- `src/services/banner-renderer.js` - Main canvas orchestration
- `src/hooks/use-image-cache.js` - Image caching hook
- `docs/ARCHITECTURE.md` - Overall architecture docs

---

## 🚦 Status

| Module | Status | Notes |
|--------|--------|-------|
| `canvas/` | ✅ Stable | Well-organized, actively maintained |
| `formatters/` | ✅ Stable | Production-ready |
| `color-utils.js` | ✅ Stable | Core color manipulation |
| `image-loader.js` | ✅ Stable | Handles SVG, CORS, processing |
| `draw-logo-tile.js` | ✅ Stable | Widely used for logos |
| `canvas/` | ✅ Stable | Canvas rendering helpers |

---

## 🤝 Contributing

When adding new utilities:

1. **Canvas functions** → Add to appropriate `canvas/*.js` file
2. **Formatters** → Add to `formatters/*.js` and re-export from `index.js`
3. **General helpers** → Consider if it belongs in `canvas/` or needs new module
4. **Update exports** → Add to relevant `index.js` barrel files
5. **Document** → Add JSDoc comments and examples

---

## 📞 Questions?

Refer to:
- `docs/ARCHITECTURE.md` - System architecture
- `docs/PROGRESS.md` - Recent changes
- Individual file comments for implementation details

