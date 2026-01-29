import { useCallback, useMemo, useState } from "react";
import {
  removePlayerBackground,
  removeLogoBackground,
  isBackgroundRemovalConfigured,
} from "../services/background-removal";

const buildPlayerSlotKey = (index, side) => `${index}-${side}`;
const buildLogoSlotKey = (index, side) => `${index}-${side}-logo`;

const defaultStatus = { loading: false, error: "", removed: false };

const useBackgroundRemoval = ({ onApplyResult, alertFn = window.alert } = {}) => {
  const [playerStatus, setPlayerStatus] = useState({});
  const [logoStatus, setLogoStatus] = useState({});

  const isAvailable = useMemo(() => isBackgroundRemovalConfigured(), []);

  const updateState = (setter) => (key, updates) => {
    if (!key) return;
    setter((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] || defaultStatus),
        ...updates,
      },
    }));
  };

  const updatePlayerStatus = updateState(setPlayerStatus);
  const updateLogoStatus = updateState(setLogoStatus);

  const handlePlayerRemoval = useCallback(
    async (matchIndex, side, imageSrc) => {
      if (!isAvailable) {
        alertFn?.("Fitur hapus background belum dikonfigurasi.");
        return;
      }
      if (!imageSrc) {
        alertFn?.("Unggah gambar pemain terlebih dahulu sebelum menghapus background.");
        return;
      }
      const slotKey = buildPlayerSlotKey(matchIndex, side);
      updatePlayerStatus(slotKey, { loading: true, error: "", removed: false });
      try {
        const cleanedImage = await removePlayerBackground(imageSrc);
        if (typeof onApplyResult === "function") {
          const fieldName = side === "home" ? "teamHomePlayerImage" : "teamAwayPlayerImage";
          onApplyResult(matchIndex, fieldName, cleanedImage);
        }
        updatePlayerStatus(slotKey, { loading: false, error: "", removed: true });
      } catch (error) {
        console.error("Gagal menghapus background pemain:", error);
        const message = error?.message || "Gagal menghapus background. Coba lagi.";
        updatePlayerStatus(slotKey, { loading: false, error: message, removed: false });
        alertFn?.(message);
      }
    },
    [alertFn, isAvailable, onApplyResult, updatePlayerStatus]
  );

  const handleLogoRemoval = useCallback(
    async (matchIndex, side, imageSrc) => {
      if (!isAvailable) {
        alertFn?.("Fitur hapus background belum dikonfigurasi.");
        return;
      }
      if (!imageSrc) {
        alertFn?.("Unggah logo tim terlebih dahulu sebelum menghapus background.");
        return;
      }
      const slotKey = buildLogoSlotKey(matchIndex, side);
      updateLogoStatus(slotKey, { loading: true, error: "", removed: false });
      try {
        const cleanedImage = await removeLogoBackground(imageSrc);
        if (typeof onApplyResult === "function") {
          const fieldName = side === "home" ? "teamHomeLogo" : "teamAwayLogo";
          onApplyResult(matchIndex, fieldName, cleanedImage);
        }
        updateLogoStatus(slotKey, { loading: false, error: "", removed: true });
      } catch (error) {
        console.error("Gagal menghapus background logo:", error);
        const message = error?.message || "Gagal menghapus background logo. Coba lagi.";
        updateLogoStatus(slotKey, { loading: false, error: message, removed: false });
        alertFn?.(message);
      }
    },
    [alertFn, isAvailable, onApplyResult, updateLogoStatus]
  );

  const resetPlayerStatus = useCallback(
    (matchIndex, side) => {
      const slotKey = buildPlayerSlotKey(matchIndex, side);
      updatePlayerStatus(slotKey, { ...defaultStatus });
    },
    [updatePlayerStatus]
  );

  const resetLogoStatus = useCallback(
    (matchIndex, side) => {
      const slotKey = buildLogoSlotKey(matchIndex, side);
      updateLogoStatus(slotKey, { ...defaultStatus });
    },
    [updateLogoStatus]
  );

  return {
    isAvailable,
    playerStatus,
    logoStatus,
    handlePlayerRemoval,
    handleLogoRemoval,
    resetPlayerStatus,
    resetLogoStatus,
  };
};

export default useBackgroundRemoval;
