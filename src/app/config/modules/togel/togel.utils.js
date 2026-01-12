import { TOGEL_STREAMING_LINK_LOOKUP } from "./togel.streaming";
import { TOGEL_POOL_LOGO_LOOKUP } from "./togel.constants";
import { TOGEL_POOL_OPTIONS } from "../../../../domains/togel";

const AVAILABLE_TOGEL_POOL_OPTIONS = Array.isArray(TOGEL_POOL_OPTIONS) ? TOGEL_POOL_OPTIONS : [];

const normalizeStreamingDisplayUrl = (url) => {
  if (!url || typeof url !== "string") {
    return "";
  }
  return url.replace(/^https?:\/\//i, "").replace(/\/$/, "");
};

export const resolveTogelPoolLabel = (poolValue) => {
  if (!poolValue) {
    return "";
  }
  const option = AVAILABLE_TOGEL_POOL_OPTIONS.find((item) => item.value === poolValue);
  return option?.label ?? "";
};

export const resolveTogelPoolLogoSrc = (poolValue) => {
  if (!poolValue) {
    return "";
  }
  return TOGEL_POOL_LOGO_LOOKUP?.[poolValue] || "";
};

export const buildTogelTitle = (inputTitle, poolLabel, variant) => {
  const trimmedTitle = inputTitle?.trim();
  if (trimmedTitle) {
    return trimmedTitle;
  }
  if (poolLabel) {
    return poolLabel.toUpperCase();
  }
  return "TOGEL KELUARAN";
};

export const resolveTogelStreamingInfo = (pool, variant, poolLabel = "") => {
  if (!pool || !variant) {
    return null;
  }
  const entry =
    TOGEL_STREAMING_LINK_LOOKUP[pool]?.[variant] || TOGEL_STREAMING_LINK_LOOKUP[pool]?.default;
  if (!entry || !entry.url) {
    return null;
  }
  const descriptor = entry.descriptor || [poolLabel, variant].filter(Boolean).join(" ").trim();
  return {
    title: entry.title || "Live Streaming",
    descriptor,
    url: entry.url,
    displayUrl: entry.displayUrl || normalizeStreamingDisplayUrl(entry.url),
  };
};

