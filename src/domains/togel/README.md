# Togel Domain

The togel module now separates static data from business logic to make the draw-time configuration easier to maintain.

## Structure

```
src/domains/togel/
├── index.js
├── data.js                    # Aggregator + default export
├── constants/
│   ├── day-names.js
│   ├── draw-times.js
│   └── pool-options.js
└── resolvers/
    ├── draw-time-resolver.js
    └── singapore-resolver.js
```

## Usage

```js
import { TOGEL_POOL_OPTIONS, resolveTogelDrawTimeConfig } from "../domains/togel";

const { options, helperText } = resolveTogelDrawTimeConfig("toto_macau", "4D");
```

For the dynamic Singapore schedule:

```js
import { resolveTotoSingaporeDrawTimeConfig } from "../domains/togel";

const singaporeConfig = resolveTotoSingaporeDrawTimeConfig();
```

## Adding a new pool

1. Update `constants/draw-times.js` with the new pool schedule.
2. Add metadata to `constants/pool-options.js` (label, value, supported modes).
3. If the pool has dynamic behaviour (e.g., weekend closures), create a resolver under `resolvers/` and wire it up inside `resolvers/draw-time-resolver.js`.
4. Run the test suite and manually verify the Togel UI.

