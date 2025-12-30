/**
 * Formats a Date object into YYYY-MM-DD ISO string.
 *
 * @param {Date} date - Native date instance to format.
 * @returns {string} ISO date string (YYYY-MM-DD).
 */
const formatDateISO = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Creates placeholder match entries with default values.
 * Mirrors the former `app-data` structure to maintain backwards compatibility.
 *
 * @param {number} count - Number of match objects to create.
 * @returns {Array<Object>} Array of match descriptors ready for editing.
 *
 * @example
 * const matches = createInitialMatches(3);
 * matches[0].teamHome = "Arsenal";
 * matches[0].teamAway = "Chelsea";
 */
export const createInitialMatches = (count) =>
  Array.from({ length: count }).map(() => {
    const today = new Date();
    const matchDate = new Date(today);

    return {
      teamHome: "",
      teamAway: "",
      date: formatDateISO(matchDate),
      time: "18:30",
      gameLogo: null,
      gameName: "",
      teamHomeLogo: null,
      teamHomeLogoIsAuto: false,
      teamHomeLogoScale: 1,
      teamHomeLogoOffsetX: 0,
      teamHomeLogoOffsetY: 0,
      teamAwayLogo: null,
      teamAwayLogoIsAuto: false,
      teamAwayLogoScale: 1,
      teamAwayLogoOffsetX: 0,
      teamAwayLogoOffsetY: 0,
      scoreHome: "0",
      scoreAway: "0",
      teamHomePlayerImage: null,
      teamAwayPlayerImage: null,
      teamHomePlayerScale: 1,
      teamHomePlayerOffsetX: 0,
      teamHomePlayerOffsetY: 0,
      teamAwayPlayerScale: 1,
      teamAwayPlayerOffsetX: 0,
      teamAwayPlayerOffsetY: 0,
    };
  });

export default {
  createInitialMatches,
};

