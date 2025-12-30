# Hooks Testing Infrastructure (Option B)

## Overview

Add testing infrastructure and test coverage for critical hooks in Banner Generator. Focus on hooks with complex logic that need safety nets for future refactoring.**Status:** Phase 2 - To be executed after Phase 1 (Documentation) is complete**Estimated Time:** 4-5 hours**Risk Level:** Low (only new test files, no existing code changes)---

## Prerequisites

- [x] Phase 1 (Documentation) completed
- [x] JSDoc added to all hooks
- [ ] Dedicated time for testing (4-5 hours)
- [ ] Team agreement on testing strategy

---

## Affected Files

### New Files to Create

````javascript
src/hooks/__tests__/
├── test-utils.js                    - Test helper functions
├── use-banner-state.test.js         - Core state reducer tests
├── use-mode-features.test.js        - Feature flag calculation tests
├── use-render-scheduler.test.js     - Debouncing/timing tests
└── use-raffle-data.test.js          - Async data fetching tests
```

### Files to Update

```
src/hooks/README.md                  - Add testing section
package.json                         - Verify dependencies (if needed)
```

---

## Implementation Plan

### Step 1: Setup Test Infrastructure (2 hours)

#### 1.1 Verify Dependencies (15 min)

**Check `package.json` for required testing libraries:**

```json
{
  "devDependencies": {
    "@testing-library/react": "^14.x",
    "@testing-library/react-hooks": "^8.x",
    "@testing-library/jest-dom": "^6.x",
    "vitest": "^1.x"
  }
}
```

**Action:** If `@testing-library/react-hooks` is missing:
```bash
npm install --save-dev @testing-library/react-hooks
```

#### 1.2 Create Test Helpers (45 min)

**File:** `src/hooks/__tests__/test-utils.js`

**Purpose:** Reusable test utilities to reduce boilerplate and ensure consistency.

**Key Functions:**
- `createTestMatch(overrides)` - Creates mock match object with defaults
- `createTestMatches(count)` - Creates array of test matches
- `mockImageLoader(returnValue)` - Mock async image loading
- `mockAutoLogoResolver(mapping)` - Mock team logo resolution
- `waitForUpdate(waitForNextUpdate, timeout)` - Async test helper
- `createModeConfig(overrides)` - Mock mode configuration
- `mockFetch(response)` - Mock global fetch for API tests
- `restoreFetch()` - Restore original fetch after tests

**Benefits:**
- Reduces test boilerplate by ~60%
- Ensures consistent test data
- Makes tests more readable
- Easy to extend for new test scenarios

#### 1.3 Configure Test Environment (30 min)

**Verify `src/setupTests.js` includes:**
```javascript
import '@testing-library/jest-dom';

// Mock timers for debounce tests
global.setTimeout = jest.fn((fn, delay) => {
  const id = Math.random();
  setTimeout(() => fn(), delay);
  return id;
});

global.clearTimeout = jest.fn();
```

**Purpose:** Ensure consistent test environment for timing-sensitive tests.

#### 1.4 Update README with Testing Section (30 min)

**Add to `src/hooks/README.md`:**

**Sections to add:**
1. **Running Tests** - Commands for running hook tests
2. **Testing Patterns** - 3 common patterns with examples:
    - Pattern 1: Testing hooks with state
    - Pattern 2: Testing async hooks
    - Pattern 3: Testing hooks with complex dependencies
3. **Best Practices** - 5 key guidelines:
    - Use test-utils.js for consistency
    - Mock external dependencies
    - Test user-facing behavior
    - One assertion per test
    - Descriptive test names

**Code examples included for each pattern.**

---

### Step 2: Test Core State Hook (1.5 hours)

**File:** `src/hooks/__tests__/use-banner-state.test.js`

**Target:** `use-banner-state.js` (345 lines, most complex hook)

**Why This Hook?**
- Most complex logic in hooks directory
- 15 different action types
- Critical to app functionality
- High risk if broken
- Complex reducer logic with nested conditions

**Test Coverage Plan:**

#### Test Suites:

1. **Initialization** (2 tests)
    - Should initialize with correct default state
    - Should respect maxMatches constraint

2. **setTitle Action** (2 tests)
    - Should update title
    - Should handle empty title

3. **setBrandLogo Action** (3 tests)
    - Should update brand logo
    - Should update footer when provided
    - Should clear footer link

4. **updateMatchField Action** (6 tests)
    - Should update basic match field
    - Should trigger auto-logo when team name changes
    - Should not override manual logo with auto-logo
    - Should reset logo adjustments when logo changes
    - Should reset player adjustments when image changes
    - Should handle invalid field names gracefully

5. **autoLogo Action** (3 tests)
    - Should apply auto-logo for home team
    - Should apply auto-logo for away team
    - Should clear logo when no auto-logo available

6. **adjustLogo Action** (4 tests)
    - Should clamp scale between 0.25 and 3
    - Should clamp offsetX between -0.75 and 0.75
    - Should clamp offsetY between -0.75 and 0.75
    - Should not modify other match indices

7. **adjustPlayer Action** (4 tests)
    - Should clamp player scale between 0.7 and 1.5
    - Should adjust offsetX correctly
    - Should adjust offsetY correctly
    - Should handle missing player image

8. **togglePlayerFlip Action** (2 tests)
    - Should toggle flip state
    - Should not toggle if no player image

9. **setMatchCount Action** (3 tests)
    - Should expand matches array when increasing
    - Should not shrink array when decreasing
    - Should respect maxMatches limit

**Total:** ~29 tests covering all critical paths

**Key Assertions:**
- State updates correctly
- Clamping logic works
- Auto-logo triggers appropriately
- Array manipulation is safe
- Side effects are contained

---

### Step 3: Test Feature Calculation Hook (30 min)

**File:** `src/hooks/__tests__/use-mode-features.test.js`

**Target:** `use-mode-features.js` (50 lines, boolean logic)

**Why This Hook?**
- Pure calculation logic
- Many derived boolean flags
- Easy to test
- High value for regression prevention

**Test Coverage Plan:**

#### Test Suites:

1. **Football Mode** (3 tests)
    - Should calculate correct features for standard football
    - Should detect big match layout
    - Should detect scores mode

2. **Togel Mode** (2 tests)
    - Should set togel-specific flags
    - Should hide matches and title

3. **Esports Mode** (2 tests)
    - Should include mini banner
    - Should skip header

4. **Raffle Mode** (2 tests)
    - Should hide matches
    - Should show title

5. **Edge Cases** (2 tests)
    - Should handle missing mode config
    - Should handle missing module

**Total:** ~11 tests

**Key Assertions:**
- Boolean flags calculated correctly
- Mode-specific features applied
- Edge cases handled gracefully

---

### Step 4: Test Timing Hook (30 min)

**File:** `src/hooks/__tests__/use-render-scheduler.test.js`

**Target:** `use-render-scheduler.js` (40 lines, debouncing)

**Why This Hook?**
- Time-sensitive logic
- Easy to break with refactoring
- Critical for performance

**Test Coverage Plan:**

#### Test Suites:

1. **Debouncing** (3 tests)
    - Should debounce multiple rapid calls
    - Should execute after delay
    - Should cancel previous timeout on new call

2. **Render Lock** (2 tests)
    - Should respect render lock
    - Should resume when lock released

3. **Cleanup** (2 tests)
    - Should cleanup timeout on unmount
    - Should not execute after unmount

**Total:** ~7 tests

**Key Techniques:**
- Use `jest.useFakeTimers()`
- Use `act()` for timing control
- Test with different delay values

**Key Assertions:**
- Debouncing works correctly
- Lock mechanism prevents execution
- No memory leaks on unmount

---

### Step 5: Test Async Hook (30 min)

**File:** `src/hooks/__tests__/use-raffle-data.test.js`

**Target:** `use-raffle-data.js` (100 lines, async fetch)

**Why This Hook?**
- Network calls (needs mocking)
- Error handling critical
- State transitions complex

**Test Coverage Plan:**

#### Test Suites:

1. **Successful Fetch** (3 tests)
    - Should fetch and parse raffle data
    - Should update loading state correctly
    - Should map winners correctly

2. **Error Handling** (4 tests)
    - Should handle network errors
    - Should handle invalid JSON
    - Should handle API error responses
    - Should set error message

3. **State Management** (3 tests)
    - Should clear data when slug empty
    - Should update slug on successful fetch
    - Should not update on failed fetch

4. **Edge Cases** (2 tests)
    - Should handle empty prizes array
    - Should extract slug from URL

**Total:** ~12 tests

**Key Techniques:**
- Mock `global.fetch`
- Use `waitFor` for async updates
- Test loading states
- Verify error messages

**Key Assertions:**
- Data fetched and parsed correctly
- Error states set appropriately
- Loading indicators work
- Cleanup happens on errors

---

## Testing Patterns & Examples

### Pattern 1: Testing Hooks with State

```javascript
import { renderHook, act } from '@testing-library/react-hooks';

test('updates state correctly', () => {
  const { result } = renderHook(() => useMyHook());
  
  act(() => {
    result.current.updateSomething('value');
  });
  
  expect(result.current.state.something).toBe('value');
});
```

### Pattern 2: Testing Async Hooks

```javascript
import { renderHook, waitFor } from '@testing-library/react-hooks';

test('fetches data', async () => {
  mockFetch({ data: 'test' });
  const { result } = renderHook(() => useDataFetcher());
  
  await act(async () => {
    await result.current.fetchData();
  });
  
  await waitFor(() => {
    expect(result.current.data).toBeDefined();
  });
});
```

### Pattern 3: Testing with Complex Dependencies

```javascript
test('integrates with dependencies', () => {
  const mockDep1 = jest.fn();
  const mockDep2 = jest.fn();
  
  const { result } = renderHook(() => useComplexHook({
    dependency1: mockDep1,
    dependency2: mockDep2,
  }));
  
  act(() => {
    result.current.doSomething();
  });
  
  expect(mockDep1).toHaveBeenCalled();
  expect(mockDep2).toHaveBeenCalledWith(expectedValue);
});
```

---

## Benefits

### Immediate Benefits:
1. **Safety Net** - Catch regressions before production
2. **Confidence** - Refactor without fear
3. **Documentation** - Tests as living examples
4. **Better Design** - Testability improves architecture

### Long-term Benefits:
1. **Faster Development** - Quick feedback loop
2. **Easier Onboarding** - New devs understand via tests
3. **Lower Maintenance** - Bugs caught early
4. **Higher Quality** - Consistent behavior verified

---

## Risk Assessment

**Low Risk:**
- ✅ Only creating new test files
- ✅ No changes to existing production code
- ✅ Can be done incrementally
- ✅ Easy to rollback if needed
- ✅ Tests don't affect runtime behavior

**Potential Issues:**
- ⚠️ Test setup time may vary based on environment
- ⚠️ Async tests can be flaky (mitigated with proper mocking)
- ⚠️ Timer tests need careful setup (mitigated with fake timers)

**Mitigation Strategies:**
- Use test-utils.js for consistency
- Proper cleanup in afterEach hooks
- Clear mocking patterns
- Comprehensive documentation

---

## Success Criteria

### Must Have:
- ✅ All 4 test files created and passing
- ✅ Test helpers (test-utils.js) comprehensive and reusable
- ✅ README updated with testing patterns
- ✅ Zero linter errors in test files

### Should Have:
- ✅ Test coverage >70% for critical hooks
- ✅ All async tests properly mocked
- ✅ Timer tests use fake timers correctly
- ✅ Tests run in <10 seconds total

### Nice to Have:
- ⭐ CI/CD integration verified
- ⭐ Coverage report generated
- ⭐ Pre-commit hook added
- ⭐ VSCode test runner configured

---

## Execution Checklist

### Pre-execution:
- [ ] Phase 1 (Documentation) fully completed
- [ ] Team aligned on testing approach
- [ ] Dedicated time block scheduled
- [ ] Development environment ready

### During execution:
- [ ] Step 1: Test infrastructure setup
- [ ] Step 2: use-banner-state tests
- [ ] Step 3: use-mode-features tests
- [ ] Step 4: use-render-scheduler tests
- [ ] Step 5: use-raffle-data tests
- [ ] All tests passing locally
- [ ] README updated with examples
- [ ] Linter checks passing

### Post-execution:
- [ ] Run full test suite: `npm test src/hooks`
- [ ] Verify CI/CD passes tests
- [ ] Code review test files
- [ ] Document any issues encountered
- [ ] Plan for additional test coverage

---

## Time Breakdown

| Task | Estimated | Priority |
|------|-----------|----------|
| Verify dependencies | 15 min | High |
| Create test-utils.js | 45 min | High |
| Configure environment | 30 min | High |
| Update README | 30 min | Medium |
| Test use-banner-state | 90 min | High |
| Test use-mode-features | 30 min | Medium |
| Test use-render-scheduler | 30 min | Medium |
| Test use-raffle-data | 30 min | High |
| **Total** | **~5 hours** | - |

---

## Future Enhancements

After Option B completion, consider:

1. **Additional Coverage** (Phase 3)
    - Test remaining 14 hooks
    - Target 80%+ overall coverage
    - Add integration tests

2. **CI/CD Integration**
    - Add GitHub Actions workflow
    - Enforce minimum coverage
    - Block PRs with failing tests

3. **Advanced Testing**
    - Snapshot testing for complex outputs
    - Performance testing for heavy hooks
    - Visual regression for canvas output

4. **Developer Tools**
    - VSCode test runner setup
    - Test file generation scripts
    - Coverage badge in README

---

## Related Documents

- Phase 1 Plan: [hooks_documentation_&_testing_a054e69f.plan.md]
- Architecture: [docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md)
- Hooks README: [src/hooks/README.md](../hooks/README.md)
- Services Tests: [src/__tests__/](../../__tests__/) (for reference)

---

## Notes

- This is Phase 2 - requires Phase 1 (Documentation) complete first
- Focus on critical hooks first, expand coverage later
- Tests should be maintainable, not just comprehensive
- Quality over quantity - better to have good tests for critical hooks
- Don't rush - take time to write clear, understandable tests

---

**Status:** Ready for execution after Phase 1 completion  
**Last Updated:** Dec 31, 2025  


````