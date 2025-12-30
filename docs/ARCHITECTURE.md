## Banner Generator – Arsitektur Kini (Vite)

### 1. Entry & Runtime
- Vite melayani `index.html` yang hanya memuat font dan `<script type="module" src="/src/main.jsx">`.
- `src/main.jsx` menjalankan `ReactDOM.createRoot` lalu langsung merender `App` (tidak ada injeksi global tambahan).
- Tailwind/PostCSS dikompilasi ke `src/index.css`.

### 2. Layer Data & Utilitas
- `src/data/helpers/*`
  - Kumpulan helper kecil yang bisa diimpor langsung, mis. `match-factory.js` (generator match kosong) dan `date-time-formatters.js` (formatter tanggal/waktu).
- `src/data/constants/placeholders.js`
  - Menyediakan konstanta placeholder (warna logo, dsb.) sebagai sumber tunggal.
- `src/domains/*`
  - Sumber data per-domain (mis. **brand**, **togel**, **teams**). Seluruh konsumen kini mengimpor langsung dari domain masing-masing tanpa perantara `app-data`.
- `src/utils/canvas-utils.js`
  - Kumpulan fungsi menggambar background, kartu pertandingan, togel result, footer, dsb. Mengekspor `CanvasUtils` sebagai modul biasa.

### 2.5 Barrel Exports (Index Files)
- `src/app/index.js` — App configuration & constants
- `src/hooks/index.js` — Semua custom hooks
- `src/components/index.js` — Semua komponen UI
- `src/utils/index.js` — Utilitas (formatter, dll.)

Pattern ini mengurangi boilerplate import dan memudahkan refactor internal struktur tanpa mengubah API publik.

### 3. Konfigurasi & App Environment
- `src/app/app-environment.js`
  - Abstraksi singleton agar modul lain dapat mendaftar hooks, komponen, dan mode tanpa bergantung pada `window.*`. Menyimpan data/globals di memori internal.
- `src/app/app-constants.js`
  - Mengimpor langsung konstanta mode/warna/layout dari modul di `src/app/config/modules/*` sehingga App.jsx tidak lagi bergantung pada `AppGlobals` dan tetap mendapatkan data yang eksplisit.
- `src/app/config/globals.js`
  - Re-export dari kumpulan modul domain-specific di `src/app/config/modules/` agar `AppEnvironment` tetap menerima bundle konstan global, sembari membuka pintu ke import langsung per modul.

### 4. Sistem Mode
- `src/app/mode-registry.js`
  - Registry terpadu untuk layout dan metadata fitur setiap mode. Resolver dan pendaftarnya diatur melalui `AppEnvironment`.
- `src/modes/layouts/*.js` & `src/modes/modules/*.js`
  - Implementasi renderer per mode (match/togel) beserta fitur defaultnya.

### 5. Hooks
- `src/hooks/background-manager.js`, `streaming-theme.js`, `togel-controls.js`
  - Hook stateful khusus banner/togel. Masing-masing diekspor sebagai modul dan juga diregistrasikan ke `AppEnvironment` untuk kompatibilitas.
- `src/hooks/use-banner-state.js`
  - Mengelola state form/banner melalui `useReducer` dan mengekspor action ter-memo untuk pemakaian di `App.jsx` dan komponen lain.
- `src/hooks/use-mode-features.js`
  - Menyediakan kalkulasi flag per mode (esports/togel/raffle, big match, dsb.) dengan membaca konfigurasi di `AppGlobals` + registry mode.
- `src/hooks/use-raffle-data.js`, `use-background-removal.js`, `use-render-scheduler.js`, `use-preview-modal.js`
  - Mengambil alih logika side-effect (fetch raffle, integrasi layanan hapus background, debounce render, serta kontrol modal preview).
- `src/hooks/props/use-match-list-form-props.js`, `use-banner-preview-props.js`
  - Membangun props untuk `MatchListForm` dan `BannerPreviewPanel` di luar `App.jsx` sehingga file utama fokus ke orkestrasi.
- `src/hooks/render/use-render-configuration.js`
  - Konsolidasi semua konfigurasi render (`assets`, `config`, `state`, `togel/raffle state`, `helpers`) untuk digunakan oleh `useBannerRenderPipeline`.

### 6. Komponen
- `src/components/layout/*.jsx`
  - `BannerHeader`, `BannerPreviewPanel`, `PreviewModal` adalah komponen pure React dan mendaftarkan dirinya ke `AppEnvironment` sehingga bisa diambil secara dinamis bila diperlukan.
- `src/components/MatchListForm.jsx`
  - Form utama untuk input pertandingan/togel, now fully modular tanpa ketergantungan global.

### 7. Servis Rendering & Export
- `src/services/banner-renderer.js`
  - Mengambil semua state + asset loader, melakukan cached rendering canvas, dan mengembalikan hasilnya. Service ini dipakai oleh `App.jsx` dan oleh proses ekspor agar draw logic konsisten.
- `src/services/banner-exporter.js`
  - Menyediakan `exportPng` & `exportZip` (menggunakan JSZip) yang mengorkestrasi render per-brand sebelum mengunduh PNG/ZIP.

### 8. Aplikasi Utama
- `src/App.jsx`
  - Bertindak sebagai orkestra: memanfaatkan hook state, mode features, scheduler, preview modal, raffle/background removal, lalu mengoper data ke `banner-renderer` & `banner-exporter`.
  - Menghubungkan registry mode untuk menggambar layout, serta meneruskan handler/actions ke `MatchListForm` dan komponen lain.

### 9. Alur Data Singkat
1. Data domain (brand/togel/teams) dan helper (`src/data/helpers/*`, `src/data/constants/*`) diimpor langsung oleh modul yang membutuhkan, lalu dikemas ulang saat diperlukan melalui `AppEnvironment`.
2. `App.jsx` mengimpor hooks, komponen, dan resolver mode sebagai modul umum.
3. Saat render, `drawMatches/drawTogelResult` menggunakan helper warna/kanvas dari bundle tersebut.
4. Hasil kanvas dipakai untuk preview, download PNG, atau ZIP multi-brand.

### 10. Fokus Perbaikan Berikutnya
- Perketat validasi input serta tambahkan pengujian otomatis untuk fungsi kanvas/togel.
- Evaluasi pemecahan ulang AppEnvironment apabila nanti diperlukan DI lintas worker/preview lain.
- Tambah dokumentasi changelog dan panduan kontribusi ketika arsitektur mengalami perubahan besar.
