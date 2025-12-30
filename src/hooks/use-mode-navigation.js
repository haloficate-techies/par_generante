import { useEffect } from "react";

/**
 * Controls submenu defaults and match count adjustments per mode.
 *
 * @param {Object} params
 * @param {Object} params.activeModeConfig
 * @param {boolean} params.isBigMatchLayout
 * @param {number} params.activeMatchCount
 * @param {Function} params.setMatchCount
 * @param {Function} params.setActiveSubMenu
 * @returns {Object} UI helpers
 * @returns {string} return.pageBackgroundClass
 */
const useModeNavigation = ({
  activeModeConfig,
  isBigMatchLayout,
  activeMatchCount,
  setMatchCount,
  setActiveSubMenu,
}) => {
  useEffect(() => {
    if (!activeModeConfig) {
      setActiveSubMenu("");
      return;
    }
    const availableSubMenus = Array.isArray(activeModeConfig.subMenus)
      ? activeModeConfig.subMenus
      : [];
    if (availableSubMenus.length === 0) {
      setActiveSubMenu("");
      return;
    }
    const defaultSubMenuId =
      activeModeConfig.defaultSubMenuId || availableSubMenus[0]?.id || "";
    setActiveSubMenu(defaultSubMenuId);
  }, [activeModeConfig, setActiveSubMenu]);

  useEffect(() => {
    if (isBigMatchLayout && activeMatchCount !== 1) {
      setMatchCount(1);
    }
  }, [isBigMatchLayout, activeMatchCount, setMatchCount]);

  const pageBackgroundClass = activeModeConfig?.pageBackgroundClass || "bg-slate-950";

  return {
    pageBackgroundClass,
  };
};

export default useModeNavigation;
