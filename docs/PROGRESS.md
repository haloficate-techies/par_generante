# Modularization Progress

## Session: Phase 3 Kickoff (2026-01-04)
- PR-1: Audit & Mapping + plan hardening
- Scope: Audit mode registry dependencies, define ModeContext draft, expand Phase 3 plan.
- Files changed (high level): `docs/ARCHITECTURE.md`, `docs/PHASE-3-PLAN.md`, `docs/PROGRESS.md`.
- Verification (pnpm): `pnpm lint` (pass), `pnpm test` (pass with ReactDOM warnings), `pnpm dev` (started on :5174, terminated due to timeout; manual mode switch pending).
- Notes/Risks: No runtime changes; plan assumes legacy adapter during migration. React 18 test warnings observed in hooks suites.
- Next: PR-2 extract registry core + adapter.

## Session: Phase 3 PR-2 (2026-01-04)
- PR-2: Extract registry core + adapter
- Scope: Introduce pure registry core module and rewire legacy adapter in app layer.
- Files changed (high level): `src/app/mode-registry-core.js`, `src/app/mode-registry.js`, `src/app/__tests__/mode-registry-core.test.js`, `docs/ARCHITECTURE.md`, `docs/PHASE-3-PLAN.md`, `docs/PROGRESS.md`.
- Verification (pnpm): `pnpm lint` (pass), `pnpm test` (pass with ReactDOM warnings + mode registry stdout), `pnpm dev` (started on :5175, terminated due to timeout; manual mode switch pending).
- Notes/Risks: No behavior changes expected; adapter still owns runtime wiring. React 18 test warnings observed in hooks suites.
- Next: PR-3 migrate callers to injected registry/context.

## Session: Phase 3 PR-3 (2026-01-04)
- PR-3: Migrate callers to injected registry/context
- Scope: Introduce ModeContext and pass registry access through hooks/services.
- Files changed (high level): `src/app/mode-context.js`, `src/app/index.js`, `src/App.jsx`, `src/hooks/use-mode-features.js`, `src/hooks/render/use-render-configuration.js`, `src/hooks/__tests__/use-mode-features.test.js`, `src/hooks/README.md`, `docs/ARCHITECTURE.md`, `docs/PHASE-3-PLAN.md`, `docs/PROGRESS.md`.
- Verification (pnpm): `pnpm lint` (pass), `pnpm test` (pass with ReactDOM warnings + mode registry stdout), `pnpm dev` (started on :5176, terminated due to timeout; manual mode switch pending).
- Notes/Risks: ModeContext still uses legacy adapter for registry; layouts/modules migration deferred to PR-4. React 18 test warnings observed in hooks suites.
- Next: PR-4 migrate layouts/modules to injected registry.

## Session: Basketball Row Layout (2026-01-04)
- PR-UX-1: Basketball schedule row layout update
- Scope: Update basketball schedule match row rendering to trapezoid layout (canvas) per Canva spec.
- Files changed (high level): `src/utils/canvas/matches.js`, `docs/PROGRESS.md`, `docs/CHANGELOG.md`.
- Verification (pnpm): `pnpm lint` (pass), `pnpm test` (pass with ReactDOM warnings + mode registry stdout), `pnpm dev` (started on :5177, terminated due to timeout; manual review pending).
- Notes/Risks: UI change applied only for basketball schedule rows; other modes untouched. React 18 test warnings observed in hooks suites.
- Next: Manual visual review in dev, then decide whether to proceed with PR-4.

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
1. ✅ **Domain organization** (30 min) — moved domain-specific data (`team-logo-*`, `togel-data`, `brand-assets`) into `src/domains/`.
2. ✅ **Registry consolidation** (30 min) — merged `mode-layout-registry.js` and `mode-modules.js` into `src/app/mode-registry.js`.
3. ✅ **Direct imports** (45 min) — migrate key hooks/components to import from the new modules instead of `AppEnvironment`.
4. ✅ **App-constants migration** (60 min) — moved `app/app-constants.js` entirely onto module imports instead of the `AppGlobals` aggregator.
5. ✅ **Props extraction** (45 min) — extracted `matchListFormProps` and `bannerPreviewProps` builders from `App.jsx` into dedicated hooks to reduce complexity.
6. ✅ **Render config consolidation** (30 min) — unified all render configuration useMemo blocks into `useRenderConfiguration` to simplify `App.jsx`.
7. ✅ **Barrel exports** (60 min) — added `index.js` barrels for app, hooks, components, and utils; reduced `App.jsx` imports from 56 to ~15.

✅ Run `npm run dev` to verify the refactor before continuing.

## Session: Data Helper QA (Dec 31, 2025)

### ✅ Completed
- Added vitest coverage for new helpers: `match-factory`, `date-time-formatters`, and `image-proxy`.
- Documented helper exports with JSDoc for IntelliSense (`src/data/helpers`, `src/data/constants`, `src/data/image-proxy.js`).
- Ran `npm test` to confirm all suites pass with the new coverage.

### 🧠 Notes
- Image proxy defaults now include exhaustive allowlist coverage, so tests focus on valid vs invalid inputs instead of fake blocklists.
- Helper tests serve as executable documentation for future refactors in the data layer.

## Session: Boundary Audit (Jan 2, 2026)

### ✅ Completed
- Conducted Phase 2 audit: comprehensive import graph analysis across all layers
- Analyzed `app/index.js` god module pattern (6 consumers, 12+ re-exports)
- Identified 4 components violating boundary by importing `AppEnvironment`
- Checked utils layer purity (found acceptable `utils/ ↔ data/` peer dependency)
- Verified domain isolation (no cross-domain imports found)
- AppEnvironment usage audit: confirmed `getGlobals()` fully eliminated, registry methods still in use
- Circular dependency check: ✅ **ZERO circular dependencies** (madge scan on 163 files)
- Test execution: ✅ **26 tests passing** across 8 suites
- Created comprehensive audit report: `docs/AUDIT-REPORT.md`

### 🧠 Notes
- God module confirmed: `app/index.js` re-exports from domains, utils, and data layers
- Component registration (`registerComponent`, `registerHook`) is dead code with no consumers
- Mode registry is the only legitimate use case for `AppEnvironment` remaining
- `data/` layer acts as peer to `utils/` (both are pure utilities)
- No deep imports to `app/config/modules/*` from outside `app/` (Rule #3 already enforced)

### 🔥 Critical Action Items (Priority Order)
1. **Remove dead code**: Delete all `registerComponent` and `registerHook` calls (7 files)
2. **Fix component boundaries**: Remove `AppEnvironment` imports from components (4 files)
3. **Split barrel exports**: Break `app/index.js` god module into focused barrels
4. **Clarify layer rules**: Update Rule #4 to allow `utils/ ↔ data/` peer imports
5. **Add test coverage**: Create tests for `app/config/modules/*` (resolvers, utils)

### 📋 Boundary Rules Status
- Rule #1 (No cross-layer re-exports): 🚨 Violated (app/index.js)
- Rule #2 (Components no AppEnvironment): 🚨 Violated (4 components)
- Rule #3 (No deep config imports): ✅ Compliant
- Rule #4 (Utils must be pure): ⚠️ Needs clarification (data/ peer relationship)
- Rule #5 (Domains isolated): ✅ Compliant

### 🚀 Next Steps
1. Phase 2 Implementation: Apply boundary fixes (estimated 6-8 hours)
2. Add eslint rules for boundary enforcement
3. Phase 3: Mode registry refactor (replace dynamic registration with static imports)

