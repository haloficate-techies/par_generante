# Boundary Enforcement Guide

This document provides practical guidance for enforcing architectural boundaries in the codebase.

## Quick Reference: 5 Boundary Rules

| Rule | Description | Status | Enforcement |
|------|-------------|--------|-------------|
| **#1** | `app/index.js` no cross-layer re-exports | 🚨 Violated | Manual + ESLint |
| **#2** | Components no AppEnvironment imports | 🚨 Violated | Manual + ESLint |
| **#3** | No deep imports to `app/config/modules/*` | ✅ Compliant | ESLint (preventive) |
| **#4** | Utils pure (allow peer `data/` imports) | ✅ Compliant | ESLint (preventive) |
| **#5** | Domains isolated (no cross-domain imports) | ✅ Compliant | ESLint (preventive) |

---

## Rule #1: Ban Cross-Layer Re-exports in `app/index.js`

### Problem
```javascript
// app/index.js - CURRENT (WRONG)
export * from "../domains/brand";      // ❌ Cross-layer
export * from "../domains/teams";      // ❌ Cross-layer
export * from "../domains/togel";      // ❌ Cross-layer
export * from "../utils/image-loader"; // ❌ Cross-layer
export * from "../data/helpers/match-factory"; // ❌ Cross-layer
```

### Solution
```javascript
// app/index.js - TARGET (CORRECT)
// Only export from app/ folder
export * from "./config/modules/assets/asset.constants";
export { resolveFooterSrcForBrand } from "./config/modules/assets/asset.resolvers";
export * from "./config/modules/match/match.constants";
export * from "./config/modules/togel/togel.utils";
export * from "./config/modules/mode/mode.config";
export * from "./app-environment";
export * from "./mode-registry";
// ✅ No cross-layer re-exports
```

### Consumer Updates Required

**Before** (consumers import everything from `app/index.js`):
```javascript
import { 
  AVAILABLE_BRAND_LOGOS,  // from domains/brand
  createInitialMatches,   // from data/helpers
  loadOptionalImage       // from utils
} from "./app/index.js";
```

**After** (consumers import from actual sources):
```javascript
import { MODE_CONFIG, resolveFooterSrcForBrand } from "./app/index.js";
import { AVAILABLE_BRAND_LOGOS } from "../domains/brand";
import { createInitialMatches } from "../data/helpers/match-factory";
import { loadOptionalImage } from "../utils/image-loader";
```

### Files to Update
1. `src/app/index.js` - Remove cross-layer re-exports
2. `src/App.jsx` - Update imports (28 → split by source)
3. `src/hooks/streaming-theme.js` - Update imports
4. `src/hooks/togel-controls.js` - Update imports
5. `src/hooks/background-manager.js` - Update imports
6. `src/components/match-form/env.js` - Update imports
7. `src/components/layout/BannerHeader.jsx` - Update imports

---

## Rule #2: Components No AppEnvironment Imports

### Problem
```javascript
// components/MatchListForm.jsx - CURRENT (WRONG)
import AppEnvironment from "../app/app-environment"; // ❌
import { LEAGUE_LOGO_OPTIONS } from "../../app/index.js";

// Later in file:
AppEnvironment.registerComponent("MatchListForm", MatchListForm); // ❌ Dead code
```

### Solution A: Remove Dead Code (registerComponent)

**All component files** should remove registration calls:

```javascript
// components/MatchListForm.jsx - TARGET
// ✅ Remove AppEnvironment import entirely
// ✅ Remove registerComponent call at bottom

// If component needs config:
import { LEAGUE_LOGO_OPTIONS } from "../../app/index.js";
// OR receive via props from parent
```

### Solution B: Props Over Imports

For `BannerHeader.jsx` which imports `MODE_CONFIG`:

**Before**:
```javascript
// BannerHeader.jsx
import AppEnvironment from "../../app/app-environment";
import { MODE_CONFIG } from "../../app/index.js";

// Uses MODE_CONFIG directly
```

**After**:
```javascript
// BannerHeader.jsx
// Receive modeConfig as prop from App.jsx
export default function BannerHeader({ modeConfig, ...otherProps }) {
  // Use modeConfig prop instead of importing
}

// App.jsx
import { MODE_CONFIG } from "./app/index.js";
<BannerHeader modeConfig={MODE_CONFIG} ... />
```

### Files to Update

#### 1. Remove Dead Code (registerComponent):
- `src/components/MatchListForm.jsx` - line 3, 310
- `src/components/layout/BannerPreviewPanel.jsx` - line 2, 75
- `src/components/layout/PreviewModal.jsx` - line 2, 47
- `src/components/layout/BannerHeader.jsx` - line 2, 79

#### 2. Remove Dead Code (registerHook):
- `src/hooks/background-manager.js` - line 114
- `src/hooks/streaming-theme.js` - line 59
- `src/hooks/togel-controls.js` - line 125

#### 3. Refactor Config Access:
- `src/components/layout/BannerHeader.jsx` - pass `MODE_CONFIG` via props
- `src/components/match-form/env.js` - already imports from `app/index.js` (OK)

---

## Rule #3: No Deep Imports to `app/config/modules/*`

### Status: ✅ Already Compliant

No violations found. All imports go through `app/index.js` barrel.

### ESLint Enforcement (Preventive)

Add to `.eslintrc.cjs`:
```javascript
rules: {
  'no-restricted-imports': ['error', {
    patterns: [{
      group: ['**/app/config/modules/**'],
      message: 'Import from app/index.js instead of deep config modules'
    }]
  }]
}
```

---

## Rule #4: Utils Pure (Revised: Allow Peer `data/` Imports)

### Status: ✅ Compliant (with clarification)

Current imports:
```javascript
// utils/image-loader.js
from "../data/image-proxy"  // ✅ Peer layer OK

// utils/formatters/match.js
from "../../data/helpers/date-time-formatters"  // ✅ Peer layer OK

// utils/canvas/constants.js
from "../../data/constants/placeholders"  // ✅ Peer layer OK
```

### Allowed Imports in `utils/`:
- ✅ `../utils/*` (sibling utils)
- ✅ `../data/*` (peer layer - both are pure utilities)
- ✅ External libraries (`react`, `lodash`, etc.)

### Forbidden Imports in `utils/`:
- ❌ `../app/*` (upper layer)
- ❌ `../domains/*` (domain layer)
- ❌ `../hooks/*` (upper layer)
- ❌ `../components/*` (upper layer)
- ❌ `../modes/*` (upper layer)
- ❌ `../services/*` (upper layer)

### ESLint Enforcement

Add to `.eslintrc.cjs`:
```javascript
overrides: [{
  files: ['src/utils/**/*.js', 'src/utils/**/*.jsx'],
  rules: {
    'no-restricted-imports': ['error', {
      patterns: [
        { group: ['**/app/**'], message: 'Utils cannot import from app layer' },
        { group: ['**/domains/**'], message: 'Utils cannot import from domains layer' },
        { group: ['**/hooks/**'], message: 'Utils cannot import from hooks layer' },
        { group: ['**/components/**'], message: 'Utils cannot import from components layer' },
        { group: ['**/modes/**'], message: 'Utils cannot import from modes layer' },
        { group: ['**/services/**'], message: 'Utils cannot import from services layer' }
      ]
    }]
  }
}]
```

---

## Rule #5: Domains Isolated

### Status: ✅ Already Compliant

No cross-domain imports found in code (only in README example).

### ESLint Enforcement (Preventive)

Add to `.eslintrc.cjs`:
```javascript
overrides: [
  {
    files: ['src/domains/brand/**'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          { group: ['**/domains/teams/**'], message: 'Brand domain cannot import from teams domain' },
          { group: ['**/domains/togel/**'], message: 'Brand domain cannot import from togel domain' }
        ]
      }]
    }
  },
  {
    files: ['src/domains/teams/**'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          { group: ['**/domains/brand/**'], message: 'Teams domain cannot import from brand domain' },
          { group: ['**/domains/togel/**'], message: 'Teams domain cannot import from togel domain' }
        ]
      }]
    }
  },
  {
    files: ['src/domains/togel/**'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          { group: ['**/domains/brand/**'], message: 'Togel domain cannot import from brand domain' },
          { group: ['**/domains/teams/**'], message: 'Togel domain cannot import from teams domain' }
        ]
      }]
    }
  }
]
```

---

## Implementation Checklist

### Phase 2A: Remove Dead Code (1 hour)

- [ ] Remove `AppEnvironment` import from `components/MatchListForm.jsx`
- [ ] Remove `registerComponent("MatchListForm")` call
- [ ] Remove `AppEnvironment` import from `components/layout/BannerPreviewPanel.jsx`
- [ ] Remove `registerComponent("BannerPreviewPanel")` call
- [ ] Remove `AppEnvironment` import from `components/layout/PreviewModal.jsx`
- [ ] Remove `registerComponent("PreviewModal")` call
- [ ] Remove `AppEnvironment` import from `components/layout/BannerHeader.jsx`
- [ ] Remove `registerComponent("BannerHeader")` call
- [ ] Remove `registerHook` call from `hooks/background-manager.js`
- [ ] Remove `registerHook` call from `hooks/streaming-theme.js`
- [ ] Remove `registerHook` call from `hooks/togel-controls.js`
- [ ] Test: Run `npm test` to verify no breakage

### Phase 2B: Fix Component Config Access (2 hours)

- [ ] Refactor `BannerHeader.jsx` to receive `modeConfig` via props
- [ ] Update `App.jsx` to pass `MODE_CONFIG` to `BannerHeader`
- [ ] Verify `match-form/env.js` imports from `app/index.js` (already correct)
- [ ] Test: Run `npm run dev` and verify BannerHeader renders correctly

### Phase 2C: Split `app/index.js` Barrel (3 hours)

- [ ] Remove cross-layer re-exports from `app/index.js`
- [ ] Update `App.jsx` imports to use direct sources
- [ ] Update `hooks/streaming-theme.js` imports
- [ ] Update `hooks/togel-controls.js` imports
- [ ] Update `hooks/background-manager.js` imports
- [ ] Update `components/match-form/env.js` imports if needed
- [ ] Test: Run `npm test` and `npm run dev` to verify all working

### Phase 2D: Add ESLint Enforcement (1 hour)

- [ ] Create/update `.eslintrc.cjs` with boundary rules
- [ ] Add Rule #1 enforcement (no cross-layer in app/)
- [ ] Add Rule #2 enforcement (components no AppEnvironment)
- [ ] Add Rule #3 enforcement (no deep config imports)
- [ ] Add Rule #4 enforcement (utils purity)
- [ ] Add Rule #5 enforcement (domain isolation)
- [ ] Run `npm run lint` to verify rules work
- [ ] Fix any violations found

### Phase 2E: Documentation Update (30 min)

- [ ] Update `docs/ARCHITECTURE.md` with boundary rules
- [ ] Add link to `BOUNDARY-ENFORCEMENT.md`
- [ ] Update `docs/system-improvement-plan.md` to mark boundaries complete
- [ ] Create Phase 3 plan for mode registry refactor

---

## Testing Strategy

### After Each Phase:

1. **Run tests**: `npm test`
2. **Run dev server**: `npm run dev`
3. **Check functionality**:
   - Switch between modes (football, basketball, esports, togel, raffle)
   - Change brand selection
   - Add/edit matches
   - Preview banner
   - Download single banner
   - Download all banners (ZIP)

### Critical User Flows:

- [ ] Football mode: 2-match grid renders correctly
- [ ] Football big match: Single match layout works
- [ ] Basketball mode: Renders with correct background
- [ ] Esports mode: Game logo selection works
- [ ] Togel mode: Digit input and pool selection works
- [ ] Raffle mode: Winner list displays correctly
- [ ] Brand switching: Updates logo, footer, background
- [ ] Export: PNG download works
- [ ] Export ZIP: Multi-brand download works

---

## Rollback Strategy

If issues arise during implementation:

1. **Git commits**: Make small, atomic commits per phase
2. **Test before commit**: Each phase must pass tests
3. **Rollback command**: `git revert <commit-hash>`

### Safe Points:

- After Phase 2A (dead code removal)
- After Phase 2B (component refactor)
- After Phase 2C (barrel split)

---

## Success Metrics

### Before Implementation:
- ❌ `app/index.js` has 12+ re-exports across 5 layers
- ❌ 7 files import `AppEnvironment` for dead code
- ❌ No eslint boundary enforcement
- ❌ God module slows HMR

### After Implementation:
- ✅ `app/index.js` only exports from `app/` folder
- ✅ 0 components import `AppEnvironment`
- ✅ ESLint enforces all 5 boundary rules
- ✅ Faster HMR (domains don't trigger app/ rebuild)
- ✅ Better test isolation (components testable without registry)
- ✅ Explicit dependency graph (all imports visible)

---

## FAQ

**Q: Why not remove AppEnvironment entirely?**  
A: Mode registry still uses it for dynamic layout registration. Phase 3 will address this.

**Q: Why allow `utils/ → data/` imports?**  
A: Both are pure utility layers with no business logic. Treating as peers is pragmatic.

**Q: What if I need to add a new mode?**  
A: Follow existing pattern in `modes/layouts/` and `modes/modules/` until Phase 3 refactor.

**Q: Can I add new config to `app/config/modules/`?**  
A: Yes, but only export it through `app/index.js`. No direct imports from consumers.

**Q: How do I know if my change violates boundaries?**  
A: After Phase 2D, ESLint will show errors. Before that, refer to this guide.

