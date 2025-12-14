# Banner Generator (Vite + React)

Web app untuk membuat banner (match/togel/raffle), render ke canvas, dan export sebagai PNG atau ZIP.

## Fitur Utama

- Render banner berbasis canvas + caching layer (`src/services/banner-renderer.js`)
- Export `Download PNG` & `Download ZIP` (JSZip) (`src/services/banner-exporter.js`)
- Mode/fitur terstruktur via hooks (state, scheduler, modal preview, background removal, raffle, dll) (`src/hooks/`)
- Auto logo tim dari mapping sumber (`src/data/team-logo-sources.js`)
- Aman untuk canvas: load gambar memakai proxy + `crossOrigin="anonymous"` (lihat bagian CORS)

## Quick Start

Prerequisite: Node.js 18+ (CI memakai Node 18).

```bash
npm install
npm run dev
```

Build & preview:

```bash
npm run build
npm run preview
```

Check (lint + test):

```bash
npm run check
```

## Konfigurasi (`.env`)

- `VITE_IMAGE_PROXY_BASE`  
  Base URL proxy image. Default: `https://proxy.superbia.app/image?url=`
- `VITE_IMAGE_PROXY_ALLOW_HOSTS`  
  Comma-separated allowlist host yang boleh diproxy. Jika kosong, default allow `*`.
- `VITE_REMOVE_BG_ENDPOINT`  
  Endpoint service background removal (opsional).
- `VITE_REMOVE_BG_TOKEN`  
  API key/token background removal (opsional).

## CORS & Canvas Safety (Image Proxy)

Canvas akan menjadi *tainted* bila gambar cross-origin tidak mengirim header CORS yang tepat, sehingga operasi seperti `getImageData()` / `toDataURL()` / export PNG akan gagal.

Project ini menangani itu dengan:
- Mem-proxy semua URL gambar eksternal (`http/https`) melalui `VITE_IMAGE_PROXY_BASE` (tidak mem-proxy `data:` atau `blob:`).
- Menyetel `crossOrigin = "anonymous"` pada setiap `Image()` yang dimuat untuk canvas.
- Fallback ke URL asli bila proxy gagal (agar UI tetap jalan; untuk export PNG tetap disarankan gunakan proxy).
- Untuk sumber SVG, ada konversi runtime SVG → PNG sebelum dipakai di canvas.

Konfigurasi & allowlist host berada di `src/data/app-data.js` (lihat `DEFAULT_IMAGE_PROXY_HOSTS` dan builder proxy URL).

## Struktur Project (Ringkas)

- `src/App.jsx` — orkestra utama (state, mode features, render scheduler, preview modal, raffle/background removal, render & export)
- `src/hooks/` — hooks pendukung (banner state reducer, mode features, image cache, render scheduler, preview modal, raffle, background removal, dll)
- `src/services/` — `banner-renderer.js`, `banner-exporter.js`, background removal service
- `src/data/app-data.js` — data global + helper canvas + loader gambar (proxy/CORS/SVG handling)
- `src/data/team-logo-sources.js` — sumber auto logo tim (`{ names: string[], source: string }`)
- `src/utils/canvas-utils.js` — helper menggambar layout ke canvas
- `src/app/` + `src/modes/` — registry + konfigurasi global/mode (mode layouts & modules)
- `src/components/` — UI utama (terutama `MatchListForm` + layout components)
- `docs/` — `ARCHITECTURE.md`, `ASSETS.md`, `CHANGELOG.md`

## Dokumentasi

- `docs/ARCHITECTURE.md` — ringkasan arsitektur & alur data
- `docs/ASSETS.md` — pedoman struktur aset di `public/assets/`
- `docs/CHANGELOG.md` — catatan perubahan

