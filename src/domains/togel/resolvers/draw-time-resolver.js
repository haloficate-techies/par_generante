import { DYNAMIC_SINGAPORE_FLAG, TOGEL_DRAW_TIME_LOOKUP } from "../constants/draw-times";
import { resolveTotoSingaporeDrawTimeConfig } from "./singapore-resolver";

const normalizeDrawTimeResult = (result) => {
  if (Array.isArray(result)) {
    return { options: result };
  }
  if (result && typeof result === "object") {
    return {
      options: result.options ?? [],
      helperText: result.helperText ?? "",
      disabledReason: result.disabledReason ?? "",
    };
  }
  return { options: [] };
};

const resolveTogelDrawTimeConfig = (pool, variant) => {
  if (!pool || !variant) {
    return { options: [] };
  }

  const poolEntry = TOGEL_DRAW_TIME_LOOKUP[pool];
  if (!poolEntry) {
    return { options: [] };
  }

  if (poolEntry === DYNAMIC_SINGAPORE_FLAG) {
    return normalizeDrawTimeResult(resolveTotoSingaporeDrawTimeConfig());
  }

  const variantEntry = poolEntry[variant];
  if (!variantEntry) {
    return { options: [] };
  }

  if (typeof variantEntry === "function") {
    return normalizeDrawTimeResult(variantEntry());
  }

  return normalizeDrawTimeResult(variantEntry);
};

export { DYNAMIC_SINGAPORE_FLAG, resolveTogelDrawTimeConfig };

export default resolveTogelDrawTimeConfig;

