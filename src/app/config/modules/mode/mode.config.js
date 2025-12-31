/**
 * @typedef {Object} ModeSubMenu
 * @property {string} id Unique identifier for submenu selection.
 * @property {string} label Display label shown in the UI.
 */

/**
 * @typedef {Object} ModeConfigItem
 * @property {string} id Unique mode identifier (e.g., "football").
 * @property {string} label Label used in selectors or tabs.
 * @property {string} title Primary heading shown on the generator page.
 * @property {string} subtitle Supporting description for the mode.
 * @property {string} pageBackgroundClass Tailwind classes applied to page background.
 * @property {ModeSubMenu[]} subMenus Available sub menu options for the mode.
 * @property {string} defaultSubMenuId Sub menu that should be active initially.
 */

/**
 * Complete list of modes supported by the banner generator.
 * @type {ModeConfigItem[]}
 */
export const MODE_CONFIG = [
  {
    id: "football",
    label: "Sepak Bola",
    title: "Football Banner Generator",
    subtitle: "Buat banner jadwal sepakbola berukuran 1080 x 1080 dengan cepat.",
    pageBackgroundClass: "bg-slate-950",
    subMenus: [
      { id: "schedule", label: "Jadwal" },
      { id: "scores", label: "Skor Bola" },
      { id: "big_match", label: "Big Match" },
    ],
    defaultSubMenuId: "schedule",
  },
  {
    id: "basketball",
    label: "Bola Basket",
    title: "Basketball Banner Generator",
    subtitle: "Layout sama sementara, siap untuk penyesuaian konten basket.",
    pageBackgroundClass: "bg-gradient-to-br from-orange-950 via-slate-950 to-slate-950",
    subMenus: [{ id: "schedule", label: "Jadwal" }],
    defaultSubMenuId: "schedule",
  },
  {
    id: "esports",
    label: "E-Sports",
    title: "E-Sports Banner Generator",
    subtitle: "Gunakan template ini untuk jadwal turnamen gim favoritmu.",
    pageBackgroundClass: "bg-slate-950",
    subMenus: [{ id: "schedule", label: "Jadwal" }],
    defaultSubMenuId: "schedule",
  },
  {
    id: "togel",
    label: "Togel",
    title: "Togel Banner Generator",
    subtitle: "Template siap pakai untuk informasi keluaran dan jadwal togel.",
    pageBackgroundClass: "bg-slate-950",
    subMenus: [],
    defaultSubMenuId: "",
  },
  {
    id: "raffle",
    label: "Raffle",
    title: "Raffle Banner Generator",
    subtitle: "Siapkan banner pengumuman raffle dengan cepat.",
    pageBackgroundClass: "bg-slate-950",
    subMenus: [],
    defaultSubMenuId: "",
  },
];

