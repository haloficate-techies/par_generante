---
name: Phase 2 Implementation Plan
overview: Actionable plan untuk fix 11 boundary violations yang ditemukan di audit, dengan fokus pada minimum changes, safe PR strategy, dan clear definition of done per phase.
todos:
  - id: phase-2a-prep
    content: "Pre-flight check: clean git, baseline tests, lint, dev server"
    status: pending
  - id: phase-2a-exec
    content: Remove 7 dead registration calls from components and hooks
    status: pending
    dependencies:
      - phase-2a-prep
  - id: phase-2b-exec
    content: Fix BannerHeader to receive modeConfig via props
    status: pending
    dependencies:
      - phase-2a-exec
  - id: phase-2c-barrel
    content: Remove cross-layer re-exports from app/index.js
    status: pending
    dependencies:
      - phase-2b-exec
  - id: phase-2c-consumers
    content: Update 6 consumer files to import directly from sources
    status: pending
    dependencies:
      - phase-2c-barrel
  - id: phase-2d-tests
    content: Add test coverage for app/config/modules (4-5 test files)
    status: pending
    dependencies:
      - phase-2c-consumers
---

# Phase 2 Implementation: Boundary Compliance

## Root Cause & Priority

### Root Causes

1. **God Module Pattern**: `app/index.js` me-re-export dari 5+ layers → semua consumer jadi tightly coupled
2. **Legacy Registration**: Component/hook registration calls yang tidak pernah dipakai (dead code dari refactor lama)
3. **Implicit Dependencies**: Components import `AppEnvironment` langsung instead of props (unidirectional flow broken)

### Priority Fix Order

**P0 (Zero Risk)**: Phase 2A - Dead code removal**P1 (Quick Win)**: Phase 2B - Component boundaries**P2 (High Impact)**: Phase 2C - Barrel split**P3 (Prevention)**: Phase 2D - Test coverage---

## Phase 2A: Remove Dead Code (30 min)

### Tujuan

Hapus 7 registration calls (`registerComponent`, `registerHook`) yang tidak punya consumers.

### Langkah Detail

- [ ] Remove import `AppEnvironment` dari 4 component files:
- `src/components/MatchListForm.jsx` (line 3)
- `src/components/layout/BannerPreviewPanel.jsx` (line 2)
- `src/components/layout/PreviewModal.jsx` (line 2)
- `src/components/layout/BannerHeader.jsx` (line 2)
- [ ] Remove registration calls di akhir file (lihat line numbers di [`BOUNDARY-ENFORCEMENT.md`](docs/BOUNDARY-ENFORCEMENT.md))
- [ ] Remove import `AppEnvironment` dari 3 hook files:
- `src/hooks/background-manager.js` (line 114)
- `src/hooks/streaming-theme.js` (line 59)
- `src/hooks/togel-controls.js` (line 125)
- [ ] Run tests: `npm test` (harus tetap 88 passing)
- [ ] Run dev: `npm run dev` (harus jalan tanpa error)

### Files Changed

**7 files total**: 4 components + 3 hooks**Lines removed**: ~14 lines (2 per file)**No new files**

### Risiko + Mitigasi

**Risk**: None (registration calls tidak punya consumers)**Mitigation**: Tests sudah validate bahwa App.jsx import components langsung (tidak via registry)

### Definition of Done

- [x] 0 imports `AppEnvironment` di `components/` (kecuali yang legitimate)
- [x] 0 `registerComponent` calls
- [x] 0 `registerHook` calls di hooks yang bukan mode-related
- [x] Tests: 88/88 passing
- [x] Lint: 0 errors
- [x] Dev server: runs without errors

---

## Phase 2B: Fix Component Boundaries (2 hours)

### Tujuan

`BannerHeader.jsx` tidak import `MODE_CONFIG` langsung, receive via props dari `App.jsx`.

### Langkah Detail

- [ ] **File 1**: `src/components/layout/BannerHeader.jsx`
- Add `modeConfig` to props destructuring
- Replace `MODE_CONFIG` usage dengan `modeConfig` prop
- Remove import `MODE_CONFIG` dari `app/index.js`
- [ ] **File 2**: `src/App.jsx`
- Pass `modeConfig={MODE_CONFIG}` ke `<BannerHeader />`
- Verify import `MODE_CONFIG` masih ada di App.jsx
- [ ] **Verify**: `src/components/match-form/env.js`
- Sudah import `LEAGUE_LOGO_OPTIONS` dari `app/index.js` (correct)
- No changes needed
- [ ] Run tests: `npm test`
- [ ] Visual check: Switch modes di dev server
- [ ] Run ESLint: `npm run lint` (should show 0 component violations)

### Files Changed

**2 files**: `BannerHeader.jsx`, `App.jsx`**Lines changed**: ~5 total

### Risiko + Mitigasi

**Risk Medium**: Props threading bisa lupa pass di App.jsx**Mitigation**:

1. Check PropTypes validation di BannerHeader
2. Test all modes (football, basketball, esports, togel, raffle)
3. ESLint rule akan catch future violations

**Stop Point**: Jika `BannerHeader` requires more than `modeConfig` prop, stop dan diskusi (might indicate deeper refactor needed).

### Definition of Done

- [x] `BannerHeader` receives config via props
- [x] 0 components import from `app/` layer (config-wise)
- [x] Mode switching works (visual test)
- [x] Tests: 88/88 passing
- [x] ESLint: 0 boundary violations in `components/`

---

## Phase 2C: Split Barrel Exports (3 hours)

### Tujuan

`app/index.js` hanya export dari `app/` folder, tidak re-export dari `domains/`, `data/`, `utils/`.

### Langkah Detail

**Step 1**: Update `app/index.js` (10 min)

- [ ] Remove 5 cross-layer re-exports:
  ```javascript
      // REMOVE these lines:
      export * from "../domains/brand";
      export * from "../domains/teams";
      export * from "../domains/togel";
      export * from "../utils/image-loader";
      export * from "../data/helpers/match-factory";
  ```




- [ ] Keep only app-layer exports
- [ ] Commit: "refactor(app): remove cross-layer barrel re-exports"

**Step 2**: Update `App.jsx` imports (30 min)

- [ ] Split 28 named imports ke multiple import statements by source
- [ ] Example:
  ```javascript
      // FROM app/
      import { MODE_CONFIG, resolveFooterSrcForBrand, ... } from "./app/index.js";
      // FROM domains/
      import { AVAILABLE_BRAND_LOGOS } from "./domains/brand";
      // FROM data/
      import { createInitialMatches } from "./data/helpers/match-factory";
      // FROM utils/
      import { loadOptionalImage } from "./utils/image-loader";
  ```




- [ ] Run tests after each import group change
- [ ] Commit: "refactor(App): import directly from source layers"

**Step 3**: Update hook files (1.5 hours)

- [ ] `src/hooks/streaming-theme.js` - split imports
- [ ] `src/hooks/togel-controls.js` - split imports
- [ ] `src/hooks/background-manager.js` - split imports
- [ ] Run tests after each file
- [ ] Commit per file: "refactor(hooks/X): import from source layers"

**Step 4**: Update remaining consumers (30 min)

- [ ] `src/components/match-form/env.js` - verify imports
- [ ] `src/components/layout/BannerHeader.jsx` - already fixed in Phase 2B
- [ ] Run full test suite
- [ ] Run dev server and test all features
- [ ] Commit: "refactor(components): finalize direct imports"

### Files Changed

**7 files**: `app/index.js` + `App.jsx` + 3 hooks + 2 components**Lines changed**: ~50-60 total (mostly import statements)

### Risiko + Mitigasi

**Risk Medium**: Import path errors (typos, wrong levels)**Mitigation**:

1. Change one file at a time
2. Test after each file
3. Use IDE auto-import where possible
4. Check alias config di [`alias.config.js`](alias.config.js)

**Stop Point**: Jika import errors muncul di >3 files setelah update app/index.js, stop. Might indicate missing exports atau path issues.

### Definition of Done

- [x] `app/index.js` exports reduced from 28 to ~10
- [x] 0 cross-layer re-exports di app/index.js
- [x] All consumers import directly from source
- [x] Tests: 88/88 passing
- [x] Dev server: all features working
- [x] HMR: check rebuild speed (should be faster)

---

## Phase 2D: Add Test Coverage (4 hours)

### Tujuan

Add tests untuk `app/config/modules/*` files yang belum punya coverage.

### Langkah Detail

- [ ] **Priority 1**: Test resolvers (1.5 hours)
- `app/config/modules/assets/asset.resolvers.js`
- `app/config/modules/togel/togel.utils.js`
- Create: `src/app/config/modules/__tests__/asset-resolvers.test.js`
- Create: `src/app/config/modules/__tests__/togel-utils.test.js`
- [ ] **Priority 2**: Test theme utils (1 hour)
- `app/config/modules/theme/theme.utils.js`
- Create: `src/app/config/modules/__tests__/theme-utils.test.js`
- [ ] **Priority 3**: Test layout utils (1 hour)
- `app/config/modules/layout/layout.utils.js`
- Create: `src/app/config/modules/__tests__/layout-utils.test.js`
- [ ] Run coverage: `npm test` (aim for >80% on config modules)
- [ ] Update docs if test reveals bugs
- [ ] Commit per test file: "test(app/config): add coverage for X"

### Files Changed

**4-5 new test files** in `src/app/config/modules/__tests__/`**Lines added**: ~200-300 (test code)

### Risiko + Mitigasi

**Risk Low**: Tests might reveal bugs in untested code**Mitigation**: Fix bugs as separate commits, document in CHANGELOG**Stop Point**: Jika tests reveal >5 bugs, stop dan review (might indicate config modules need refactor).

### Definition of Done

- [x] 4+ new test files created
- [x] Coverage >80% for config modules
- [x] All new tests passing
- [x] Bugs found (if any) documented and fixed
- [x] Tests serve as documentation for future devs

---

## PR Strategy

### Recommended PRs (4 total)

**PR #1: Remove Dead Code** (Phase 2A)

- Title: "refactor: remove unused component/hook registrations"
- Files: 7
- Lines: -14
- Review time: 5 min
- Risk: None

**PR #2: Fix Component Boundaries** (Phase 2B)

- Title: "refactor(components): pass config via props instead of imports"
- Files: 2
- Lines: ~5
- Review time: 10 min
- Risk: Low (visual test required)

**PR #3: Split Barrel Exports** (Phase 2C)

- Title: "refactor(app): remove cross-layer barrel re-exports"
- Commits: 4 (per file group)
- Files: 7
- Lines: ~50-60
- Review time: 20 min
- Risk: Medium (import changes)

**PR #4: Add Test Coverage** (Phase 2D)

- Title: "test(app/config): add coverage for config modules"
- Commits: 4-5 (per test file)
- Files: 4-5 new
- Lines: +200-300
- Review time: 30 min
- Risk: Low (tests only)

### Safe Commit Order

1. ✅ Remove dead code (independent)
2. ✅ Fix component props (independent)
3. ✅ Update `app/index.js` → commit
4. ✅ Update `App.jsx` → test → commit
5. ✅ Update hooks one-by-one → test each → commit each
6. ✅ Update remaining files → test → commit
7. ✅ Add tests incrementally → commit per file

**Chain Reaction Prevention**: Always test after each commit, never commit multiple file groups at once.---

## Pre-Flight Checklist

### Before Starting Any Phase

```bash
# 1. Ensure clean working directory
git status  # Should be clean

# 2. Create feature branch
git checkout -b feat/boundary-compliance-phase-2a

# 3. Baseline tests (must pass)
npm test  # Should show 88 passing

# 4. Baseline lint (must be clean)
npm run lint  # Should show 0 errors

# 5. Baseline dev server (must work)
npm run dev  # Should start without errors

# 6. Check circular deps (should be 0)
npx madge --circular --extensions js,jsx src/
```



### After Each File Change

```bash
# 1. Run tests immediately
npm test

# 2. If tests pass, run lint
npm run lint

# 3. If lint passes, test dev server
npm run dev
# → Visual check: switch modes, test features

# 4. If all pass, commit atomically
git add <files>
git commit -m "refactor(scope): description"
```



### Boundary Rules Enforcement

ESLint rules sudah active (lihat [`.eslintrc.cjs`](.eslintrc.cjs)), jadi:

```bash
# Check specific folder
npx eslint src/components/ --no-cache

# Check specific file
npx eslint src/app/index.js --no-cache
```

---

## Stop Points

### 🛑 Stop & Confirm If:

1. **Phase 2A**: Registration removal breaks ANY test

- Reason: Might indicate hidden consumer
- Action: Investigate before proceeding

2. **Phase 2B**: `BannerHeader` needs >2 new props

- Reason: Might indicate need for bigger refactor
- Action: Discuss alternatives (context? compound component?)

3. **Phase 2C**: Import errors di >3 files after barrel split

- Reason: Path issues or missing exports
- Action: Review barrel structure before continuing

4. **Phase 2C**: Any file imports dari >5 different sources

- Reason: File might be doing too much
- Action: Consider extract/split file first

5. **Phase 2D**: Tests reveal >5 bugs dalam config modules

- Reason: Modules might need refactor, not just tests
- Action: Document bugs, discuss fix strategy

6. **Any Phase**: HMR jadi lebih lambat after changes

- Reason: Import structure might be worse, not better
- Action: Profile with Vite plugin, investigate

7. **Any Phase**: Tests drop below 88 passing

- Reason: Breaking change detected
- Action: Fix immediately or rollback

### ✋ Pause & Review Points

- After completing Phase 2A → Review with team (5 min)
- After completing Phase 2C → Review import structure (10 min)
- Before creating PR → Self-review all diffs (15 min)

---

## Success Metrics

| Metric | Before | After | How to Measure ||--------|--------|-------|----------------|| Boundary compliance | 60% (3/5) | 100% (5/5) | Manual check vs rules || app/index exports | 28 | ~10 | Count exports in file || Component violations | 4 files | 0 files | `grep AppEnvironment components/` || Dead code | 7 calls | 0 calls | `grep register src/` || Test coverage (config) | 0% | >80% | Coverage report || Tests passing | 88 | 88+ | `npm test` || ESLint errors | 0 | 0 | `npm run lint` |---

## Rollback Plan

Setiap phase adalah atomic:

```bash
# If Phase 2A breaks something
git revert <commit-hash-2a>

# If Phase 2C import errors unfixable
git revert <commit-hash-2c>..HEAD
# Then retry with different approach

# Nuclear option (reset to audit completion)
git reset --hard <commit-before-phase-2>
```

**Important**: Commit granularly (per file/phase) untuk easy rollback.---

## Time Estimates

| Phase | Estimated | Actual | Notes ||-------|-----------|--------|-------|| 2A | 30 min | ___ | Zero risk, straightforward || 2B | 2 hours | ___ | Includes visual testing || 2C | 3 hours | ___ | Most complex, test each file || 2D | 4 hours | ___ | Can be done separately || **Total** | **9.5 hours** | ___ | Can spread over 2-3 days |**Recommended Schedule**:

- Day 1: Phase 2A + 2B (2.5 hours)
- Day 2: Phase 2C (3 hours)
- Day 3: Phase 2D (4 hours) - optional, can defer

---

## Quick Reference

**Audit docs**: [`docs/AUDIT-INDEX.md`](docs/AUDIT-INDEX.md)**Implementation guide**: [`docs/BOUNDARY-ENFORCEMENT.md`](docs/BOUNDARY-ENFORCEMENT.md)**Violations**: [`docs/ARCHITECTURE-VIOLATIONS.md`](docs/ARCHITECTURE-VIOLATIONS.md)