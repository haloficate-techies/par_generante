import JSZip from "jszip";

const defaultTimestamp = () =>
  new Date().toISOString().slice(0, 16).replace(/[:T]/g, "");

const createDownloadLink = (href, filename) => {
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  link.click();
};

export const exportPng = async ({ renderBanner, canvasRef, filenamePrefix = "football-banner" }) => {
  const renderedCanvas = await renderBanner();
  const canvas = renderedCanvas || canvasRef.current;
  if (!canvas) return;
  const timestamp = defaultTimestamp();
  createDownloadLink(canvas.toDataURL("image/png"), `${filenamePrefix}-${timestamp}.png`);
};

export const exportZip = async ({
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
  yieldToFrame = async () => {},
  onProgress = () => {},
}) => {
  if (!Array.isArray(brandOptions) || !brandOptions.length) {
    return;
  }
  const timestampBase = defaultTimestamp();
  const modeDefaultBackground = modeBackgroundDefaults[activeMode] || footballDefaultBackground;
  const togelBulkBackground =
    isTogelMode && togelPool
      ? togelBackgroundSrc || modeBackgroundDefaults.togel
      : isTogelMode
      ? togelBackgroundSrc || modeBackgroundDefaults.togel
      : null;

  const zip = new JSZip();
  const totalBrands = brandOptions.length;
  const prefetchedInBulk = new Set();
  const BATCH_SIZE = 3;

  for (let index = 0; index < brandOptions.length; index += 1) {
    const option = brandOptions[index];
    if (!option || !option.value) continue;

    const brandSlugUpper = createBrandSlug(option.brand, { uppercase: true });
    const footerForBrand = resolveFooterSrcForBrand(option.brand, option.value, activeMode);
    let backgroundForBrand;
    if (activeMode === "football") {
      backgroundForBrand =
        option.backgroundValue ||
        (option.brand ? backgroundLookup[option.brand] : null) ||
        footballDefaultBackground;
    } else if (isTogelMode) {
      backgroundForBrand = togelBulkBackground || modeBackgroundDefaults.togel;
    } else {
      const modeSpecificBackground =
        option.backgroundByMode && option.backgroundByMode[activeMode];
      backgroundForBrand = modeSpecificBackground || modeDefaultBackground || footballDefaultBackground;
    }

    const maybePrefetch = [
      option.value,
      footerForBrand,
      backgroundForBrand,
      includeMiniBanner ? defaultEsportMiniBanner : null,
    ].filter(Boolean);
    const freshSources = maybePrefetch.filter((src) => !prefetchedInBulk.has(src));
    if (freshSources.length) {
      freshSources.forEach((src) => prefetchedInBulk.add(src));
      await prefetchImages(freshSources);
    }

    const renderedCanvas = await renderBanner({
      brandLogoSrc: option.value,
      footerSrc: footerForBrand,
      footerLink: brandSlugUpper ? `INDO.SKIN/${brandSlugUpper}` : footerLink,
      backgroundSrc: backgroundForBrand,
      skipTimestamp: true,
    });

    const canvas = renderedCanvas || canvasRef.current;
    if (!canvas) break;

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) continue;

    const brandSlugLower =
      createBrandSlug(option.brand) ||
      createBrandSlug(option.label) ||
      `brand-${String(index + 1).padStart(2, "0")}`;

    const arrayBuffer = await blob.arrayBuffer();
    zip.file(`football-banner-${brandSlugLower}-${timestampBase}.png`, arrayBuffer);

    const nextProgress = (index + 1) / totalBrands;
    onProgress(nextProgress);
    if ((index + 1) % BATCH_SIZE === 0) {
      await yieldToFrame();
    }
  }

  const zipBlob = await zip.generateAsync({ type: "blob" });
  const zipUrl = URL.createObjectURL(zipBlob);
  createDownloadLink(zipUrl, `football-banner-${timestampBase}.zip`);
  URL.revokeObjectURL(zipUrl);
};
