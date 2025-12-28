# Config Modules

Modular config files that were extracted from `globals.js` to keep concerns separated.

Each subdirectory contains focused exports:

- `togel/` – constants, streaming lookup, and helper utilities for togel mode.
- `match/` – match-related constants and sub-menu/league options.
- `assets/` – background defaults, footer resolvers, and image loading helpers.
- `layout/` – layout-specific helper for mini banner placement.
- `theme/` – color/token helpers for streaming theme resolution.
- `shared/` – cross-domain helper utilities shared by the bundle.
- `mode/` – `MODE_CONFIG` definition for every supported mode.

`globals.js` re-exports everything from these modules and builds `APP_GLOBALS_BUNDLE` so that `AppEnvironment` retains the same shape as before the refactor.

