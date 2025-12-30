import { act, renderHook } from "@testing-library/react-hooks";
import { afterEach, describe, expect, it, vi } from "vitest";
import useRaffleData from "../use-raffle-data";
import { mockFetch, restoreFetch } from "./test-utils";

vi.mock("../../utils/formatters/raffle", () => ({
  extractRaffleSlug: vi.fn(),
  mapRaffleWinners: vi.fn(),
}));

import { extractRaffleSlug, mapRaffleWinners } from "../../utils/formatters/raffle";

const rafflePayload = {
  name: "IDN Raffle",
  total_prize: "100 Juta",
  end_date: "2024-01-01",
  periode: "Periode 3",
  prizes: [{ prize: "Hadiah" }],
};

describe("useRaffleData", () => {
  afterEach(() => {
    vi.clearAllMocks();
    restoreFetch();
  });

  const renderRaffleHook = (options) => renderHook(() => useRaffleData(options));

  it("fetches and normalizes raffle data", async () => {
    extractRaffleSlug.mockReturnValue("raffle-1");
    mapRaffleWinners.mockReturnValue([{ prize: "Hadiah" }]);
    mockFetch(rafflePayload, { ok: true });
    const { result } = renderRaffleHook();

    await act(async () => {
      await result.current.fetchData("https://idnraffle.com/detail/raffle-1");
    });

    expect(extractRaffleSlug).toHaveBeenCalledWith("https://idnraffle.com/detail/raffle-1");
    expect(mapRaffleWinners).toHaveBeenCalledWith(rafflePayload.prizes);
    expect(result.current.slug).toBe("raffle-1");
    expect(result.current.winners).toEqual([{ prize: "Hadiah" }]);
    expect(result.current.info).toEqual({
      name: "IDN Raffle",
      totalPrize: "100 Juta",
      endDate: "2024-01-01",
      periode: "Periode 3",
    });
    expect(result.current.error).toBe("");
  });

  it("updates loading state during fetch lifecycle", async () => {
    extractRaffleSlug.mockReturnValue("raffle-2");
    mapRaffleWinners.mockReturnValue([]);
    const response = {
      ok: true,
      json: vi.fn().mockResolvedValue({ ...rafflePayload, prizes: [] }),
    };
    let resolveFetch;
    globalThis.fetch = vi.fn(
      () =>
        new Promise((resolve) => {
          resolveFetch = () => resolve(response);
        })
    );
    const { result } = renderRaffleHook();

    const pendingAct = act(async () => result.current.fetchData("raffle-2"));
    expect(result.current.isFetching).toBe(true);

    resolveFetch();
    await pendingAct;

    expect(result.current.isFetching).toBe(false);
  });

  it("clears winners and info when slug emptied through setter", () => {
    const { result } = renderRaffleHook();

    act(() => {
      result.current.setSlug("raffle-3");
    });
    act(() => {
      result.current.setSlug(" ");
    });

    expect(result.current.slug).toBe(" ");
    expect(result.current.winners).toEqual([]);
    expect(result.current.info).toBeNull();
    expect(result.current.error).toBe("");
  });

  it("sets validation error when slug missing", async () => {
    extractRaffleSlug.mockReturnValue("");
    const { result } = renderRaffleHook();

    await act(async () => {
      const response = await result.current.fetchData("");
      expect(response).toBeNull();
    });

    expect(result.current.error).toMatch(/Masukkan slug/);
    expect(result.current.winners).toEqual([]);
    expect(result.current.info).toBeNull();
  });

  it("handles network errors gracefully", async () => {
    extractRaffleSlug.mockReturnValue("raffle-4");
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("Network down"));
    const { result } = renderRaffleHook();

    await act(async () => {
      await expect(result.current.fetchData("raffle-4")).rejects.toThrow("Network down");
    });

    expect(result.current.error).toBe("Network down");
    expect(result.current.winners).toEqual([]);
    expect(result.current.info).toBeNull();
  });

  it("handles API error responses with message", async () => {
    extractRaffleSlug.mockReturnValue("raffle-5");
    mockFetch({ message: "Slug tidak ditemukan" }, { ok: false, status: 404 });
    const { result } = renderRaffleHook();

    await act(async () => {
      await expect(result.current.fetchData("raffle-5")).rejects.toThrow("Slug tidak ditemukan");
    });

    expect(result.current.error).toBe("Slug tidak ditemukan");
  });

  it("handles invalid JSON responses", async () => {
    extractRaffleSlug.mockReturnValue("raffle-6");
    const response = {
      ok: true,
      json: vi.fn().mockRejectedValue(new Error("Invalid JSON")),
    };
    globalThis.fetch = vi.fn().mockResolvedValue(response);
    const { result } = renderRaffleHook();

    await act(async () => {
      await expect(result.current.fetchData("raffle-6")).rejects.toThrow(
        "Server raffle tidak mengembalikan JSON yang valid."
      );
    });

    expect(result.current.error).toBe("Server raffle tidak mengembalikan JSON yang valid.");
  });

  it("sets warning when API returns empty prizes array", async () => {
    extractRaffleSlug.mockReturnValue("raffle-7");
    mapRaffleWinners.mockReturnValue([]);
    mockFetch({ ...rafflePayload, prizes: [] }, { ok: true });
    const { result } = renderRaffleHook();

    await act(async () => {
      await result.current.fetchData("raffle-7");
    });

    expect(result.current.error).toBe("Respons berhasil tetapi tidak ada data pemenang.");
    expect(result.current.winners).toEqual([]);
  });

  it("does not update slug when fetch fails", async () => {
    extractRaffleSlug.mockReturnValue("raffle-8");
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("Timeout"));
    const { result } = renderRaffleHook();

    await expect(
      act(async () => {
        await result.current.fetchData("raffle-8");
      })
    ).rejects.toThrow("Timeout");

    expect(result.current.slug).toBe("");
  });

  it("uses provided endpoint option", async () => {
    extractRaffleSlug.mockReturnValue("raffle-9");
    mapRaffleWinners.mockReturnValue([{ prize: "Gift" }]);
    const endpoint = "https://custom/api";
    const fetchSpy = mockFetch(rafflePayload, { ok: true });
    const { result } = renderRaffleHook({ endpoint });

    await act(async () => {
      await result.current.fetchData("raffle-9");
    });

    expect(globalThis.fetch).toHaveBeenCalledWith(
      endpoint,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ slug: "raffle-9" }),
      })
    );
    expect(fetchSpy.json).toHaveBeenCalled();
  });

  it("propagates normalized slug when provided via extractor", async () => {
    extractRaffleSlug.mockReturnValue("raffle-10");
    mapRaffleWinners.mockReturnValue([{ prize: "Gift" }]);
    mockFetch(rafflePayload, { ok: true });
    const { result } = renderRaffleHook();

    await act(async () => {
      await result.current.fetchData("https://idnraffle.com/detail/raffle-10?utm=1");
    });

    expect(result.current.slug).toBe("raffle-10");
  });
});

