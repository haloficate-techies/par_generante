## Banner Generator – Arsitektur Kini (Vite)

### 1. Entry & Runtime
- Vite melayani `index.html` yang hanya memuat font dan `<script type="module" src="/src/main.jsx">`.
- `src/main.jsx` menjalankan `ReactDOM.createRoot` lalu langsung merender `App` (tidak ada injeksi global tambahan).
- Tailwind/PostCSS dikompilasi ke `src/index.css`.

### 2. Layer Data & Utilitas
- `src/data/app-data.js`
  - Menyediakan data global (brand, pool, opsi game), helper warna/kanvas (`applyFittedFont`, `drawLogoTile`, `hexToRgb`, dsb), serta fungsi pemuatan gambar.
  - Mengekspor bundle yang langsung disimpan ke `AppEnvironment` sehingga bisa diimpor atau diambil melalui adaptor.
- `src/utils/canvas-utils.js`
  - Kumpulan fungsi menggambar background, kartu pertandingan, togel result, footer, dsb. Mengekspor `CanvasUtils` sebagai modul biasa.

### 3. Konfigurasi & App Environment
- `src/app/app-environment.js`
  - Abstraksi singleton agar modul lain dapat mendaftar hooks, komponen, dan mode tanpa bergantung pada `window.*`. Menyimpan data/globals di memori internal.
- `src/app/config/globals.js`
  - Menyediakan konstanta lintas mode (default background, streaming lookup, dll) dan menyetorkannya ke `AppEnvironment`.

### 4. Sistem Mode
- `src/app/mode-layout-registry.js` & `src/app/mode-modules.js`
  - Registry untuk layout dan metadata fitur setiap mode. Resolver dan pendaftarnya diatur melalui `AppEnvironment`.
- `src/modes/layouts/*.js` & `src/modes/modules/*.js`
  - Implementasi renderer per mode (match/togel) beserta fitur defaultnya.

### 5. Hooks
- `src/hooks/background-manager.js`, `streaming-theme.js`, `togel-controls.js`
  - Hook stateful khusus banner/togel. Masing-masing diekspor sebagai modul dan juga diregistrasikan ke `AppEnvironment` untuk kompatibilitas.

### 6. Komponen
- `src/components/layout/*.jsx`
  - `BannerHeader`, `BannerPreviewPanel`, `PreviewModal` adalah komponen pure React dan mendaftarkan dirinya ke `AppEnvironment` sehingga bisa diambil secara dinamis bila diperlukan.
- `src/components/MatchListForm.jsx`
  - Form utama untuk input pertandingan/togel, now fully modular tanpa ketergantungan global.

### 7. Aplikasi Utama
- `src/App.jsx`
  - Mengatur state (judul, mode, matches, brand assets) dan memanggil hook khusus.
  - Menggunakan registry mode untuk merender canvas dan membungkus fungsi download (PNG & ZIP).

### 8. Alur Data Singkat
1. Data global dan helper diekspor dari `app-data.js` & `canvas-utils.js`, kemudian disimpan di `AppEnvironment`.
2. `App.jsx` mengimpor hooks, komponen, dan resolver mode sebagai modul umum.
3. Saat render, `drawMatches/drawTogelResult` menggunakan helper warna/kanvas dari bundle tersebut.
4. Hasil kanvas dipakai untuk preview, download PNG, atau ZIP multi-brand.

### 9. Fokus Perbaikan Berikutnya
- Perketat validasi input serta tambahkan pengujian otomatis untuk fungsi kanvas/togel.
- Evaluasi pemecahan ulang AppEnvironment apabila nanti diperlukan DI lintas worker/preview lain.
