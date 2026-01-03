## Tahapan Improvisasi Sistem (Pasca Migrasi Vite)

### 1. Inventaris Struktur & Dependensi
- **Entry**: `index.html` + `src/main.jsx` (Vite dev server). Tailwind/PostCSS dikompilasi ke `src/index.css`.
- **Data & Utilities**: `src/data/app-data.js`, `src/utils/canvas/`.
- **Globals & Registry**: `src/app/app-environment.js`, `src/app/config/globals.js`.
- **Mode**: `src/app/mode-*.js`, `src/modes/**`.
- **Hooks**: `src/hooks/*`.
- **Komponen**: `src/components/**`.
- **App utama**: `src/App.jsx`.
- **Aset**: `public/assets`.

### 2. Boundary Enforcement (Phase 2B–2E)
- ✅ Phase 2B complete
- ✅ Phase 2C complete
- ✅ Phase 2D complete
- ✅ Phase 2E complete

### 3. Outcome
- Batas arsitektur terdokumentasi jelas dan konsisten lint enforcement (Rule #1–#5).
- Arah import antarlayer lebih eksplisit; app layer tidak lagi menjadi barrel lintas layer.
- Risiko regresi boundary berkurang lewat aturan lint yang memblokir import terlarang.
- Komponen kritikal (BannerHeader) menerima konfigurasi via props sesuai boundary rules.

### 4. Fokus Refactor Berikutnya
1. **Penguatan Modul ESM**
   - Pastikan setiap hook/komponen besar dipecah menjadi modul kecil sehingga konsumennya tidak saling bergantung (lanjutkan refactor `MatchListForm` & layout panel).
   - Sediakan titik ekspor tunggal untuk data/globals agar reuse di test/CLI lebih mudah.
2. **State/Data Context**
   - Siapkan context untuk AppData/Globals agar komponen tidak perlu memanggil helper global tiap render.
3. **Pemecahan Modul**
   - `MatchListForm` masih menyimpan banyak logika dalam satu file; bagi ke sub-komponen (BrandSelector, MatchFieldset, TogelControls).
4. **Validasi & Testing**
   - Tambahkan linting/formatting standar (`eslint + prettier`) serta tes render minimal agar mudah mengecek regresi.
5. **Asset Pipeline**
   - Dokumentasikan proses penambahan aset baru di repo (lihat `docs/ASSETS.md`) serta siapkan skrip untuk memvalidasi berkas `.webp`.

### 5. Tugas Kebersihan (Sudah Dilakukan / Sedang Berjalan)
- Migrasi penuh ke Vite + Tailwind CLI.
- Registrasi komponen/hooks/mode melalui `AppEnvironment`.
- Pembersihan console log dan event legacy (`matchlistformready`).

### 6. Dokumentasi Lanjutan
- **docs/ARCHITECTURE.md**: menggambarkan arsitektur terbaru (Vite + modul ESM).
- **docs/ASSETS.md**: panduan struktur aset di `public/assets`.
- Tambahkan catatan changelog jika ada fitur besar / refactor signifikan.

Dokumen ini diperbarui untuk menggambarkan kondisi pasca-migrasi serta daftar pekerjaan lanjutan supaya sistem semakin modular dan bebas dari ketergantungan global.

