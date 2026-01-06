import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { renderBanner as renderBannerService } from "../../services/banner-renderer";
import useRenderScheduler from "../use-render-scheduler";

const BRAND_PALETTE_CACHE_LIMIT = 50;
const BASE_LAYER_CACHE_LIMIT = 12;
const HEADER_LAYER_CACHE_LIMIT = 32;

const useBannerRenderPipeline = ({
  canvasRef,
  assets,
  config,
  state,
  togelState,
  raffleState,
  helpers,
}) => {
  const isRenderingRef = useRef(false);
  const [isRenderingUi, setIsRenderingUi] = useState(false);
  const [lastRenderAt, setLastRenderAt] = useState(null);
  const baseLayerCacheRef = useRef(new Map());
  const headerLayerCacheRef = useRef(new Map());
  const brandPaletteCacheRef = useRef(new Map());

  const renderBanner = useCallback(
    async (overrides = {}) => {
      if (isRenderingRef.current) {
        return canvasRef.current;
      }
      isRenderingRef.current = true;
      setIsRenderingUi(true);
      try {
        if (typeof document !== "undefined" && document.fonts?.load) {
          await document.fonts.load('900 40px "Montserrat"');
        }
        return await renderBannerService({
          overrides,
          canvasRef,
          caches: {
            brandPaletteCacheRef,
            brandPaletteCacheLimit: BRAND_PALETTE_CACHE_LIMIT,
            baseLayerCacheRef,
            baseLayerCacheLimit: BASE_LAYER_CACHE_LIMIT,
            headerLayerCacheRef,
            headerLayerCacheLimit: HEADER_LAYER_CACHE_LIMIT,
          },
          assets,
          config,
          state,
          togel: togelState,
          raffle: raffleState,
          helpers,
          setLastRenderAt,
        });
      } catch (error) {
        console.error(error);
        window.alert("Gagal membuat preview banner. Periksa data & gambar lalu coba lagi.");
        return null;
      } finally {
        isRenderingRef.current = false;
        setIsRenderingUi(false);
      }
    },
    [assets, config, canvasRef, helpers, raffleState, state, togelState]
  );

  const scheduleRender = useRenderScheduler(renderBanner, {
    renderLockRef: isRenderingRef,
  });

  const renderDependencies = useMemo(
    () => ({
      state,
      togelState,
      raffleState,
      config,
    }),
    [state, togelState, raffleState, config]
  );

  useEffect(() => {
    if (isRenderingRef.current) return;
    scheduleRender();
  }, [scheduleRender, renderDependencies]);

  return {
    renderBanner,
    isRenderingRef,
    isRenderingUi,
    lastRenderAt,
    scheduleRender,
    setLastRenderAt,
  };
};

export default useBannerRenderPipeline;
