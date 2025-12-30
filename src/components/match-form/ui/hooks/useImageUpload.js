import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Encapsulates the upload + clipboard + manual input flow for ImageUploadPreview.
 * Returns state plus handlers so the UI shell can remain declarative.
 */
const useImageUpload = ({
  previewSrc,
  onChange,
  onAdjust,
  readFileAsDataURL,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [inputStatus, setInputStatus] = useState("");
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!previewSrc) {
      setManualInput("");
      setInputStatus("");
      return;
    }
    if (/^https?:\/\//i.test(previewSrc)) {
      setManualInput(previewSrc);
      setInputStatus("");
      return;
    }
    if (previewSrc.startsWith("data:")) {
      setManualInput("");
      setInputStatus("Gambar clipboard siap dipakai.");
      return;
    }
    setManualInput(previewSrc);
    setInputStatus("");
  }, [previewSrc]);

  const startAsyncRequest = useCallback(() => {
    requestIdRef.current += 1;
    const currentId = requestIdRef.current;
    setIsLoading(true);
    return currentId;
  }, []);

  const finishAsyncRequest = useCallback((requestId) => {
    if (requestIdRef.current === requestId) {
      setIsLoading(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    requestIdRef.current += 1;
    setIsLoading(false);
    setManualInput("");
    setInputStatus("");
    onChange(null);
    onAdjust?.({ scale: 1, offsetX: 0, offsetY: 0 });
  }, [onAdjust, onChange]);

  const handleFileSelection = useCallback(
    async (event) => {
      const file = event.target.files?.[0];
      if (!file) {
        handleReset();
        return;
      }
      if (!file.type.startsWith("image/")) {
        window.alert("Silakan upload file gambar (JPG/PNG/SVG).");
        return;
      }
      const requestId = startAsyncRequest();
      try {
        const dataUrl = await readFileAsDataURL(file);
        if (requestIdRef.current !== requestId) return;
        onChange(dataUrl);
        onAdjust?.({ scale: 1, offsetX: 0, offsetY: 0 });
        setInputStatus("Gambar upload berhasil dimuat.");
      } catch (error) {
        console.error(error);
        window.alert("Gagal membaca file gambar. Coba lagi.");
      } finally {
        finishAsyncRequest(requestId);
      }
    },
    [finishAsyncRequest, handleReset, onAdjust, onChange, readFileAsDataURL, startAsyncRequest]
  );

  const handleClipboardPaste = useCallback(
    async (event) => {
      const { clipboardData } = event;
      if (!clipboardData) return;

      const items = clipboardData.items ? Array.from(clipboardData.items) : [];
      const imageItem = items.find((item) => item.type?.startsWith("image/"));

      if (imageItem) {
        const file = imageItem.getAsFile();
        if (!file) return;
        event.preventDefault();
        const requestId = startAsyncRequest();
        try {
          const dataUrl = await readFileAsDataURL(file);
          if (requestIdRef.current !== requestId) return;
          onChange(dataUrl);
          onAdjust?.({ scale: 1, offsetX: 0, offsetY: 0 });
          setInputStatus("Gambar clipboard berhasil dimuat.");
        } catch (error) {
          console.error(error);
          window.alert("Gagal memuat gambar dari clipboard. Coba lagi.");
        } finally {
          finishAsyncRequest(requestId);
        }
        return;
      }

      const text = clipboardData.getData("text/plain");
      if (text) {
        event.preventDefault();
        const normalized = text.trim();
        onChange(normalized || null);
        onAdjust?.({ scale: 1, offsetX: 0, offsetY: 0 });
        setManualInput(normalized);
        setInputStatus("");
      }
    },
    [finishAsyncRequest, onAdjust, onChange, readFileAsDataURL, startAsyncRequest]
  );

  const handleManualInputChange = useCallback(
    (event) => {
      const value = event.target.value;
      setManualInput(value);
      const normalized = value.trim();
      onChange(normalized ? normalized : null);
      onAdjust?.({ scale: 1, offsetX: 0, offsetY: 0 });
      setInputStatus("");
    },
    [onAdjust, onChange]
  );

  return {
    isLoading,
    manualInput,
    inputStatus,
    handleFileSelection,
    handleClipboardPaste,
    handleManualInputChange,
    handleReset,
  };
};

export default useImageUpload;

