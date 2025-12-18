import TEAM_AUTO_LOGO_SOURCES from "./team-logo-sources";

export const normalizeTeamName = (name) => {
  if (!name) return "";
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

export const TEAM_AUTO_LOGO_LOOKUP = TEAM_AUTO_LOGO_SOURCES.reduce(
  (acc, entry) => {
    entry.names.forEach((name) => {
      const key = normalizeTeamName(name);
      if (key) {
        acc[key] = entry.source;
      }
    });
    return acc;
  },
  {}
);

export const getAutoTeamLogoSrc = (teamName) => {
  const normalized = normalizeTeamName(teamName);
  if (!normalized) return "";
  return TEAM_AUTO_LOGO_LOOKUP[normalized] || "";
};

export const resolveAutoTeamLogoSrc = (teamName) => getAutoTeamLogoSrc(teamName);

export default {
  normalizeTeamName,
  TEAM_AUTO_LOGO_LOOKUP,
  getAutoTeamLogoSrc,
  resolveAutoTeamLogoSrc,
};
