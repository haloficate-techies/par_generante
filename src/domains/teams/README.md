# Teams Domain

Team auto-logo sources are organized by league-specific modules under `leagues/` to keep the dataset maintainable and easy to extend.

## Structure

```
src/domains/teams/
├── index.js
├── logo-lookup.js
├── logo-sources.js         # Aggregates all league modules for backward compatibility
└── leagues/
    ├── a-league.js
    ├── belgian-pro-league.js
    ├── brasileirao.js
    ├── bundesliga.js
    ├── championship.js
    ├── danish-superliga.js
    ├── eredivisie.js
    ├── j-league.js
    ├── k-league.js
    ├── la-liga.js
    ├── liga-1-indonesia.js
    ├── liga-argentina.js
    ├── liga-mx.js
    ├── liga-portugal.js
    ├── ligue-1.js
    ├── mls.js
    ├── national-teams.js
    ├── nba.js
    ├── premier-league.js
    ├── saudi-pro-league.js
    ├── serie-a.js
    ├── super-lig.js
    └── uefa-competitions.js
```

Each league file exports a named array (for example, `premierLeagueTeams`) and a default export with the same data. The arrays contain `{ names: string[], source: string }` entries exactly as before, but scoped to their respective competitions.

## Usage

### Import by league (recommended)

```js
import { premierLeagueTeams } from "../domains/teams/leagues/premier-league";

const arsenal = premierLeagueTeams.find((team) =>
  team.names.includes("arsenal")
);
```

### Aggregate import (backward compatible)

```js
import TEAM_AUTO_LOGO_SOURCES from "../domains/teams";

const logo = TEAM_AUTO_LOGO_SOURCES.find((entry) =>
  entry.names.includes("arsenal")
);
```

## Adding or updating teams

1. Locate the relevant league file inside `leagues/`.
2. Append or edit the `{ names, source }` entry. Include common aliases in `names`.
3. If the team belongs to a new competition, create a new league file and add it to `logo-sources.js`.
4. Run the test suite to ensure the lookup helpers still pass.

