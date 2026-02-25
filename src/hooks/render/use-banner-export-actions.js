import { useCallback, useState } from "react";
import { exportPng, exportZip } from "../../services/banner-exporter";

const useBannerExportActions = ({
  renderBanner,
  canvasRef,
  brandOptions,
  createBrandSlug,
  resolveFooterSrcForBrand,
  backgroundLookup,
  bigMatchBackgroundLookup,
  modeBackgroundDefaults,
  footballDefaultBackground,
  footballBigMatchDefaultBackground,
  togelBackgroundSrc,
  togelPool,
  includeMiniBanner,
  defaultEsportMiniBanner,
  prefetchImages,
  activeMode,
  activeSubMenu,
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
        bigMatchBackgroundLookup,
        modeBackgroundDefaults,
        footballDefaultBackground,
        footballBigMatchDefaultBackground,
        togelBackgroundSrc,
        togelPool,
        includeMiniBanner,
        defaultEsportMiniBanner,
        prefetchImages,
        activeMode,
        activeSubMenu,
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
    activeSubMenu,
    backgroundLookup,
    bigMatchBackgroundLookup,
    brandOptions,
    canvasRef,
    createBrandSlug,
    defaultEsportMiniBanner,
    footerLink,
    footballDefaultBackground,
    footballBigMatchDefaultBackground,
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
