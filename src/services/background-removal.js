const backgroundRemovalConfig = {
  // Endpoint utama (misalnya untuk foto pemain)
  endpoint: (import.meta.env.VITE_REMOVE_BG_ENDPOINT || "").trim(),
  // Endpoint opsional khusus logo; fallback ke endpoint utama bila kosong
  logoEndpoint: (import.meta.env.VITE_REMOVE_LOGO_BG_ENDPOINT || "").trim(),
  apiKey: (import.meta.env.VITE_REMOVE_BG_TOKEN || "").trim(),
};

/**
 * Reads a Blob as a data URL.
 * @param {Blob} blob
 * @returns {Promise<string>}
 */
const blobToDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

/**
 * Indicates whether a removal endpoint is configured.
 * @returns {boolean}
 */
export const isBackgroundRemovalConfigured = () =>
  Boolean(backgroundRemovalConfig.endpoint || backgroundRemovalConfig.logoEndpoint);

/**
 * Extracts an image field from the removal service response.
 * @param {Record<string, any>} payload
 * @returns {string}
 */
const extractImageFromPayload = (payload) => {
  if (!payload || typeof payload !== "object") {
    return "";
  }
  return (
    payload.dataUrl ||
    payload.image ||
    payload.result ||
    payload.data ||
    payload.output ||
    ""
  );
};

/**
 * Calls the removal API and normalizes the response into a data URL.
 * @param {string} endpoint
 * @param {string} imageDataUrl
 * @param {{signal?: AbortSignal}} options
 * @returns {Promise<string>}
 */
const callBackgroundRemoval = async (endpoint, imageDataUrl, { signal } = {}) => {
  const headers = {
    "Content-Type": "application/json",
  };
  if (backgroundRemovalConfig.apiKey) {
    headers.Authorization = `Bearer ${backgroundRemovalConfig.apiKey}`;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({ image: imageDataUrl }),
    signal,
  });

  const contentType = response.headers.get("content-type") || "";

  if (!response.ok) {
    let message = `Gagal menghapus background (status ${response.status}).`;
    try {
      if (contentType.includes("application/json")) {
        const errorPayload = await response.json();
        message =
          errorPayload?.message ||
          errorPayload?.error ||
          errorPayload?.detail ||
          message;
      } else {
        const text = await response.text();
        if (text) {
          message = text;
        }
      }
    } catch (error) {
      // Ignore parsing errors and use default message.
    }
    throw new Error(message);
  }

  if (contentType.includes("application/json")) {
    const payload = await response.json();
    const extracted = extractImageFromPayload(payload);
    if (!extracted) {
      throw new Error("Layanan tidak mengembalikan gambar hasil.");
    }
    return extracted;
  }

  const blob = await response.blob();
  if (!blob.size) {
    throw new Error("Layanan tidak mengembalikan data gambar.");
  }
  return blobToDataUrl(blob);
};

/**
 * Removes a player's background via configured endpoint.
 * @param {string} imageDataUrl
 * @param {{signal?: AbortSignal}} options
 * @returns {Promise<string>}
 */
export const removePlayerBackground = async (imageDataUrl, { signal } = {}) => {
  const endpoint = backgroundRemovalConfig.endpoint || backgroundRemovalConfig.logoEndpoint;
  if (!endpoint) {
    throw new Error("Background removal endpoint belum dikonfigurasi.");
  }
  if (!imageDataUrl) {
    throw new Error("Tidak ada gambar yang bisa diproses.");
  }

  return callBackgroundRemoval(endpoint, imageDataUrl, { signal });
};

/**
 * Removes a logo background via configured endpoint (logo-specific config preferred).
 * @param {string} imageDataUrl
 * @param {{signal?: AbortSignal}} options
 * @returns {Promise<string>}
 */
export const removeLogoBackground = async (imageDataUrl, { signal } = {}) => {
  const endpoint = backgroundRemovalConfig.logoEndpoint || backgroundRemovalConfig.endpoint;
  if (!endpoint) {
    throw new Error("Background removal endpoint logo belum dikonfigurasi.");
  }
  if (!imageDataUrl) {
    throw new Error("Tidak ada gambar logo yang bisa diproses.");
  }

  return callBackgroundRemoval(endpoint, imageDataUrl, { signal });
};

