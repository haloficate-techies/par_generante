import { useState, useEffect, useMemo } from "react";
import {
  MODE_BACKGROUND_DEFAULTS,
  TOGEL_POOL_BACKGROUND_LOOKUP,
  TOGEL_VARIANT_DIGIT_LENGTH,
  resolveTogelPoolLabel,
  resolveTogelStreamingInfo,
} from "../app/index.js";
import { resolveTogelDrawTimeConfig } from "../domains/togel";

/**
 * Manages togel-specific state: pool, digits, draw time, and streaming info.
 *
 * @param {Object} config
 * @param {boolean} config.isTogelMode
 * @param {Function} config.applyTogelBackgroundPath
 * @param {string|null} config.streamingTheme
 * @returns {Object} Togel controls
 * @returns {string} return.togelPool
 * @returns {Function} return.setTogelPool
 * @returns {string} return.togelPoolVariant
 * @returns {Function} return.setTogelPoolVariant
 * @returns {Array<string>} return.togelDigits
 * @returns {Function} return.setTogelDigits
 * @returns {string} return.togelDrawTime
 * @returns {Function} return.setTogelDrawTime
 * @returns {Object|null} return.togelStreamingInfo
 */
const useTogelControls = ({ isTogelMode, applyTogelBackgroundPath, streamingTheme }) => {
  const [togelPool, setTogelPool] = useState("");
  const [togelPoolVariant, setTogelPoolVariant] = useState("");
  const [togelDigits, setTogelDigits] = useState([]);
  const [togelDrawTime, setTogelDrawTime] = useState("");

  useEffect(() => {
    if (isTogelMode) {
      applyTogelBackgroundPath(MODE_BACKGROUND_DEFAULTS.togel);
    }
  }, [isTogelMode, applyTogelBackgroundPath]);

  useEffect(() => {
    if (!isTogelMode) {
      setTogelPool("");
      setTogelPoolVariant("");
      setTogelDigits([]);
      setTogelDrawTime("");
      applyTogelBackgroundPath(MODE_BACKGROUND_DEFAULTS.togel);
    }
  }, [isTogelMode, applyTogelBackgroundPath]);

  useEffect(() => {
    if (!togelPoolVariant) {
      setTogelDigits([]);
      return;
    }
    const requiredLength = TOGEL_VARIANT_DIGIT_LENGTH[togelPoolVariant] || 0;
    if (!requiredLength) {
      setTogelDigits([]);
      return;
    }
    setTogelDigits((prevDigits) => {
      const safeDigits = Array.isArray(prevDigits) ? prevDigits.slice(0, requiredLength) : [];
      while (safeDigits.length < requiredLength) {
        safeDigits.push("0");
      }
      return safeDigits;
    });
  }, [togelPoolVariant]);

  useEffect(() => {
    if (!isTogelMode) {
      return;
    }
    const nextBackground =
      (togelPool && TOGEL_POOL_BACKGROUND_LOOKUP[togelPool]) || MODE_BACKGROUND_DEFAULTS.togel;
    applyTogelBackgroundPath(nextBackground);
  }, [isTogelMode, togelPool, applyTogelBackgroundPath]);

  useEffect(() => {
    if (togelPool && togelPoolVariant) {
      const drawTimeConfig = resolveTogelDrawTimeConfig(togelPool, togelPoolVariant) || {};
      const timeOptions = drawTimeConfig.options ?? [];
      if (timeOptions.length > 0) {
        if (!togelDrawTime || !timeOptions.includes(togelDrawTime)) {
          setTogelDrawTime(timeOptions[0]);
        }
        return;
      }
      if (drawTimeConfig.disabledReason) {
        setTogelDrawTime("");
        return;
      }
    }
    if (togelDrawTime) {
      setTogelDrawTime("");
    }
  }, [togelPool, togelPoolVariant, togelDrawTime]);

  const togelStreamingInfo = useMemo(() => {
    if (!isTogelMode) return null;
    if (!togelPool || !togelPoolVariant) return null;
    const poolLabel = resolveTogelPoolLabel(togelPool);
    const baseInfo = resolveTogelStreamingInfo(togelPool, togelPoolVariant, poolLabel);
    if (!baseInfo) return null;
    return {
      ...baseInfo,
      theme: streamingTheme,
    };
  }, [isTogelMode, streamingTheme, togelPool, togelPoolVariant]);

  return {
    togelPool,
    setTogelPool,
    togelPoolVariant,
    setTogelPoolVariant,
    togelDigits,
    setTogelDigits,
    togelDrawTime,
    setTogelDrawTime,
    togelStreamingInfo,
  };
};

export default useTogelControls;
