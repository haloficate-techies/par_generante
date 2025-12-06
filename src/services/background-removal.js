const backgroundRemovalConfig = {
  endpoint: (import.meta.env.VITE_REMOVE_BG_ENDPOINT || "").trim(),
  apiKey: (import.meta.env.VITE_REMOVE_BG_TOKEN || "").trim(),
};

const blobToDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

export const isBackgroundRemovalConfigured = () =>
  Boolean(backgroundRemovalConfig.endpoint);

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

export const removePlayerBackground = async (imageDataUrl, { signal } = {}) => {
  if (!isBackgroundRemovalConfigured()) {
    throw new Error("Background removal endpoint belum dikonfigurasi.");
  }
  if (!imageDataUrl) {
    throw new Error("Tidak ada gambar yang bisa diproses.");
  }

  const headers = {
    "Content-Type": "application/json",
  };
  if (backgroundRemovalConfig.apiKey) {
    headers.Authorization = `Bearer ${backgroundRemovalConfig.apiKey}`;
  }

  const response = await fetch(backgroundRemovalConfig.endpoint, {
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

export const getBackgroundRemovalConfig = () => ({ ...backgroundRemovalConfig });
