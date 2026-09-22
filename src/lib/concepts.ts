export type ScreenId = "dashboard" | "create" | "case" | "match" | "compare" | "room";

export const SCREENS: { id: ScreenId; label: string; short: string }[] = [
  { id: "dashboard", label: "Doctor Dashboard", short: "Dashboard" },
  { id: "create", label: "Create Case", short: "Create" },
  { id: "case", label: "Case Intelligence", short: "Case" },
  { id: "match", label: "Potential Match", short: "Match" },
  { id: "compare", label: "Case Comparison", short: "Compare" },
  { id: "room", label: "Collaboration Room", short: "Room" },
];

export type ConceptMeta = {
  id: string;
  num: string;
  name: string;
  /** One line describing the visual thesis. */
  thesis: string;
  /** Typography signature, shown in the lab. */
  type: string;
  /** Three swatches used by the lab selector — not by the concept itself. */
  swatches: [string, string, string];
  scheme: "light" | "dark";
};

export const CONCEPTS: ConceptMeta[] = [
  {
    id: "01-clinical-command",
    num: "01",
    name: "Clinical Command",
    thesis: "International hospital command centre. Architectural grid, graphite type, restrained cobalt.",
    type: "IBM Plex Sans / IBM Plex Mono",
    swatches: ["#f6f7f8", "#1b2027", "#1f4fd8"],
    scheme: "light",
  },
  {
    id: "02-molecular-atlas",
    num: "02",
    name: "Molecular Atlas",
    thesis: "Dark molecular intelligence. Node structures, luminous cyan, clinical — not cyberpunk.",
    type: "Space Grotesk / JetBrains Mono",
    swatches: ["#0a0d10", "#e6edf3", "#3fd0e0"],
    scheme: "dark",
  },
  {
    id: "03-swiss-clinical",
    num: "03",
    name: "Swiss Clinical",
    thesis: "International Typographic Style. Strict grid, black on white, one red. Information is the design.",
    type: "Archivo",
    swatches: ["#ffffff", "#000000", "#e1231d"],
    scheme: "light",
  },
  {
    id: "04-evidence-archive",
    num: "04",
    name: "Evidence Archive",
    thesis: "A century of medical knowledge becoming searchable. Ivory, serif, provenance, burgundy.",
    type: "Source Serif 4 / Work Sans",
    swatches: ["#f4efe6", "#2b2723", "#7c1f2b"],
    scheme: "light",
  },
  {
    id: "05-precision-laboratory",
    num: "05",
    name: "Precision Laboratory",
    thesis: "Diagnostic instrumentation. Calibration marks, measurement rules, signal-green used sparingly.",
    type: "Instrument Sans / IBM Plex Mono",
    swatches: ["#eef1f3", "#171b1e", "#b4e02a"],
    scheme: "light",
  },
  {
    id: "06-global-network",
    num: "06",
    name: "Global Network",
    thesis: "The network effect made visible. Geography, institutions, one line from Astana to Heidelberg.",
    type: "Work Sans / IBM Plex Mono",
    swatches: ["#fbfcfd", "#0d2240", "#1d7a5f"],
    scheme: "light",
  },
  {
    id: "07-quiet-luxury",
    num: "07",
    name: "Quiet Luxury MedTech",
    thesis: "Restraint as authority. Warm off-white, deep navy, generous measure, almost no borders.",
    type: "Cormorant Garamond / Jost",
    swatches: ["#f7f4ef", "#141b2b", "#9a8256"],
    scheme: "light",
  },
  {
    id: "08-bio-glass",
    num: "08",
    name: "Bio Glass",
    thesis: "Biological intelligence. Ice and mint, layered depth used only where it clarifies hierarchy.",
    type: "Manrope / JetBrains Mono",
    swatches: ["#e8f1f4", "#10262e", "#3ea99a"],
    scheme: "light",
  },
  {
    id: "09-medical-os",
    num: "09",
    name: "Medical Operating System",
    thesis: "An operating system for rare-disease intelligence. Split panes, command palette, high density.",
    type: "Chivo / JetBrains Mono",
    swatches: ["#0e1420", "#d7dee8", "#ff8a3d"],
    scheme: "dark",
  },
  {
    id: "10-human-machine",
    num: "10",
    name: "Human + Machine",
    thesis: "Two visual languages in dialogue. Machine is geometric and cool; human is warm and editorial.",
    type: "Fraunces / JetBrains Mono",
    swatches: ["#faf7f2", "#1a1714", "#2f6fd0"],
    scheme: "light",
  },
];

export const CONCEPT_IDS = CONCEPTS.map((c) => c.id);

export function findConcept(id: string) {
  return CONCEPTS.find((c) => c.id === id);
}

export function screenLabel(id: string) {
  return SCREENS.find((s) => s.id === id)?.label ?? id;
}
