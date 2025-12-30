# Brand Domain

Brand asset metadata is now split into three areas for better maintainability:

- `constants/` – static definitions such as brand names, directory paths, and esports assets.
- `resolvers/` – helper utilities that derive background paths and assemble brand asset bundles.
- `assets.js` – aggregator that re-exports everything for backward compatibility and provides the legacy default export.

## Usage

### Importing via aggregator (current behaviour)

```js
import {
  BRAND_LOGO_OPTIONS,
  BANNER_BACKGROUND_LOOKUP,
  resolveBrandBackgroundPath,
} from "../domains/brand";
```

### Targeted imports (new, optional)

```js
import { BRAND_NAMES } from "../domains/brand/constants/brand-names";
import { premierLeagueTeams } from "../domains/teams/leagues/premier-league";
```

### Helper utilities

```js
import {
  createBrandBackgroundLookup,
  createBrandBackgroundResolver,
} from "../domains/brand/resolvers/background-resolver";

const lookup = createBrandBackgroundLookup("assets/CUSTOM/banner_background");
const resolveCustomBackground = createBrandBackgroundResolver(lookup);
```

## Adding new brands

1. Append the brand code to `constants/brand-names.js`.
2. Ensure header/footer assets exist at:
   - `assets/BRAND/${BRAND}.webp`
   - `assets/BOLA/banner_footer/${BRAND}.webp`
3. (Optional) Add background variations under the basketball/esports directories to benefit from automatic resolvers.
4. Run the test suite to confirm downstream hooks (such as `useBackgroundManager`) still work.

