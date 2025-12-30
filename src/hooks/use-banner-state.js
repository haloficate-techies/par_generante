import { useCallback, useMemo, useReducer } from "react";

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

const ACTIONS = {
  SET_TITLE: "set_title",
  SET_BRAND_LOGO: "set_brand_logo",
  SET_LEAGUE_LOGO: "set_league_logo",
  SET_FOOTER: "set_footer",
  SET_MATCH_COUNT: "set_match_count",
  UPDATE_MATCH_FIELD: "update_match_field",
  APPLY_AUTO_LOGO: "apply_auto_logo",
  ADJUST_LOGO: "adjust_logo",
  ADJUST_PLAYER: "adjust_player",
  TOGGLE_PLAYER_FLIP: "toggle_player_flip",
};

const createInitialState = (initialMatches, maxMatches) => ({
  title: "",
  matches: Array.isArray(initialMatches) ? initialMatches : [],
  activeMatchCount: Math.min(Math.max(1, initialMatches?.length || 1), maxMatches),
  brandLogoSrc: "",
  leagueLogoSrc: "",
  footerSrc: "",
  footerLink: "",
});

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_TITLE:
      return { ...state, title: action.payload || "" };
    case ACTIONS.SET_BRAND_LOGO:
      return { ...state, brandLogoSrc: action.payload || "", footerLink: "", footerSrc: action.footerSrc ?? state.footerSrc };
    case ACTIONS.SET_LEAGUE_LOGO:
      return { ...state, leagueLogoSrc: action.payload || "" };
    case ACTIONS.SET_FOOTER:
      return {
        ...state,
        footerSrc: action.payload || "",
        footerLink: typeof action.footerLink === "string" ? action.footerLink : state.footerLink,
      };
    case ACTIONS.SET_MATCH_COUNT: {
      const { nextCount, maxMatches, createInitialMatches } = action.payload;
      const normalizedCount = clamp(nextCount, 1, maxMatches);
      if (state.matches.length >= normalizedCount) {
        return { ...state, activeMatchCount: normalizedCount };
      }
      const additionalMatches = createInitialMatches(normalizedCount - state.matches.length);
      return {
        ...state,
        activeMatchCount: normalizedCount,
        matches: [...state.matches, ...additionalMatches],
      };
    }
    case ACTIONS.UPDATE_MATCH_FIELD: {
      const { index, field, value, resolveAutoTeamLogoSrc } = action.payload;
      return {
        ...state,
        matches: state.matches.map((match, idx) => {
          if (idx !== index) return match;
          const updatedMatch = { ...match, [field]: value };

          const resetAdjustments = (teamKey) => {
            const scaleKey = teamKey === "teamHome" ? "teamHomeLogoScale" : "teamAwayLogoScale";
            const offsetXKey = teamKey === "teamHome" ? "teamHomeLogoOffsetX" : "teamAwayLogoOffsetX";
            const offsetYKey = teamKey === "teamHome" ? "teamHomeLogoOffsetY" : "teamAwayLogoOffsetY";
            updatedMatch[scaleKey] = 1;
            updatedMatch[offsetXKey] = 0;
            updatedMatch[offsetYKey] = 0;
          };

          const applyAutoLogoFor = (teamField, { force = false } = {}) => {
            const logoField = teamField === "teamHome" ? "teamHomeLogo" : "teamAwayLogo";
            const flagField = teamField === "teamHome" ? "teamHomeLogoIsAuto" : "teamAwayLogoIsAuto";
            const teamName = updatedMatch[teamField];
            const autoLogoSrc = resolveAutoTeamLogoSrc(teamName);
            const hadManualLogo = match[logoField] && !match[flagField] && match[logoField] !== "";

            if (autoLogoSrc) {
              if (force || !hadManualLogo || match[flagField]) {
                updatedMatch[logoField] = autoLogoSrc;
                updatedMatch[flagField] = true;
                resetAdjustments(teamField);
              }
            } else {
              if (match[flagField] || updatedMatch[flagField]) {
                updatedMatch[logoField] = "";
                updatedMatch[flagField] = false;
              }
              resetAdjustments(teamField);
            }
          };

          if (field === "teamHome" || field === "teamAway") {
            applyAutoLogoFor(field);
          } else if (field === "teamHomeLogo" || field === "teamAwayLogo") {
            const flagField = field === "teamHomeLogo" ? "teamHomeLogoIsAuto" : "teamAwayLogoIsAuto";
            updatedMatch[flagField] = false;
            resetAdjustments(field === "teamHomeLogo" ? "teamHome" : "teamAway");
          } else if (field === "teamHomePlayerImage" || field === "teamAwayPlayerImage") {
            const baseKey = field === "teamHomePlayerImage" ? "teamHomePlayer" : "teamAwayPlayer";
            updatedMatch[`${baseKey}Scale`] = 1;
            updatedMatch[`${baseKey}OffsetX`] = 0;
            updatedMatch[`${baseKey}OffsetY`] = 0;
            updatedMatch[`${baseKey}Flip`] = false;
          }

          return updatedMatch;
        }),
      };
    }
    case ACTIONS.APPLY_AUTO_LOGO: {
      const { index, side, resolveAutoTeamLogoSrc } = action.payload;
      const teamField = side === "home" ? "teamHome" : "teamAway";
      const logoField = side === "home" ? "teamHomeLogo" : "teamAwayLogo";
      const flagField = side === "home" ? "teamHomeLogoIsAuto" : "teamAwayLogoIsAuto";
      const scaleKey = side === "home" ? "teamHomeLogoScale" : "teamAwayLogoScale";
      const offsetXKey = side === "home" ? "teamHomeLogoOffsetX" : "teamAwayLogoOffsetX";
      const offsetYKey = side === "home" ? "teamHomeLogoOffsetY" : "teamAwayLogoOffsetY";
      return {
        ...state,
        matches: state.matches.map((match, idx) => {
          if (idx !== index) return match;
          const autoLogoSrc = resolveAutoTeamLogoSrc(match[teamField]);
          if (autoLogoSrc) {
            return {
              ...match,
              [logoField]: autoLogoSrc,
              [flagField]: true,
              [scaleKey]: 1,
              [offsetXKey]: 0,
              [offsetYKey]: 0,
            };
          }
          return {
            ...match,
            [logoField]: "",
            [flagField]: false,
            [scaleKey]: 1,
            [offsetXKey]: 0,
            [offsetYKey]: 0,
          };
        }),
      };
    }
    case ACTIONS.ADJUST_LOGO: {
      const { index, side, updates } = action.payload;
      if (!updates) return state;
      const scaleKey = side === "home" ? "teamHomeLogoScale" : "teamAwayLogoScale";
      const offsetXKey = side === "home" ? "teamHomeLogoOffsetX" : "teamAwayLogoOffsetX";
      const offsetYKey = side === "home" ? "teamHomeLogoOffsetY" : "teamAwayLogoOffsetY";
      return {
        ...state,
        matches: state.matches.map((match, idx) => {
          if (idx !== index) return match;
          let nextMatch = match;
          const ensureDraft = () => {
            if (nextMatch === match) {
              nextMatch = { ...match };
            }
          };
          if (Object.prototype.hasOwnProperty.call(updates, "scale")) {
            const value = Number(updates.scale);
            const current = match[scaleKey] ?? 1;
            const nextValue = Number.isFinite(value) ? clamp(value, 0.25, 3) : current;
            if (nextValue !== current) {
              ensureDraft();
              nextMatch[scaleKey] = nextValue;
            }
          }
          if (Object.prototype.hasOwnProperty.call(updates, "offsetX")) {
            const value = Number(updates.offsetX);
            const current = match[offsetXKey] ?? 0;
            const nextValue = Number.isFinite(value) ? clamp(value, -0.75, 0.75) : current;
            if (nextValue !== current) {
              ensureDraft();
              nextMatch[offsetXKey] = nextValue;
            }
          }
          if (Object.prototype.hasOwnProperty.call(updates, "offsetY")) {
            const value = Number(updates.offsetY);
            const current = match[offsetYKey] ?? 0;
            const nextValue = Number.isFinite(value) ? clamp(value, -0.75, 0.75) : current;
            if (nextValue !== current) {
              ensureDraft();
              nextMatch[offsetYKey] = nextValue;
            }
          }
          return nextMatch;
        }),
      };
    }
    case ACTIONS.ADJUST_PLAYER: {
      const { index, side, updates } = action.payload;
      if (!updates) return state;
      const scaleKey = side === "home" ? "teamHomePlayerScale" : "teamAwayPlayerScale";
      const offsetXKey = side === "home" ? "teamHomePlayerOffsetX" : "teamAwayPlayerOffsetX";
      const offsetYKey = side === "home" ? "teamHomePlayerOffsetY" : "teamAwayPlayerOffsetY";
      return {
        ...state,
        matches: state.matches.map((match, idx) => {
          if (idx !== index) return match;
          let nextMatch = match;
          const ensureDraft = () => {
            if (nextMatch === match) {
              nextMatch = { ...match };
            }
          };
          if (Object.prototype.hasOwnProperty.call(updates, "scale")) {
            const value = Number(updates.scale);
            const current = match[scaleKey] ?? 1;
            const nextValue = Number.isFinite(value) ? clamp(value, 0.7, 1.5) : current;
            if (nextValue !== current) {
              ensureDraft();
              nextMatch[scaleKey] = nextValue;
            }
          }
          if (Object.prototype.hasOwnProperty.call(updates, "offsetX")) {
            const value = Number(updates.offsetX);
            const current = match[offsetXKey] ?? 0;
            const nextValue = Number.isFinite(value) ? clamp(value, -0.75, 0.75) : current;
            if (nextValue !== current) {
              ensureDraft();
              nextMatch[offsetXKey] = nextValue;
            }
          }
          if (Object.prototype.hasOwnProperty.call(updates, "offsetY")) {
            const value = Number(updates.offsetY);
            const current = match[offsetYKey] ?? 0;
            const nextValue = Number.isFinite(value) ? clamp(value, -0.75, 0.75) : current;
            if (nextValue !== current) {
              ensureDraft();
              nextMatch[offsetYKey] = nextValue;
            }
          }
          return nextMatch;
        }),
      };
    }
    case ACTIONS.TOGGLE_PLAYER_FLIP: {
      const { index, side } = action.payload;
      const imageKey = side === "home" ? "teamHomePlayerImage" : "teamAwayPlayerImage";
      const flipKey = side === "home" ? "teamHomePlayerFlip" : "teamAwayPlayerFlip";
      return {
        ...state,
        matches: state.matches.map((match, idx) => {
          if (idx !== index) return match;
          if (!match[imageKey]) {
            return match;
          }
          return { ...match, [flipKey]: !match[flipKey] };
        }),
      };
    }
    default:
      return state;
  }
};

/**
 * Manages banner state via a reducer that understands 15 action types.
 * Handles matches, logos, players, and auto-logo behavior while exposing memoized action helpers.
 *
 * @param {Object} config
 * @param {Array} [config.initialMatches=[]] - Seed array of match objects.
 * @param {number} [config.maxMatches=5] - Maximum allowed match slots.
 * @param {Function} [config.createInitialMatches] - Factory used when expanding match slots.
 * @param {Function} [config.resolveAutoTeamLogoSrc] - Resolver that supplies auto-logo URLs.
 * @returns {Object} The current banner state and memoized action creators.
 * @returns {Object} return.state - Banner state slice.
 * @returns {string} return.state.title
 * @returns {Array} return.state.matches
 * @returns {number} return.state.activeMatchCount
 * @returns {string} return.state.brandLogoSrc
 * @returns {string} return.state.leagueLogoSrc
 * @returns {string} return.state.footerSrc
 * @returns {string} return.state.footerLink
 * @returns {Object} return.actions - Action helpers.
 * @returns {Function} return.actions.setTitle
 * @returns {Function} return.actions.setBrandLogo
 * @returns {Function} return.actions.setLeagueLogo
 * @returns {Function} return.actions.setFooter
 * @returns {Function} return.actions.setMatchCount
 * @returns {Function} return.actions.updateMatchField
 * @returns {Function} return.actions.autoLogo
 * @returns {Function} return.actions.adjustLogo
 * @returns {Function} return.actions.adjustPlayer
 * @returns {Function} return.actions.togglePlayerFlip
 */
const useBannerState = ({
  initialMatches = [],
  maxMatches = 5,
  createInitialMatches = (count) =>
    Array.from({ length: count }).map(() => ({ teamHome: "", teamAway: "" })),
  resolveAutoTeamLogoSrc = () => "",
} = {}) => {
  const initialState = useMemo(
    () => createInitialState(initialMatches, maxMatches),
    [initialMatches, maxMatches]
  );
  const [state, dispatch] = useReducer(reducer, initialState);

  const setTitle = useCallback((value) => dispatch({ type: ACTIONS.SET_TITLE, payload: value }), []);
  const setBrandLogo = useCallback(
    (value, { footerSrc, footerLink } = {}) =>
      dispatch({ type: ACTIONS.SET_BRAND_LOGO, payload: value, footerSrc, footerLink }),
    []
  );
  const setLeagueLogo = useCallback(
    (value) => dispatch({ type: ACTIONS.SET_LEAGUE_LOGO, payload: value }),
    []
  );
  const setFooter = useCallback(
    (value, footerLink) =>
      dispatch({ type: ACTIONS.SET_FOOTER, payload: value, footerLink }),
    []
  );
  const setMatchCount = useCallback(
    (nextCount) =>
      dispatch({
        type: ACTIONS.SET_MATCH_COUNT,
        payload: { nextCount, maxMatches, createInitialMatches },
      }),
    [maxMatches, createInitialMatches]
  );
  const updateMatchField = useCallback(
    (index, field, value) =>
      dispatch({
        type: ACTIONS.UPDATE_MATCH_FIELD,
        payload: { index, field, value, resolveAutoTeamLogoSrc },
      }),
    [resolveAutoTeamLogoSrc]
  );
  const autoLogo = useCallback(
    (index, side) =>
      dispatch({
        type: ACTIONS.APPLY_AUTO_LOGO,
        payload: { index, side, resolveAutoTeamLogoSrc },
      }),
    [resolveAutoTeamLogoSrc]
  );
  const adjustLogo = useCallback(
    (index, side, updates) =>
      dispatch({ type: ACTIONS.ADJUST_LOGO, payload: { index, side, updates } }),
    []
  );
  const adjustPlayer = useCallback(
    (index, side, updates) =>
      dispatch({ type: ACTIONS.ADJUST_PLAYER, payload: { index, side, updates } }),
    []
  );
  const togglePlayerFlip = useCallback(
    (index, side) => dispatch({ type: ACTIONS.TOGGLE_PLAYER_FLIP, payload: { index, side } }),
    []
  );

  return {
    state,
    actions: {
      setTitle,
      setBrandLogo,
      setLeagueLogo,
      setFooter,
      setMatchCount,
      updateMatchField,
      autoLogo,
      adjustLogo,
      adjustPlayer,
      togglePlayerFlip,
    },
  };
};

export default useBannerState;
