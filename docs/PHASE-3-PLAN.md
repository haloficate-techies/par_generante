# Phase 3: Mode Registry Refactor Plan

## Goal
Membuat registry mode bersifat pure dengan dependency injection eksplisit melalui ModeContext.

## Why
- Meningkatkan testability dan memudahkan unit test tanpa globals.
- Menghapus implicit global state dari registry.
- Selaras dengan aturan boundary (Rule #1-#5).

## Scope
In scope:
- Refactor registry mode menjadi modul murni (tanpa import app/components).
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

## Status Board
| Phase | Status | Owner | PR ID | Done Date | pnpm verification |
| --- | --- | --- | --- | --- | --- |
| 3A Audit & Mapping | Done | me | PR-1 | 2026-01-04 | pnpm lint/test pass; pnpm dev started (manual pending) |
| 3B Extract Registry Core | Done | me | PR-2 | 2026-01-04 | pnpm lint/test pass; pnpm dev started (manual pending) |
| 3C Migrate Modes + Callers | In progress | me | PR-3/PR-4 | 2026-01-04 | pnpm lint/test pass; pnpm dev started (manual pending) |
| 3D Cleanup + Hardening | Not started | me | PR-5 | - | - |

## Current Registry Map (3A output)
- Core implementation: `src/app/mode-registry.js` uses `AppEnvironment` and `MODE_CONFIG` to validate mode IDs and expose `getModeLayoutConfig`/`getModeModule`.
- Registration side effects:
  - `src/modes/layouts/*.js` registers via `AppEnvironment.getModeRegistry().registerModeLayout`.
  - `src/modes/modules/*.js` registers via `AppEnvironment.getModeRegistry().registerModeModule`.
- Callers / consumers:
  - `src/App.jsx` imports `getModeLayoutConfig` and `getModeModule` from `src/app/index.js`.
  - `src/hooks/render/use-render-configuration.js` passes `getModeLayoutConfig` into render config.
  - `src/services/banner-renderer.js` calls `getModeLayoutConfig` to resolve layout renderer.
  - `src/hooks/use-mode-features.js` uses `resolveModeModule` injected by App.

## Design Proposal (target)
### Registry core API (pure)
- `createModeRegistry(modeContext, options)`
  - `registerModeLayout(modeId, layout)`
  - `registerModeModule(modeId, moduleConfig)`
  - `getLayout(modeId)` (or `resolveLayout`)
  - `getModule(modeId)` (or `resolveModule`)
  - `listModes()`
  - `getRegisteredModes()` (dev-only optional)

### ModeContext contract (draft)
Required:
- `modeConfig`
- `brandConfig`
- `assets`
- `featureFlags`
- `timeProvider`
Optional:
- `envDerived`
- `logger`
Defaults/validation:
- Core validates required keys in dev and emits warnings via `logger` (or `console`).

### App layer injection
- App assembles ModeContext from app config modules + domains + helpers.
- `createModeRegistry(modeContext)` called in app entrypoint and passed into hooks/services.
- Compatibility/adapter layer is allowed during migration only.

## 3A. Audit & Mapping
Deliverables:
- Dependency map & list of callers (see "Current Registry Map").
- Draft ModeContext fields and validation rules.
- Migration strategy skeleton + risk register.
Files likely touched:
- `src/app/mode-registry.js`
- `src/app/app-environment.js`
- `src/App.jsx`
- `src/services/banner-renderer.js`
- `src/hooks/use-mode-features.js`
- `src/hooks/render/use-render-configuration.js`
- `src/modes/layouts/*.js`
- `src/modes/modules/*.js`
- `docs/ARCHITECTURE.md`
- `docs/PHASE-3-PLAN.md`
- `docs/PROGRESS.md`
Steps:
1) Enumerate registry call sites and side-effect registrations.
2) Identify config/data dependencies mapped into ModeContext.
3) Draft target API for registry core + adapter boundaries.
4) Document guardrails + rollback steps.
Invariants/guardrails:
- No runtime behavior change in this phase.
- No new cross-layer imports.
Test plan:
- No code changes; record baseline commands for later phases.
Migration strategy:
- Establish adapter approach (AppEnvironment -> ModeContext) for stepwise migration.
Risks/mitigation/rollback:
- Risk: incomplete caller list. Mitigation: rg audit + verify imports. Rollback: n/a.

## 3B. Extract Registry Core (pure)
Deliverables:
- Pure registry core module with explicit ModeContext input.
- Compatibility adapter in app layer (temporary).
Files likely touched:
- `src/modes/registry/create-mode-registry.js` (new)
- `src/app/mode-registry.js`
- `src/app/app-environment.js`
- `src/app/index.js`
Steps:
1) Move core registry state + logic into `create-mode-registry`.
2) Replace AppEnvironment references with ModeContext dependency.
3) Add adapter that builds ModeContext and exposes legacy API shape.
4) Preserve dev logging parity (warns/errors).
Invariants/guardrails:
- Registry API parity with existing usage (register, resolve).
- No import from `app/` inside core.
Test plan:
- Unit tests for register/resolve in core.
- Smoke `pnpm dev` with legacy adapter.
Migration strategy:
- Keep AppEnvironment adapter until all callers migrate.
Risks/mitigation/rollback:
- Risk: adapter diverges from core. Mitigation: keep adapter minimal + tests.
- Rollback: rewire App to legacy registry.

## 3C. Migrate Modes + Callers
Deliverables:
- Mode callers receive ModeContext or registry instance explicitly.
- Layouts/modules register through injected registry, not AppEnvironment.
Files likely touched:
- `src/App.jsx`
- `src/hooks/use-mode-features.js`
- `src/hooks/render/use-render-configuration.js`
- `src/services/banner-renderer.js`
- `src/modes/layouts/*.js`
- `src/modes/modules/*.js`
Steps:
1) Create ModeContext factory in App layer.
2) Inject registry into hooks/services where used.
3) Update layout/module registration to accept registry instance (export function/init).
4) Remove side-effect registration where safe.
Invariants/guardrails:
- Mode behavior parity (match/togel/raffle/esports).
- Default layout/module fallback unchanged.
Test plan:
- Unit tests for useModeFeatures + registry resolve.
- Manual mode switch in dev for all modes.
Migration strategy:
- Convert one mode at a time; keep adapter for remaining modes.
Risks/mitigation/rollback:
- Risk: partially migrated registry. Mitigation: phased toggles + adapter.
- Rollback: revert a single mode module to legacy adapter.

## 3D. Cleanup + Hardening
Deliverables:
- Remove legacy AppEnvironment registry plumbing.
- Finalize docs and contract validation.
- Optional lint/guards for forbidden imports.
Files likely touched:
- `src/app/app-environment.js`
- `src/app/mode-registry.js`
- `docs/ARCHITECTURE.md`
- `docs/PHASE-3-PLAN.md`
- `docs/PROGRESS.md`
- `docs/CHANGELOG.md` (optional)
Steps:
1) Delete legacy registry hooks in AppEnvironment.
2) Remove compatibility adapter.
3) Harden ModeContext validation and dev warnings.
4) Update documentation and usage guides.
Invariants/guardrails:
- No UI changes; rendering parity verified.
Test plan:
- `pnpm lint`, `pnpm test`, `pnpm dev` (manual mode switch).
Migration strategy:
- Only after 3C fully complete.
Risks/mitigation/rollback:
- Risk: hidden legacy consumer. Mitigation: rg audit before removal.
- Rollback: restore adapter from prior PR.

## WBS per PR
PR-1: Audit & Mapping + plan hardening (4-6h)
- Deliverables: registry map, ModeContext draft, detailed plan, status board.
- Docs update checklist: `docs/ARCHITECTURE.md`, `docs/PHASE-3-PLAN.md`, `docs/PROGRESS.md`, `docs/CHANGELOG.md` (optional).
- pnpm verification checklist: `pnpm lint`, `pnpm test`, `pnpm dev`.
- Stop condition: requires non-pnpm tool or missing pnpm scripts.

PR-2: Extract registry core + adapter (6-8h)
- Deliverables: `createModeRegistry` core module, App adapter for legacy API, core unit tests.
- Docs update checklist: `docs/ARCHITECTURE.md`, `docs/PHASE-3-PLAN.md`, `docs/PROGRESS.md`, `docs/CHANGELOG.md` (optional).
- pnpm verification checklist: `pnpm lint`, `pnpm test`, `pnpm dev`.
- Stop condition: requires non-pnpm tool or missing pnpm scripts.

PR-3: Migrate callers (hooks/services) to registry injection (6-10h)
- Deliverables: hooks/services updated to accept ModeContext or registry instance.
- Docs update checklist: `docs/ARCHITECTURE.md`, `docs/PHASE-3-PLAN.md`, `docs/PROGRESS.md`, `docs/CHANGELOG.md` (optional).
- pnpm verification checklist: `pnpm lint`, `pnpm test`, `pnpm dev`.
- Stop condition: requires non-pnpm tool or missing pnpm scripts.

PR-4: Migrate layouts/modules (8-12h)
- Deliverables: layouts/modules registered via injected registry, no AppEnvironment usage.
- Docs update checklist: `docs/ARCHITECTURE.md`, `docs/PHASE-3-PLAN.md`, `docs/PROGRESS.md`, `docs/CHANGELOG.md` (optional).
- pnpm verification checklist: `pnpm lint`, `pnpm test`, `pnpm dev`.
- Stop condition: requires non-pnpm tool or missing pnpm scripts.

PR-5: Cleanup + hardening (4-6h)
- Deliverables: remove adapter + legacy registry wiring, finalize docs, add contract validations.
- Docs update checklist: `docs/ARCHITECTURE.md`, `docs/PHASE-3-PLAN.md`, `docs/PROGRESS.md`, `docs/CHANGELOG.md` (optional).
- pnpm verification checklist: `pnpm lint`, `pnpm test`, `pnpm dev`.
- Stop condition: requires non-pnpm tool or missing pnpm scripts.
