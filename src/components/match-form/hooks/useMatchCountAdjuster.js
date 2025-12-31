import { useCallback, useMemo } from "react";

const FALLBACK_OPTIONS = [1, 2, 3, 4, 5];

export const useMatchCountAdjuster = ({
  matchCount,
  matchCountOptions,
  matchesLength = 0,
  onMatchCountChange,
}) => {
  const availableMatchCountOptions = useMemo(() => {
    if (Array.isArray(matchCountOptions) && matchCountOptions.length > 0) {
      return matchCountOptions;
    }
    return FALLBACK_OPTIONS;
  }, [matchCountOptions]);

  const effectiveMatchCount = useMemo(
    () => (typeof matchCount === "number" ? matchCount : matchesLength),
    [matchCount, matchesLength]
  );

  const minMatchCount = useMemo(
    () => Math.min(...availableMatchCountOptions),
    [availableMatchCountOptions]
  );
  const maxMatchCount = useMemo(
    () => Math.max(...availableMatchCountOptions),
    [availableMatchCountOptions]
  );

  const adjustMatchCount = useCallback(
    (nextCount) => {
      if (!onMatchCountChange) return;
      const normalized = Math.min(
        Math.max(nextCount, minMatchCount),
        maxMatchCount
      );
      if (normalized !== effectiveMatchCount) {
        onMatchCountChange(normalized);
      }
    },
    [effectiveMatchCount, maxMatchCount, minMatchCount, onMatchCountChange]
  );

  return {
    availableMatchCountOptions,
    effectiveMatchCount,
    minMatchCount,
    maxMatchCount,
    adjustMatchCount,
  };
};

