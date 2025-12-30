import { useCallback, useState } from "react";
import { extractRaffleSlug, mapRaffleWinners } from "../utils/formatters/raffle";

const DEFAULT_RAFFLE_ENDPOINT = "https://idnraffle.com/api/detail";

/**
 * Fetches raffle winners/info from the configured endpoint and normalizes the payload.
 *
 * @param {Object} options
 * @param {string} [options.endpoint=DEFAULT_RAFFLE_ENDPOINT]
 * @returns {Object} Raffle data hook
 * @returns {string} return.slug
 * @returns {Function} return.setSlug
 * @returns {Array} return.winners
 * @returns {Object|null} return.info
 * @returns {boolean} return.isFetching
 * @returns {string} return.error
 * @returns {Function} return.fetchData
 */
const useRaffleData = ({ endpoint = DEFAULT_RAFFLE_ENDPOINT } = {}) => {
  const [slug, setSlugState] = useState("");
  const [winners, setWinners] = useState([]);
  const [info, setInfo] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");

  const setSlug = useCallback((value) => {
    setSlugState(value);
    setError("");
    if (!value || !value.trim()) {
      setWinners([]);
      setInfo(null);
    }
  }, []);

  const fetchData = useCallback(
    async (slugInput) => {
      const normalizedSlug = extractRaffleSlug(slugInput ?? slug);
      if (!normalizedSlug) {
        setError("Masukkan slug detail raffle terlebih dahulu.");
        setWinners([]);
        setInfo(null);
        return null;
      }

      setIsFetching(true);
      setError("");

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json, text/plain, */*",
          },
          body: JSON.stringify({ slug: normalizedSlug }),
        });

        let payload;
        try {
          payload = await response.json();
        } catch (parseError) {
          throw new Error("Server raffle tidak mengembalikan JSON yang valid.");
        }

        if (!response.ok) {
          const message =
            payload?.message || payload?.error || "Gagal mengambil data pemenang dari IDN Raffle.";
          throw new Error(message);
        }

        const prizes = Array.isArray(payload?.prizes) ? payload.prizes : [];
        const normalizedWinners = mapRaffleWinners(prizes);

        setWinners(normalizedWinners);
        setInfo({
          name: payload?.name || "",
          totalPrize: payload?.total_prize || "",
          endDate: payload?.end_date || "",
          periode: payload?.periode || "",
        });
        setSlugState(normalizedSlug);

        if (!prizes.length) {
          setError("Respons berhasil tetapi tidak ada data pemenang.");
        }

        return normalizedWinners;
      } catch (err) {
        console.error("Gagal memuat data raffle:", err);
        setError(err?.message || "Gagal memuat data raffle.");
        setWinners([]);
        setInfo(null);
        throw err;
      } finally {
        setIsFetching(false);
      }
    },
    [endpoint, slug]
  );

  return {
    slug,
    setSlug,
    winners,
    info,
    isFetching,
    error,
    fetchData,
  };
};

export default useRaffleData;
