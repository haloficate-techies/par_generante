const DEFAULT_IMAGE_PROXY_BASE_URL = "https://proxy.superbia.app/image?url=";
const IMAGE_PROXY_BASE_URL = (
  import.meta.env.VITE_IMAGE_PROXY_BASE || DEFAULT_IMAGE_PROXY_BASE_URL
).trim();
const IMAGE_PROXY_ALLOW_HOSTS_RAW = (import.meta.env.VITE_IMAGE_PROXY_ALLOW_HOSTS || "").trim();
const IMAGE_PROXY_EXTRA_HOSTS = (
  IMAGE_PROXY_ALLOW_HOSTS_RAW
    ? IMAGE_PROXY_ALLOW_HOSTS_RAW.split(",")
    : ["*"]
)
  .map((host) => host.trim().toLowerCase())
  .filter(Boolean);
const DEFAULT_IMAGE_PROXY_HOSTS = [
  "upload.wikimedia.org",
  "flagcdn.com",
  "a.espncdn.com",
  "blogger.googleusercontent.com",
  "1000logos.net",
  "img.uefa.com",
  "static.wikia.nocookie.net",
  "liquipedia.net",
  "premierleague.com",
  "www.premierleague.com",
  "resources.premierleague.com",
  "assets.laliga.com",
  "file.ilustrepro.com",
  "img.legaseriea.it",
  "bundesliga.com",
  "statics-maker.llt-services.com",
  "ligaportugal.pt",
  "images.mlssoccer.com",
  "www.jleague.co",
  "kleague.com",
  "static-files.saudi-pro-league.pulselive.com",
  "aleagues.com.au",
  "cdn.nba.com",
];
const IMAGE_PROXY_HOST_ALLOWLIST = Array.from(
  new Set([...DEFAULT_IMAGE_PROXY_HOSTS, ...IMAGE_PROXY_EXTRA_HOSTS].filter(Boolean))
);
const PROXY_URL_PLACEHOLDER = "{url}";

/**
 * Extracts the hostname component from a URL string.
 *
 * @param {string} value - URL to inspect.
 * @returns {string} Hostname in lowercase or empty string when invalid.
 */
const getProxyHostFromUrl = (value) => {
  if (typeof value !== "string" || !value) {
    return "";
  }
  try {
    return new URL(value).hostname.toLowerCase();
  } catch (error) {
    return "";
  }
};

/**
 * Checks whether a hostname satisfies an allowlist rule.
 *
 * Supports exact matches, wildcard (*), and subdomains.
 *
 * @param {string} hostname - Hostname to test.
 * @param {string} allowedHost - Rule entry (e.g., "*", "example.com").
 * @returns {boolean} True when hostname is allowed.
 */
const matchesAllowlistedHost = (hostname, allowedHost) => {
  if (!hostname || !allowedHost) {
    return false;
  }
  if (allowedHost === "*") {
    return true;
  }
  if (hostname === allowedHost) {
    return true;
  }
  return hostname.endsWith(`.${allowedHost.replace(/^\*\./, "")}`);
};

/**
 * Determines whether a hostname should be routed through the proxy.
 *
 * @param {string} hostname - Hostname extracted from candidate URL.
 * @returns {boolean} True if host is allowed to proxy.
 */
const shouldProxyHost = (hostname) => {
  if (!hostname) {
    return false;
  }
  if (IMAGE_PROXY_HOST_ALLOWLIST.length === 0) {
    return true;
  }
  return IMAGE_PROXY_HOST_ALLOWLIST.some((allowedHost) =>
    matchesAllowlistedHost(hostname, allowedHost)
  );
};

/**
 * Builds a proxied image URL for allowlisted hosts.
 *
 * Returns null for invalid URLs, blobs, data URIs,
 * or hosts outside the allowlist.
 *
 * @param {string} src - Original image source.
 * @returns {string|null} Proxied URL or null when not applicable.
 */
const buildProxiedImageUrl = (src) => {
  if (
    !IMAGE_PROXY_BASE_URL ||
    typeof src !== "string" ||
    !/^https?:\/\//i.test(src) ||
    src.startsWith("data:") ||
    src.startsWith("blob:")
  ) {
    return null;
  }
  if (src.startsWith(IMAGE_PROXY_BASE_URL)) {
    return src;
  }
  const hostname = getProxyHostFromUrl(src);
  if (!hostname || !shouldProxyHost(hostname)) {
    return null;
  }
  const encoded = encodeURIComponent(src);
  if (IMAGE_PROXY_BASE_URL.includes(PROXY_URL_PLACEHOLDER)) {
    return IMAGE_PROXY_BASE_URL.replace(PROXY_URL_PLACEHOLDER, encoded);
  }
  return `${IMAGE_PROXY_BASE_URL}${encoded}`;
};

/**
 * Generates a list of image source candidates, preferring proxied URLs.
 *
 * @param {string} src - Provided image source (URL/data/blob).
 * @returns {Array<string>} Ordered list of image sources to try.
 */
const buildImageSourceCandidates = (src) => {
  if (typeof src !== "string") {
    return src ? [src] : [];
  }
  const trimmed = src.trim();
  if (!trimmed) {
    return [];
  }
  if (trimmed.startsWith("data:") || trimmed.startsWith("blob:")) {
    return [trimmed];
  }
  const proxied = buildProxiedImageUrl(trimmed);
  if (proxied && proxied !== trimmed) {
    return [proxied, trimmed];
  }
  return [trimmed];
};

export {
  buildImageSourceCandidates,
  buildProxiedImageUrl,
  getProxyHostFromUrl,
  matchesAllowlistedHost,
  shouldProxyHost,
};

