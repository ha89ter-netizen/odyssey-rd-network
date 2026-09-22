import {
  IBM_Plex_Sans,
  IBM_Plex_Mono,
  Space_Grotesk,
  JetBrains_Mono,
  Archivo,
  Source_Serif_4,
  Work_Sans,
  Instrument_Sans,
  Cormorant_Garamond,
  Jost,
  Manrope,
  Chivo,
  Fraunces,
} from "next/font/google";

const plexSans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--f-plex" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--f-plex-mono" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--f-grotesk" });
const jet = JetBrains_Mono({ subsets: ["latin"], variable: "--f-jet" });
const archivo = Archivo({ subsets: ["latin"], variable: "--f-archivo" });
const sourceSerif = Source_Serif_4({ subsets: ["latin"], variable: "--f-source-serif" });
const workSans = Work_Sans({ subsets: ["latin"], variable: "--f-work" });
const instrument = Instrument_Sans({ subsets: ["latin"], variable: "--f-instrument" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--f-cormorant" });
const jost = Jost({ subsets: ["latin"], variable: "--f-jost" });
const manrope = Manrope({ subsets: ["latin"], variable: "--f-manrope" });
const chivo = Chivo({ subsets: ["latin"], variable: "--f-chivo" });
const fraunces = Fraunces({ subsets: ["latin"], axes: ["SOFT", "WONK", "opsz"], variable: "--f-fraunces" });

export const fontVars = [
  plexSans.variable,
  plexMono.variable,
  grotesk.variable,
  jet.variable,
  archivo.variable,
  sourceSerif.variable,
  workSans.variable,
  instrument.variable,
  cormorant.variable,
  jost.variable,
  manrope.variable,
  chivo.variable,
  fraunces.variable,
].join(" ");
