# Hooks Directory

Custom React hooks powering Banner Generator’s state, domain logic, rendering, and UI helpers.

## Organization

- **State Management Hooks**
  - `useBannerState` (useReducer for matches, logos, players)
  - `useModeFeatures` (flags per mode)
  - `useModeNavigation` (submenu + background class helpers)

- **Domain Hooks**
  - `useBackgroundManager` (per-mode backgrounds)
  - `useStreamingTheme` (brand-based streaming palette)
  - `useTogelControls` (togel pool/digits/draw time)
  - `useRaffleData` (fetch raffle winners/info)

- **Feature Hooks**
  - `useBrandSelection` (footer/background coordination)
  - `useBackgroundRemoval` (integration with remove-bg API)
  - `useImageCache` (cached image loader with queue/eviction)
  - `usePreviewModal` (preview modal state)

- **Render Hooks**
  - `useBannerRenderPipeline` (canvas draw pipeline)
  - `useBannerExportActions` (PNG/ZIP exports)
  - `useRenderConfiguration` (consolidates 40+ render inputs)

- **Props Builders**
  - `useMatchListFormProps` (props for `MatchListForm`)
  - `useBannerPreviewProps` (props for preview panel)

- **Asset Hook**
  - `usePrefetchBannerAssets` (preloads commonly used assets)

## Key Patterns

- **Parameter Objects:** Many hooks accept large destructured configs. Keep the caller-side object structured so it’s easy to reason about what is passed to each hook.
- **Memoization:** Expensive derived data is memoized via `useMemo`/`useCallback` inside each hook.
- **Action Dispatchers:** State hooks expose memoized action helpers to keep consumers declarative.
- **AppEnvironment Registration:** Hooks in `AppEnvironment` (background manager, streaming theme, togel controls) register themselves for legacy consumers.

## Adding New Hooks

1. Choose the right subfolder (state/domain/render/props/assets).
2. Name the hook `useSomethingFeature.js`.
3. Export it as default and register it in `src/hooks/index.js`.
4. Add comprehensive `/** ... */` JSDoc describing parameters & returns.
5. Consider adding tests (future Phase 2).

## Testing

Dedicated hook tests live in `src/hooks/__tests__/` and rely on Vitest plus Testing Library’s hook utilities.

### Running Tests

```bash
# Run all hook tests
npm test -- src/hooks

# Focus on a single suite
npm test -- src/hooks/__tests__/use-banner-state.test.js
```

### Test Utilities

Use `src/hooks/__tests__/test-utils.js` to keep scenarios consistent:

- `createTestMatch()` / `createTestMatches()` – seed reducer state quickly.
- `createModeConfig()` – mock entries for `modeConfigList`.
- `mockAutoLogoResolver()` – deterministic auto-logo lookups.
- `mockFetch()` / `restoreFetch()` – global fetch mocking for async hooks.
- `waitForUpdate()` – short helper when `waitForNextUpdate` is needed.

### Testing Patterns

#### Pattern 1 – Hooks with State

```javascript
import { renderHook, act } from "@testing-library/react-hooks";
import useBannerState from "../use-banner-state";
import { createTestMatches } from "./test-utils";

test("updates title via actions", () => {
  const { result } = renderHook(() => useBannerState({ initialMatches: createTestMatches(2) }));

  act(() => {
    result.current.actions.setTitle("Big Match");
  });

  expect(result.current.state.title).toBe("Big Match");
});
```

#### Pattern 2 – Async Hooks

```javascript
import { renderHook, act } from "@testing-library/react-hooks";
import useRaffleData from "../use-raffle-data";
import { mockFetch, restoreFetch } from "./test-utils";

test("fetches raffle winners", async () => {
  mockFetch({ prizes: [], name: "Sample" }, { ok: true });
  const { result } = renderHook(() => useRaffleData());

  await act(async () => {
    await result.current.fetchData("slug-123");
  });

  expect(result.current.info.name).toBe("Sample");
  restoreFetch();
});
```

#### Pattern 3 – Complex Dependencies

```javascript
import { renderHook } from "@testing-library/react-hooks";
import useModeFeatures from "../use-mode-features";
import { createModeConfig } from "./test-utils";

test("respects module feature overrides", () => {
  const modeConfigList = [createModeConfig({ id: "esports" })];
  const resolveModeModule = () => ({ features: { includeMiniBanner: false } });

  const { result } = renderHook(() =>
    useModeFeatures("esports", "default", { modeConfigList, resolveModeModule })
  );

  expect(result.current.includeMiniBanner).toBe(false);
});
```

### Best Practices

1. Prefer `test-utils.js` helpers instead of hand-rolling fixtures.
2. Mock external dependencies (fetch, resolvers, timers) explicitly in each suite.
3. Focus on user-facing behavior rather than implementation details.
4. Keep assertions focused—each test should validate one concept.
5. Name tests descriptively so they double as documentation.

## Related Docs

- `docs/ARCHITECTURE.md` – System overview
- `src/utils/README.md` – Utility helpers consumed by hooks
- `src/services/README.md` – Services that consume these hooks

