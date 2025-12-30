import { INDONESIAN_DAY_NAMES } from "./constants/day-names";
import {
  DYNAMIC_SINGAPORE_FLAG,
  TOGEL_DRAW_TIME_LOOKUP,
} from "./constants/draw-times";
import { TOGEL_POOL_OPTIONS } from "./constants/pool-options";
import resolveTogelDrawTimeConfig from "./resolvers/draw-time-resolver";
import resolveTotoSingaporeDrawTimeConfig from "./resolvers/singapore-resolver";

export * from "./constants/day-names";
export * from "./constants/draw-times";
export * from "./constants/pool-options";
export * from "./resolvers/draw-time-resolver";
export * from "./resolvers/singapore-resolver";

const togelData = {
  INDONESIAN_DAY_NAMES,
  TOGEL_DRAW_TIME_LOOKUP,
  TOGEL_POOL_OPTIONS,
  resolveTogelDrawTimeConfig,
  resolveTotoSingaporeDrawTimeConfig,
  flags: {
    DYNAMIC_SINGAPORE_FLAG,
  },
};

export default togelData;
