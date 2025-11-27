## Pedoman Aset Banner

### Struktur Direktori
- `public/assets/BRAND/`  
  Logo brand untuk header (303VIP, 7METER, dll). Digunakan pada slot utama di bagian atas banner.
- `public/assets/BOLA/banner_background/`  
  Background khusus sepak bola. Nama file = nama brand (uppercase) + `.webp`. Ada fallback `BACKGROUND.webp`.
- `public/assets/BOLA/banner_footer/`  
  Banner footer setiap brand (disorot di bagian bawah).
- `public/assets/BASKET/banner_background/`  
  Background khusus mode basket dengan pola sama (nama brand + `.webp` + `BACKGROUND.webp`).
- `public/assets/ESPORT/banner_background/` & `public/assets/ESPORT/banner_footer/`  
  Varian background/footer untuk mode esports.
- `public/assets/ESPORT/logo_game/`  
  Ikon permainan (DOTA_2.webp, VALORANT.webp, dll) yang dipilih user pada mode esports.
- `public/assets/ESPORT/mini_banner_footer/`  
  Mini banner tambahan untuk mode esports (disisipkan di tengah layout).
- `public/assets/TOTO/...`  
  Background/footer khusus mode togel (per pool).

### Konvensi Penamaan
1. **Brand**: gunakan huruf kapital dan garis bawah (`BIGDEWA.webp`). Konsisten dengan entri `BRAND_NAMES`.
2. **Pool Togel**: nama file sesuai kode pool (`TOTO_MACAU.webp`, `SYDNEY_LOTTO.webp`).
3. **Game Esports**: nama uppercase dengan underscore (`CALL_OF_DUTY.webp`).

### Cara Menambah Brand Baru
1. Tambah file logo header di `assets/BRAND/BRAND.webp`.
2. Tambah footer di `assets/BOLA/banner_footer/BRAND.webp`.
3. (Opsional) Tambah background per mode:
   - Bola: `public/assets/BOLA/banner_background/BRAND.webp`
   - Basket: `public/assets/BASKET/banner_background/BRAND.webp`
   - Esports: `public/assets/ESPORT/banner_background/BRAND.webp`
4. Masukkan nama brand ke `BRAND_NAMES` (`src/data/app-data.js`) agar otomatis ter-register.

### Cara Menambah Pool Togel Baru
1. Sediakan background di `public/assets/TOTO/banner_background/POOLNAME.webp`.
2. Jika perlu, sediakan footer di `public/assets/TOTO/banner_footer/POOLNAME.webp`.
3. Update `TOGEL_POOL_OPTIONS` & `TOGEL_POOL_BACKGROUND_LOOKUP` di kode.
4. Tambahkan jadwal di `TOGEL_DRAW_TIME_LOOKUP` bila ada.

### Optimasi
- Format default: `.webp` untuk ukuran kecil namun tetap tajam di kanvas 1920×1080.
- Rekomendasi resolusi minimum:
  - Background: ≥1920×1080.
  - Logo header/footer: tinggi ≥200 px.
  - Logo game: 512×512 atau square.
- Kompres file sebelum commit untuk menjaga performa load awal.
