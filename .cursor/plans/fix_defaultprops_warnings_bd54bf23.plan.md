---
name: Fix defaultProps Warnings
overview: Remove deprecated defaultProps from all function components and replace with JavaScript default parameters in function signatures to eliminate React 18.3+ warnings.
todos:
  - id: update-matchlistform
    content: Move defaultProps to function parameters in MatchListForm.jsx
    status: pending
  - id: update-banner-metadata
    content: Fix defaultProps in BannerMetadataSection.jsx
    status: pending
  - id: update-matches-section
    content: Fix defaultProps in MatchesSection/index.jsx
    status: pending
  - id: update-match-fieldset
    content: Fix defaultProps in MatchFieldset.jsx
    status: pending
  - id: update-raffle-section
    content: Fix defaultProps in RaffleWinnersSection.jsx
    status: pending
  - id: update-togel-controls
    content: Fix defaultProps in TogelControlsSection.jsx
    status: pending
  - id: update-togel-digits
    content: Fix defaultProps in TogelDigitsSection.jsx
    status: pending
  - id: update-banner-bg-preview
    content: Fix defaultProps in BannerBackgroundPreview.jsx
    status: pending
  - id: update-brand-asset-selector
    content: Fix defaultProps in BrandAssetSelector.jsx
    status: pending
  - id: update-digit-stepper
    content: Fix both defaultProps in DigitStepperInput.jsx
    status: pending
  - id: update-image-upload
    content: Fix defaultProps in ImageUploadPreview.jsx
    status: pending
  - id: update-league-logo
    content: Fix defaultProps in LeagueLogoSelector.jsx
    status: pending
  - id: validate-lint
    content: Run npm run lint to verify no syntax errors
    status: pending
  - id: validate-tests
    content: Run npm run test to ensure behavior unchanged
    status: pending
  - id: validate-console
    content: Verify all defaultProps warnings eliminated
    status: pending
---

# Plan: Fix defaultProps Deprecation Warnings

## Problem Statement

React 18.3+ has deprecated `defaultProps` for function components, causing warnings in the console. We need to migrate all 13 instances of `defaultProps` to use JavaScript default parameters instead.**Warning Message:**

```javascript
Warning: MatchListForm: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.
```



## Migration Pattern

### Before (Deprecated):

```javascript
const MyComponent = ({ value, label, onChange }) => {
  // component logic
};

MyComponent.defaultProps = {
  value: "",
  label: "Default Label",
};
```



### After (Correct):

```javascript
const MyComponent = ({ 
  value = "", 
  label = "Default Label", 
  onChange 
}) => {
  // component logic
};
// Remove defaultProps completely
```



## Affected Components

13 files need to be updated:

### Main Form Component (1 file)

1. [`src/components/MatchListForm.jsx`](src/components/MatchListForm.jsx) - Main form component

### Section Components (5 files)

2. [`src/components/match-form/sections/BannerMetadataSection.jsx`](src/components/match-form/sections/BannerMetadataSection.jsx)
3. [`src/components/match-form/sections/MatchesSection/index.jsx`](src/components/match-form/sections/MatchesSection/index.jsx)
4. [`src/components/match-form/sections/MatchesSection/MatchFieldset.jsx`](src/components/match-form/sections/MatchesSection/MatchFieldset.jsx)
5. [`src/components/match-form/sections/RaffleWinnersSection.jsx`](src/components/match-form/sections/RaffleWinnersSection.jsx)
6. [`src/components/match-form/sections/TogelControlsSection.jsx`](src/components/match-form/sections/TogelControlsSection.jsx)
7. [`src/components/match-form/sections/TogelDigitsSection.jsx`](src/components/match-form/sections/TogelDigitsSection.jsx)

### UI Components (6 files)

8. [`src/components/match-form/ui/BannerBackgroundPreview.jsx`](src/components/match-form/ui/BannerBackgroundPreview.jsx)
9. [`src/components/match-form/ui/BrandAssetSelector.jsx`](src/components/match-form/ui/BrandAssetSelector.jsx)
10. [`src/components/match-form/ui/DigitStepperInput.jsx`](src/components/match-form/ui/DigitStepperInput.jsx) - Has 2 instances (ArrowIcon + main component)
11. [`src/components/match-form/ui/ImageUploadPreview.jsx`](src/components/match-form/ui/ImageUploadPreview.jsx)
12. [`src/components/match-form/ui/LeagueLogoSelector.jsx`](src/components/match-form/ui/LeagueLogoSelector.jsx)
13. Note: MatchCountAdjuster doesn't appear in grep results (likely already correct or no defaults)

---

## Implementation Steps

### Step 1: Update Main Form Component

**File:** [`src/components/MatchListForm.jsx`](src/components/MatchListForm.jsx)

- Read existing defaultProps declaration (around line 310)
- Move all default values to function parameter destructuring (line ~51-96)
- Delete defaultProps declaration
- Keep PropTypes intact

**Example changes:**

```javascript
// Before: matches, togelDigits = [], modeFeatures = {}, ...
// After: Add defaults from defaultProps to ALL optional parameters
```



### Step 2: Update BannerMetadataSection

**File:** [`src/components/match-form/sections/BannerMetadataSection.jsx`](src/components/match-form/sections/BannerMetadataSection.jsx)

- Move defaults from line ~82 to parameter list (line ~6-19)
- Delete defaultProps
- Retain PropTypes

### Step 3: Update MatchesSection

**File:** [`src/components/match-form/sections/MatchesSection/index.jsx`](src/components/match-form/sections/MatchesSection/index.jsx)

- Move defaults from line ~80 to parameter destructuring
- Delete defaultProps
- Keep PropTypes

### Step 4: Update MatchFieldset

**File:** [`src/components/match-form/sections/MatchesSection/MatchFieldset.jsx`](src/components/match-form/sections/MatchesSection/MatchFieldset.jsx)

- Move defaults from line ~369 to function parameters (line ~5-24)
- Delete defaultProps
- Keep PropTypes

### Step 5: Update RaffleWinnersSection

**File:** [`src/components/match-form/sections/RaffleWinnersSection.jsx`](src/components/match-form/sections/RaffleWinnersSection.jsx)

- Move defaults from line ~135 to parameters (line ~4-12)
- Delete defaultProps
- Retain PropTypes

### Step 6: Update TogelControlsSection

**File:** [`src/components/match-form/sections/TogelControlsSection.jsx`](src/components/match-form/sections/TogelControlsSection.jsx)

- Move defaults from line ~159 to parameter list
- Delete defaultProps
- Keep PropTypes

### Step 7: Update TogelDigitsSection

**File:** [`src/components/match-form/sections/TogelDigitsSection.jsx`](src/components/match-form/sections/TogelDigitsSection.jsx)

- Move defaults from line ~47 to parameters (line ~4-9)
- Delete defaultProps
- Retain PropTypes

### Step 8: Update BannerBackgroundPreview

**File:** [`src/components/match-form/ui/BannerBackgroundPreview.jsx`](src/components/match-form/ui/BannerBackgroundPreview.jsx)

- Move defaults from line ~34 to parameter (line ~3)
- Delete defaultProps
- Keep PropTypes

### Step 9: Update BrandAssetSelector

**File:** [`src/components/match-form/ui/BrandAssetSelector.jsx`](src/components/match-form/ui/BrandAssetSelector.jsx)

- Move defaults from line ~143 to parameters (line ~3-13)
- Delete defaultProps
- Retain PropTypes

### Step 10: Update DigitStepperInput (2 instances)

**File:** [`src/components/match-form/ui/DigitStepperInput.jsx`](src/components/match-form/ui/DigitStepperInput.jsx)**Two defaultProps to fix:**

1. `ArrowIcon.defaultProps` (line ~27) - nested component
2. `DigitStepperInput.defaultProps` (line ~114) - main component

- Move ArrowIcon defaults to its parameter (line ~44)
- Move DigitStepperInput defaults to main parameters (line ~4)
- Delete both defaultProps declarations
- Keep PropTypes

### Step 11: Update ImageUploadPreview

**File:** [`src/components/match-form/ui/ImageUploadPreview.jsx`](src/components/match-form/ui/ImageUploadPreview.jsx)

- Move defaults from line ~378 to parameters (line ~8-30)
- Delete defaultProps
- Retain PropTypes

### Step 12: Update LeagueLogoSelector

**File:** [`src/components/match-form/ui/LeagueLogoSelector.jsx`](src/components/match-form/ui/LeagueLogoSelector.jsx)

- Move defaults from line ~88 to parameters (line ~3-9)
- Delete defaultProps
- Keep PropTypes

---

## Validation Steps

### Step 13: Run Linter

Execute `npm run lint` to ensure no syntax errors introduced.

### Step 14: Run Tests

Execute `npm run test` to verify component behavior unchanged.

### Step 15: Check Console Warnings

Start dev server (`npm run dev`) and verify all defaultProps warnings eliminated.---

## Expected Outcome

### Before:

- 13 React warning messages in console
- 13 `ComponentName.defaultProps = {...}` declarations

### After:

- Zero defaultProps warnings
- All default values moved to function parameters
- PropTypes validation still active
- No behavior changes