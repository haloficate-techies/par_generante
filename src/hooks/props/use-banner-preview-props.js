import { useMemo } from "react";

// Builds props for BannerPreviewPanel to keep App.jsx lean.
export const useBannerPreviewProps = ({
  canvasRef,
  isRenderingUi,
  isBulkDownloading,
  bulkProgress,
  handlePreviewClick,
  downloadBanner,
  downloadAllBanners,
}) => {
  return useMemo(
    () => ({
      canvasRef,
      isRendering: isRenderingUi,
      isBulkDownloading,
      bulkProgress,
      onPreviewClick: handlePreviewClick,
      onDownloadPng: downloadBanner,
      onDownloadZip: downloadAllBanners,
    }),
    [
      canvasRef,
      isRenderingUi,
      isBulkDownloading,
      bulkProgress,
      handlePreviewClick,
      downloadBanner,
      downloadAllBanners,
    ]
  );
};

export default useBannerPreviewProps;

