import React from "react";
import PropTypes from "prop-types";
import { formatPrizeCurrency } from "../utils";

const RaffleWinnersSection = ({
  slugValue = "",
  onSlugChange,
  onFetch,
  isLoading = false,
  winners = [],
  fetchError = "",
  raffleInfo = null,
}) => {
  const safeWinners = Array.isArray(winners) ? winners : [];
  const handleSlugInput = (event) => {
    onSlugChange?.(event.target.value);
  };
  const handleFetchClick = () => {
    onFetch?.();
  };
  const hasWinners = safeWinners.length > 0;
  return (
    <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-100">Data Pemenang Raffle</h3>
          <p className="text-xs text-slate-400">
            Tempel slug atau URL detail IDN Raffle. Sistem akan otomatis menarik daftar pemenang.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center md:gap-3">
          <input
            type="text"
            value={slugValue}
            onChange={handleSlugInput}
            placeholder="Contoh: 29_november_2025_lottery_1756712869"
            className="w-full rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2 text-sm text-slate-100 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/30"
          />
          <button
            type="button"
            onClick={handleFetchClick}
            disabled={isLoading || !slugValue.trim()}
            className="rounded-lg bg-brand-yellow px-4 py-2 text-sm font-semibold uppercase tracking-wide text-slate-900 transition enabled:hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Mengambil..." : "Tarik data"}
          </button>
        </div>
      </div>
      {fetchError ? <p className="text-sm text-rose-300">{fetchError}</p> : null}
      {raffleInfo && (raffleInfo.name || raffleInfo.endDate || raffleInfo.totalPrize) ? (
        <div className="grid gap-3 rounded-lg border border-slate-700/80 bg-slate-900/60 p-3 text-sm text-slate-200 md:grid-cols-3">
          {raffleInfo.name ? (
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Event</p>
              <p className="font-semibold">{raffleInfo.name}</p>
            </div>
          ) : null}
          {raffleInfo.endDate ? (
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Tanggal</p>
              <p className="font-semibold">{raffleInfo.endDate}</p>
            </div>
          ) : null}
          {raffleInfo.totalPrize ? (
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Total Hadiah</p>
              <p className="font-semibold">{formatPrizeCurrency(raffleInfo.totalPrize)}</p>
            </div>
          ) : null}
        </div>
      ) : null}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-200">
          <thead className="bg-slate-900/80 text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Ticket</th>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Hadiah (x)</th>
              <th className="px-4 py-3">Nominal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {hasWinners ? (
              safeWinners.map((winner, index) => (
                <tr key={`${winner.ticket_code || index}-${winner.prize_no || index}`}>
                  <td className="px-4 py-2 font-semibold text-slate-300">{winner.prize_no ?? index + 1}</td>
                  <td className="px-4 py-2 font-mono text-slate-100">{winner.ticket_code || "-"}</td>
                  <td className="px-4 py-2">{winner.username || "-"}</td>
                  <td className="px-4 py-2">x{winner.prize || "-"}</td>
                  <td className="px-4 py-2 font-semibold text-emerald-200">
                    {winner.formattedPrizeAmount || formatPrizeCurrency(winner.prize_amount)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-4 text-center text-slate-400" colSpan={5}>
                  {isLoading ? "Sedang mengambil data pemenang..." : "Belum ada data pemenang untuk ditampilkan."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

const winnerShape = PropTypes.shape({
  ticket_code: PropTypes.string,
  username: PropTypes.string,
  prize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  prize_no: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  prize_amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  formattedPrizeAmount: PropTypes.string,
});

const raffleInfoShape = PropTypes.shape({
  name: PropTypes.string,
  endDate: PropTypes.string,
  totalPrize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
});

RaffleWinnersSection.propTypes = {
  slugValue: PropTypes.string,
  onSlugChange: PropTypes.func,
  onFetch: PropTypes.func,
  isLoading: PropTypes.bool,
  winners: PropTypes.arrayOf(winnerShape),
  fetchError: PropTypes.string,
  raffleInfo: raffleInfoShape,
};

export default RaffleWinnersSection;

