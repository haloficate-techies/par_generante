import { useEffect } from "react";

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
