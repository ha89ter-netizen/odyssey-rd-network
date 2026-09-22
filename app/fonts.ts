import {
  IBM_Plex_Sans,
  IBM_Plex_Mono,
  Space_Grotesk,
  JetBrains_Mono,
  Archivo,
  Work_Sans,
  Instrument_Sans,
  Manrope,
  Chivo,
} from "next/font/google";

const plexSans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--f-plex" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--f-plex-mono" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--f-grotesk" });
const jet = JetBrains_Mono({ subsets: ["latin"], variable: "--f-jet" });
const archivo = Archivo({ subsets: ["latin"], variable: "--f-archivo" });
const workSans = Work_Sans({ subsets: ["latin"], variable: "--f-work" });
const instrument = Instrument_Sans({ subsets: ["latin"], variable: "--f-instrument" });
const manrope = Manrope({ subsets: ["latin"], variable: "--f-manrope" });
const chivo = Chivo({ subsets: ["latin"], variable: "--f-chivo" });

export const fontVars = [
  plexSans.variable,
  plexMono.variable,
  grotesk.variable,
  jet.variable,
  archivo.variable,
  workSans.variable,
  instrument.variable,
  manrope.variable,
  chivo.variable,
].join(" ");
