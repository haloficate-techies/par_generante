import JSZip from "jszip";

/**
 * Generates a compact timestamp for filenames (YYYYMMDDhhmm).
 * @returns {string}
 */
const defaultTimestamp = () =>
  new Date().toISOString().slice(0, 16).replace(/[:T]/g, "");

/**
 * Creates an invisible download link and clicks it.
 * @param {string} href
 * @param {string} filename
 */
const createDownloadLink = (href, filename) => {
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  link.click();
};

/**
 * Resolves a filename prefix based on active mode.
 * @param {string} mode
 * @returns {string}
 */
const deriveModePrefix = (mode) => (mode ? `${mode}-banner` : "banner");

/**
 * Exports the current canvas render as a PNG.
 *
 * @param {Object} params
 * @param {Function} params.renderBanner - Renderer from hooks/app
 * @param {import("react").MutableRefObject<HTMLCanvasElement>} params.canvasRef
 * @param {string} [params.filenamePrefix="football-banner"]
 * @returns {Promise<void>}
 */
export const exportPng = async ({ renderBanner, canvasRef, filenamePrefix = "football-banner" }) => {
  const renderedCanvas = await renderBanner();
  const canvas = renderedCanvas || canvasRef.current;
  if (!canvas) return;
  const timestamp = defaultTimestamp();
  createDownloadLink(canvas.toDataURL("image/png"), `${filenamePrefix}-${timestamp}.png`);
};

/**
 * Renders every brand option into a ZIP archive via JSZip.
 * Bulk export respects the provided background/footer/slug helpers.
 *
 * @param {Object} params
 * @param {Function} params.renderBanner
 * @param {import("react").MutableRefObject<HTMLCanvasElement>} params.canvasRef
 * @param {Array<{value?: string; brand?: string; label?: string; backgroundValue?: string; backgroundByMode?: Record<string,string>}>} params.brandOptions
 * @param {Function} params.createBrandSlug
 * @param {Function} params.resolveFooterSrcForBrand
 * @param {Record<string,string>} params.backgroundLookup
 * @param {Record<string,string>} params.modeBackgroundDefaults
 * @param {string} params.footballDefaultBackground
 * @param {string} params.togelBackgroundSrc
 * @param {string} params.togelPool
 * @param {boolean} params.includeMiniBanner
 * @param {string} params.defaultEsportMiniBanner
 * @param {Function} params.prefetchImages
 * @param {string} params.activeMode
 * @param {boolean} params.isTogelMode
 * @param {string} params.footerLink
 * @param {Function} [params.yieldToFrame]
 * @param {Function} [params.onProgress]
 * @returns {Promise<void>}
 */
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
  prefetchImages = async () => {},
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
  const modeFilenamePrefix = deriveModePrefix(activeMode);
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

    const brandIdentifier = option.brand || option.label || option.value || `brand-${index + 1}`;
    try {
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
      if (!canvas) {
        throw new Error("Canvas reference unavailable after rendering.");
      }

      const blob = await new Promise((resolve, reject) =>
        canvas.toBlob((result) => {
          if (result) {
            resolve(result);
          } else {
            reject(new Error("Canvas toBlob returned null."));
          }
        }, "image/png")
      );

      const brandSlugLower =
        createBrandSlug(option.brand) ||
        createBrandSlug(option.label) ||
        `brand-${String(index + 1).padStart(2, "0")}`;

      const arrayBuffer = await blob.arrayBuffer();
      zip.file(`${modeFilenamePrefix}-${brandSlugLower}-${timestampBase}.png`, arrayBuffer);

      const nextProgress = (index + 1) / totalBrands;
      onProgress(nextProgress, { brand: brandIdentifier, success: true });
    } catch (error) {
      const nextProgress = (index + 1) / totalBrands;
      console.error(`Failed to render/export brand "${brandIdentifier}":`, error);
      onProgress(nextProgress, { brand: brandIdentifier, success: false, error });
    } finally {
      if ((index + 1) % BATCH_SIZE === 0) {
        await yieldToFrame();
      }
    }
  }

  const zipBlob = await zip.generateAsync({ type: "blob" });
  const zipUrl = URL.createObjectURL(zipBlob);
  createDownloadLink(zipUrl, `${modeFilenamePrefix}-${timestampBase}.zip`);
  URL.revokeObjectURL(zipUrl);
};
