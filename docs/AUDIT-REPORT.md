# Audit Report: Import Boundaries & Architecture Violations
**Date**: 2026-01-02  
**Type**: Phase 2 Implementation - Import Graph Analysis

## Executive Summary

✅ **Good News**: 
- No circular dependencies detected (madge scan)
- Domain isolation maintained (no cross-domain imports in code)
- Tests passing (26 tests in 8 suites)

🚨 **Critical Findings**:
- God module pattern confirmed in `app/index.js`
- Components violating boundary by importing `AppEnvironment`
- Utils layer has dependencies on `data/` layer (Rule #4 violation)
- AppEnvironment registry pattern still in active use across all layers

---

## 1. Import Graph Analysis Results

### 1.1 Consumers of `app/index.js`

**Total consumers**: 6 files

| File | Violation? | Notes |
|------|------------|-------|
| `src/App.jsx` | ⚠️ Acceptable | Top-level orchestrator |
| `src/hooks/streaming-theme.js` | ⚠️ Acceptable | Hook imports config |
| `src/hooks/togel-controls.js` | ⚠️ Acceptable | Hook imports config |
| `src/hooks/background-manager.js` | ⚠️ Acceptable | Hook imports config |
| `src/components/match-form/env.js` | 🚨 **VIOLATION** | Component layer shouldn't import app config directly |
| `src/components/layout/BannerHeader.jsx` | 🚨 **VIOLATION** | Component importing MODE_CONFIG directly |

**Impact**: 
- `app/index.js` re-exports from 12+ files across 5 different layers
- Changes in domains/utils trigger rebuilds of app/index.js
- All consumers indirectly depend on entire dependency graph

**Recommendation**: 
- Components should receive config via props (enforce Rule #2)
- Create separate barrel exports for different concerns (config vs domains vs utils)

---

### 1.2 Deep Imports to `app/config/modules/*`

**Result**: ✅ **NO VIOLATIONS FOUND**

No files outside `app/` are importing directly from `app/config/modules/*`. The barrel export pattern is being respected.

**Status**: Rule #3 already enforced by current code structure.

---

### 1.3 Components Importing AppEnvironment

**Total violations**: 4 files

#### Components Layer:
```
src/components/MatchListForm.jsx
  - Line 3: import AppEnvironment from "../app/app-environment"
  - Line 310: AppEnvironment.registerComponent("MatchListForm", MatchListForm)

src/components/layout/BannerPreviewPanel.jsx
  - Line 2: import AppEnvironment
  - Line 75: AppEnvironment.registerComponent("BannerPreviewPanel", BannerPreviewPanel)

src/components/layout/PreviewModal.jsx
  - Line 2: import AppEnvironment
  - Line 47: AppEnvironment.registerComponent("PreviewModal", PreviewModal)

src/components/layout/BannerHeader.jsx
  - Line 2: import AppEnvironment
  - Line 79: AppEnvironment.registerComponent("BannerHeader", BannerHeader)
```

#### Modes Layer:
```
src/modes/layouts/match-mode.js
  - Line 1: import AppEnvironment
  - Line 60: AppEnvironment.getModeRegistry()

src/modes/layouts/togel-mode.js
  - Line 1: import AppEnvironment
  - Line 39: AppEnvironment.getModeRegistry()

src/modes/layouts/raffle-mode.js
  - Line 1: import AppEnvironment
  - Line 47: AppEnvironment.getModeRegistry()

src/modes/modules/match-modes.js
  - Line 1: import AppEnvironment
  - Line 4: AppEnvironment.getModeRegistry()

src/modes/modules/togel-mode.js
  - Line 1: import AppEnvironment
  - Line 4: AppEnvironment.getModeRegistry()
```

**Impact**:
- Components are not pure/testable in isolation
- Runtime dependency on singleton registry
- Breaks unidirectional data flow principle

**Recommendation**: 
- Remove `registerComponent` calls (not used anywhere in App.jsx)
- Pass MODE_CONFIG via props instead of registry lookup
- Defer modes refactor to later phase (more complex due to dynamic registration)

---

### 1.4 Utils Layer Purity Check

**Result**: 🚨 **VIOLATIONS FOUND**

Utils importing from upper layers:

```
src/utils/image-loader.js
  Line 4: from "../data/image-proxy"

src/utils/formatters/match.js
  Line 1: from "../../data/helpers/date-time-formatters"

src/utils/canvas/constants.js
  Line 1: from "../../data/constants/placeholders"
  Line 5: from "../../data/helpers/date-time-formatters"
```

**Analysis**:
- `utils/` depends on `data/` layer
- `data/` is lower-level (helpers & constants)
- This is acceptable IF we consider `data/` as a shared utility layer

**Decision Required**:
❓ Should `data/` be considered same level as `utils/`, or should we merge them?

**Options**:
1. **Accept violation**: Consider `data/` as peer to `utils/` (both are pure utilities)
2. **Merge layers**: Move `data/helpers` → `utils/helpers` and `data/constants` → `utils/constants`
3. **Reverse dependency**: Move formatters from `data/helpers` to `utils/formatters`

**Recommended**: Option 1 (accept as peer layers), update Rule #4 to allow `utils/ ↔ data/`

---

### 1.5 Cross-Domain Import Check

**Result**: ✅ **NO VIOLATIONS FOUND**

- No imports from `domains/brand` → `domains/teams` or `domains/togel`
- No imports from `domains/teams` → `domains/brand` or `domains/togel`
- No imports from `domains/togel` → `domains/brand` or `domains/teams`

**Note**: Found documentation example in `src/domains/brand/README.md` (line 25) but not in actual code.

**Status**: Rule #5 already enforced. Domains are properly isolated.

---

## 2. AppEnvironment Usage Audit

### 2.1 Registry Methods Usage

**Active Usage Patterns**:

| Method | Usage Count | Purpose |
|--------|-------------|---------|
| `getModeRegistry()` | 5 files | Mode layouts/modules registration |
| `registerModeLayout()` | 4 files | Register mode rendering functions |
| `registerComponent()` | 4 files | Register React components |
| `registerHook()` | 3 files | Register custom hooks |
| `getGlobals()` | 0 files | ✅ Not used (migration successful) |
| `getHook()` | 0 files | ✅ Not used |
| `getComponent()` | 0 files | ✅ Not used |

### 2.2 Analysis

**Positive**:
- `getGlobals()` successfully eliminated (direct imports working)
- No runtime lookups with `getHook()` or `getComponent()`

**Concerns**:
- Registration calls still pollute module scope
- `registerComponent` has no consumers (can be removed)
- Mode registry is the only legitimate use case remaining

**Recommendation**:
1. **Phase 1**: Remove `registerComponent` and `registerHook` calls (dead code)
2. **Phase 2**: Keep `getModeRegistry` for now (used by mode system)
3. **Phase 3**: Consider replacing mode registry with static imports

---

## 3. Circular Dependency Check

**Tool**: madge v8.0.0  
**Command**: `npx madge --circular --extensions js,jsx src/`  
**Result**: ✅ **NO CIRCULAR DEPENDENCIES FOUND**

**Stats**:
- Files processed: 163
- Processing time: 827ms
- Warnings: 1 (unspecified)

**Status**: Architecture is clean from circular dependency perspective.

---

## 4. Test Coverage

**Test Execution**: ✅ PASSING  
**Suites**: 8  
**Tests**: 26 total

**Coverage tool**: Not installed (`@vitest/coverage-v8` missing)

**Test files checked**:
- `src/__tests__/App.test.jsx`
- `src/__tests__/BannerHeader.test.jsx`
- `src/__tests__/canvas-utils.helpers.test.js`
- `src/data/__tests__/image-proxy.test.js`
- `src/data/helpers/__tests__/*`
- `src/hooks/__tests__/*`

**Note**: Tests for `app/config/modules/*` not found. Need to add coverage for:
- `asset.resolvers.js`
- `togel.utils.js`
- `theme.utils.js`
- `layout.utils.js`

---

## 5. Boundary Violations Summary

### Rule #1: Ban Re-export Across Layers in `app/index.js`
**Status**: 🚨 **VIOLATED**

Current violations:
```javascript
// app/index.js lines 18-23
export * from "../domains/brand";
export * from "../domains/teams";
export * from "../domains/togel";
export * from "../utils/image-loader";
export * from "../data/helpers/match-factory";
```

**Impact**: High - God module pattern confirmed

---

### Rule #2: Components Not Import AppEnvironment
**Status**: 🚨 **VIOLATED**

4 component files importing `AppEnvironment` directly.

**Impact**: High - Breaks component purity

---

### Rule #3: Ban Deep Import to `app/config/modules`
**Status**: ✅ **COMPLIANT**

No violations found.

---

### Rule #4: Utils Must Be Pure
**Status**: ⚠️ **NEEDS CLARIFICATION**

Utils import from `data/` layer. Decision needed on whether `data/` counts as "upper layer" or peer.

**Impact**: Low if `data/` treated as peer

---

### Rule #5: Domains Isolated
**Status**: ✅ **COMPLIANT**

No cross-domain imports found.

---

## 6. Prioritized Action Items

### 🔥 Critical (Do First)

1. **Remove dead code**: Delete all `registerComponent` and `registerHook` calls
   - Files: All components + 3 hooks files
   - Reason: Not used, adds coupling for no benefit
   - Effort: 1 hour
   - Impact: Reduces AppEnvironment coupling

2. **Fix Component → AppEnvironment imports**
   - Files: `BannerHeader.jsx`, `match-form/env.js`
   - Change: Import `MODE_CONFIG` and `LEAGUE_LOGO_OPTIONS` from `app/index.js` via props
   - Effort: 2 hours
   - Impact: Enforces Rule #2

3. **Split `app/index.js` barrel exports**
   - Create separate barrels:
     - `app/config.js` (app config only)
     - Keep domains/utils imports in consuming files
   - Effort: 3 hours
   - Impact: Breaks god module, enforces Rule #1

### ⚠️ Important (Do Second)

4. **Clarify `data/` vs `utils/` relationship**
   - Decision: Treat as peer layers or merge?
   - Update Rule #4 documentation accordingly
   - Effort: 1 hour (decision + doc update)

5. **Add test coverage for `app/config/modules/*`**
   - Files without tests: resolvers, utils in config modules
   - Effort: 4 hours
   - Impact: Ensures boundaries enforceable via tests

### 📋 Nice to Have (Do Later)

6. **Mode registry refactor** (Phase 3)
   - Replace dynamic registration with static imports
   - Effort: 8+ hours
   - Impact: Complete AppEnvironment removal

7. **Bundle analysis**
   - Run `vite-bundle-visualizer`
   - Check impact of god module on bundle size
   - Effort: 1 hour

---

## 7. Recommended Boundary Rules (Updated)

### Rule #1: Ban Re-export Across Layers in `app/index.js`
**Update**: Add allowed exceptions for direct child layers only.

```javascript
// ✅ Allowed
export * from "./config/modules/mode/mode.config";
export * from "./app-environment";
export * from "./mode-registry";

// 🚨 NOT Allowed
export * from "../domains/brand";  // Cross-layer
export * from "../utils/image-loader";  // Cross-layer
```

### Rule #2: Components Not Import AppEnvironment
**Keep as-is**: Enforce via eslint `no-restricted-imports`

### Rule #3: Ban Deep Import to `app/config/modules`
**Status**: Already compliant, add eslint enforcement to prevent regression

### Rule #4: Utils Must Be Pure (REVISED)
**Update**: Allow imports from peer `data/` layer

```javascript
// ✅ Allowed in utils/
from "../data/helpers/*"
from "../data/constants/*"
from "../utils/*"
from "external-library"

// 🚨 NOT Allowed in utils/
from "../app/*"
from "../domains/*"
from "../hooks/*"
from "../components/*"
from "../modes/*"
from "../services/*"
```

### Rule #5: Domains Isolated
**Keep as-is**: Already compliant

---

## 8. Next Steps

1. ✅ **Complete**: Import graph analysis
2. ✅ **Complete**: AppEnvironment usage audit
3. ✅ **Complete**: Circular dependency check
4. ⚠️ **Partial**: Test coverage audit (ran tests, but no coverage metrics)
5. ⏭️ **Skip**: Bundle analysis (optional, defer to Phase 3)

**Ready for**: Phase 2 Implementation - Apply boundary rules and refactor violations

---

## Appendix A: Commands Used

```bash
# Import analysis
grep -r "from.*app/index" src/
grep -r "app/config/modules" src/ --exclude-dir=app
grep -r "AppEnvironment" src/components/ src/modes/
grep -rE "from.*(app|domains|data|hooks|components|modes|services)" src/utils/

# Cross-domain check
grep -r "domains/brand" src/domains/teams/ src/domains/togel/
grep -r "domains/teams" src/domains/brand/ src/domains/togel/
grep -r "domains/togel" src/domains/brand/ src/domains/teams/

# AppEnvironment usage
grep -r "getGlobals|getHook|getComponent|registerHook|registerComponent" src/

# Circular dependencies
npx madge --circular --extensions js,jsx src/

# Tests
npm test
```

## Appendix B: File Statistics

- Total source files: 163
- Files importing `app/index.js`: 6
- Files importing `AppEnvironment`: 9 (4 components + 5 modes)
- Files with boundary violations: 7
- Test files: 13+
- Test suites passing: 8/8

