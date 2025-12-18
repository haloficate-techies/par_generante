import { useCallback, useState } from "react";
import { exportPng, exportZip } from "../../services/banner-exporter";

const useBannerExportActions = ({
  renderBanner,
  canvasRef,
  brandOptions,
  createBrandSlug,
  resolveFooterSrcForBrand,
  backgroundLookup,
  modeBackgroundDefaults,
  footballDefaultBackground,
  togelBackgroundSrc,
  togelPool,
  includeMiniBanner,
  defaultEsportMiniBanner,
  prefetchImages,
  activeMode,
  isTogelMode,
  footerLink,
  openPreviewModal,
  isRenderingRef,
}) => {
  const [isBulkDownloading, setIsBulkDownloading] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(0);

  const yieldToFrame = useCallback(
    () =>
      new Promise((resolve) => {
        window.setTimeout(resolve, 0);
      }),
    []
  );

  const handlePreviewClick = useCallback(async () => {
    if (isRenderingRef.current) return;
    const renderedCanvas = await renderBanner();
    const canvas = renderedCanvas || canvasRef.current;
    openPreviewModal(canvas);
  }, [canvasRef, isRenderingRef, openPreviewModal, renderBanner]);

  const downloadBanner = useCallback(async () => {
    if (isRenderingRef.current) return;
    await exportPng({ renderBanner, canvasRef });
  }, [canvasRef, isRenderingRef, renderBanner]);

  const downloadAllBanners = useCallback(async () => {
    if (isRenderingRef.current || isBulkDownloading || !brandOptions.length) {
      return;
    }

    setIsBulkDownloading(true);
    setBulkProgress(0);

    try {
      await exportZip({
        renderBanner,
        canvasRef,
        brandOptions,
        createBrandSlug,
        resolveFooterSrcForBrand,
        backgroundLookup,
        modeBackgroundDefaults,
        footballDefaultBackground,
        togelBackgroundSrc,
        togelPool,
        includeMiniBanner,
        defaultEsportMiniBanner,
        prefetchImages,
        activeMode,
        isTogelMode,
        footerLink,
        yieldToFrame,
        onProgress: setBulkProgress,
      });
    } catch (error) {
      console.error("Gagal membuat ZIP banner:", error);
      window.alert("Terjadi kesalahan saat membuat ZIP banner. Coba lagi sebentar lagi.");
    } finally {
      await renderBanner();
      setIsBulkDownloading(false);
      setBulkProgress(0);
    }
  }, [
    activeMode,
    backgroundLookup,
    brandOptions,
    canvasRef,
    createBrandSlug,
    defaultEsportMiniBanner,
    footerLink,
    footballDefaultBackground,
    includeMiniBanner,
    isBulkDownloading,
    isRenderingRef,
    isTogelMode,
    modeBackgroundDefaults,
    prefetchImages,
    renderBanner,
    resolveFooterSrcForBrand,
    togelBackgroundSrc,
    togelPool,
  ]);

  return {
    handlePreviewClick,
    downloadBanner,
    downloadAllBanners,
    isBulkDownloading,
    bulkProgress,
  };
};

export default useBannerExportActions;
