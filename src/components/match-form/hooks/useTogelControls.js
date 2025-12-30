import { useCallback, useMemo } from "react";

const extractEventValue = (valueOrEvent) =>
  typeof valueOrEvent === "string"
    ? valueOrEvent
    : valueOrEvent?.target?.value ?? "";

export const useTogelControls = ({
  pools = [],
  selectedPool = "",
  selectedVariant = "",
  onPoolChange,
  onVariantChange,
}) => {
  const selectedPoolOption = useMemo(
    () => pools.find((option) => option.value === selectedPool) ?? null,
    [pools, selectedPool]
  );

  const poolVariants = useMemo(
    () => selectedPoolOption?.modes ?? [],
    [selectedPoolOption]
  );

  const handlePoolChange = useCallback(
    (eventOrValue) => {
      const nextPool = extractEventValue(eventOrValue);
      onPoolChange?.(nextPool);
      const option = pools.find((item) => item.value === nextPool);
      const modes = option?.modes ?? [];
      if (modes.length === 1) {
        onVariantChange?.(modes[0]);
      } else {
        onVariantChange?.("");
      }
    },
    [onPoolChange, onVariantChange, pools]
  );

  const handleVariantChange = useCallback(
    (eventOrValue) => {
      const nextVariant = extractEventValue(eventOrValue);
      onVariantChange?.(nextVariant);
    },
    [onVariantChange]
  );

  const shouldShowVariantSelector = Boolean(
    selectedPool && poolVariants.length > 1
  );

  return {
    pools,
    selectedPool,
    selectedVariant,
    selectedPoolOption,
    poolVariants,
    shouldShowVariantSelector,
    handlePoolChange,
    handleVariantChange,
  };
};

export default useTogelControls;

