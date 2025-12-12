import { useCallback, useState } from "react";

const usePreviewModal = ({ alertFn = window.alert } = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  const openWith = useCallback(
    (canvas) => {
      if (!canvas) {
        return;
      }
      try {
        const dataUrl = canvas.toDataURL("image/png");
        setImageSrc(dataUrl);
        setIsOpen(true);
      } catch (error) {
        console.error("Gagal menyiapkan gambar preview:", error);
        alertFn?.("Gagal menyiapkan gambar preview. Coba lagi.");
      }
    },
    [alertFn]
  );

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    imageSrc,
    openWith,
    close,
  };
};

export default usePreviewModal;
