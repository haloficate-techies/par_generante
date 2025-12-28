# Modularization Progress

## Session: Quick Wins (Dec 28, 2025)

### ✅ Completed
- Split `src/app/config/globals.js` into 11 focused modules under `src/app/config/modules/`:
  - `togel/` (constants, streaming lookup, helpers)
  - `match/` (match counts, menus, league logos)
  - `assets/` (background/default constants plus resolvers)
  - `layout/` (mini-banner layout helper)
  - `theme/` (color-to-theme utilities)
  - `shared/` (slug + image loader helpers)
  - `mode/` (complete `MODE_CONFIG`)
- Converted `globals.js` into a thin re-export hub and still build `APP_GLOBALS_BUNDLE` for `AppEnvironment`.
- Documented structure via `src/app/config/modules/README.md` and updated `docs/ARCHITECTURE.md`.

### 🧠 Notes
- Backward compatibility maintained: existing consumers still use `AppEnvironment.getGlobals()`.
- New modules make it easy to import specific helpers directly in future refactors.
- Plan file: `.cursor/plans/quick_wins_30_menit_44a99389.plan.md`.

### 🚀 Next Steps
1. **Domain organization** (30 min) — move domain-specific data (`team-logo-*`, `togel-data`, `brand-assets`) into `src/domains/`.
2. **Registry consolidation** (30 min) — merge `mode-layout-registry.js` and `mode-modules.js` into a single registry.
3. **Direct imports** (45 min) — migrate key hooks/components to import from the new modules instead of `AppEnvironment`.

✅ Run `npm run dev` to verify the refactor before continuing.

