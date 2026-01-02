# Phase 3: Mode Registry Refactor Plan

## Goal
Membuat registry mode bersifat pure dengan dependency injection eksplisit melalui ModeContext.

## Why
- Meningkatkan testability dan memudahkan unit test tanpa globals.
- Menghapus implicit global state dari registry.
- Selaras dengan aturan boundary (Rule #1–#5).

## Scope
In scope:
- Refactor `mode-registry` menjadi modul murni (tanpa import app/components).
- Definisi dan penerapan ModeContext pada caller utama.
- Migrasi mode consumers untuk menerima konteks eksplisit.
- Penambahan/penyesuaian test yang relevan.

Out of scope:
- Perubahan UI/UX dan behavior runtime.
- Refactor besar pada komponen non-mode.
- Perubahan struktur folder di luar mode registry.

## Definition of Done
- Registry murni tanpa import app/components.
- ModeContext di-inject dari App layer (atau entrypoint setara).
- Mode callers menggunakan ModeContext secara konsisten.
- `pnpm test`, `pnpm lint`, dan `pnpm dev` lolos (manual switch mode).

## Key Design: ModeContext Contract (rekomendasi)
- `modeConfig`
- `brandConfig`
- `assets`
- `featureFlags`
- `timeProvider`
- `envDerived` (data turunan dari environment)

## Phases
### 3A. Audit & Mapping
- Buat dependency graph registry.
- Daftar mode + consumer.
- Identifikasi titik masuk context.

### 3B. Extract Registry Core
- Pisahkan core registry menjadi modul murni.
- Hilangkan import app/components.
- Tambah adapter tipis di app layer bila perlu.

### 3C. Migrate Modes + Callers
- Inject ModeContext ke caller utama.
- Migrasi tiap mode secara bertahap.
- Tambah test untuk kontrak ModeContext.

### 3D. Cleanup + Hardening
- Hapus legacy registrasi lama.
- Tighten lint jika aman (opsional).
- Finalize dokumentasi dan contoh usage.

## Risks & Mitigations
- Risiko: migrasi parsial memecah mode tertentu.
  - Mitigasi: migrasi per mode, tambah regression test.
- Risiko: kontrak ModeContext kurang lengkap.
  - Mitigasi: audit consumer list sebelum finalisasi.

## Rollback Plan
- Kembalikan entrypoint ke registry lama.
- Nonaktifkan injection dan gunakan adapter legacy sementara.
- Revert commit terakhir jika diperlukan.

## Validation Checklist
- `pnpm test`
- `pnpm lint`
- `pnpm dev` (manual: switch mode dan cek render)
