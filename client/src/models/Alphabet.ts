import { ObjectId } from "bson";

export interface AlphabetLetter {
  forms: string[];
  exampleWord: string;
  imagePath: string;
}

export const defaultFonts = [
  "Andika",
  "AndikaNewBasic",
  "CharisSIL-Literacy"
] as const;

export interface ChartStyles {
  chart?: {
    fontFamily?: string;
  };
  title?: {
    fontSize?: string;
    textAlign?: string;
  };
  subtitle?: {
    fontSize?: string;
    textAlign?: string;
  };
  table?: {
    borderStyle?: "solid";
    borderWidth?: string;
    borderColor?: string;
  };
  letter?: {
    fontSize?: string;
  };
  alphabetSummary?: {
    display?: "flex" | "none";
    fontSize?: string;
  };
  exampleWord?: {
    fontSize?: string;
  };
  exampleWordKeyLetter?: {
    fontWeight?: "normal" | "bold";
  };
  lastRowFiller?: {
    fontSize?: string;
  };
  footer?: {
    fontSize?: string;
  };
  otherSettings?: {
    alphabetSummaryForm?: number;
    display?: string; // Dummy property because TS is hard
  };
}

// export type ChartStyles = {
//   [P in keyof ChartStylesStrict]?: {
//     [SubP in keyof ChartStylesStrict[P]]?: ChartStylesStrict[P][SubP];
//   };
// };

export function defaultChartStyles(): ChartStyles {
  return {
    chart: { fontFamily: "AndikaNewBasic" },
    title: { fontSize: "3em", textAlign: "Center" },
    subtitle: { fontSize: "1.6em", textAlign: "Center" },
    table: { borderStyle: "solid", borderWidth: "1px", borderColor: "#ddd" },
    letter: { fontSize: "3em" },
    alphabetSummary: { display: "flex", fontSize: "1.6em" },
    exampleWord: { fontSize: "1em" },
    exampleWordKeyLetter: { fontWeight: "bold" },
    lastRowFiller: { fontSize: "1em" },
    footer: { fontSize: "1em" },
    otherSettings: { alphabetSummaryForm: 1 }
  };
}

export interface AlphabetChart {
  letters: AlphabetLetter[];
  timestamp: number;
  cols: number;
  meta: {
    title?: string;
    subtitle?: string;
    lastRowFiller?: string;
    footer?: string;
  };
  styles: ChartStyles;
}

export interface DraftAlphabet {
  name: string;
  chart: AlphabetChart;
}

export interface Alphabet {
  _id: string;
  name: string;
  user: string;
  charts: AlphabetChart[];
}

export type StoredAlphabet = Omit<Alphabet, "_id"> & { _id: ObjectId };

export function validDraftAlphabet(alphabet: DraftAlphabet) {
  return (
    alphabet.chart.letters.length > 0 &&
    alphabet.chart.letters.every(
      abletter => ![undefined, ""].includes(abletter.forms[0])
    ) &&
    alphabet.name.length > 0
  );
}

export function blankAlphabet(name: string): DraftAlphabet {
  return {
    name,
    chart: {
      timestamp: Date.now().valueOf(),
      cols: 5,
      letters: [],
      meta: { title: name },
      styles: defaultChartStyles()
    }
  };
}

export function blankAlphabetLetter(): AlphabetLetter {
  return {
    forms: [],
    exampleWord: "",
    imagePath: ""
  };
}

export function stylesFor(chart: AlphabetChart, element: keyof ChartStyles) {
  return chart.styles[element]
    ? { ...defaultChartStyles()[element], ...chart.styles[element] }
    : defaultChartStyles()[element];
}

export function alphabetSummaryForm(styles: ChartStyles): number {
  return styles.otherSettings && styles.otherSettings.alphabetSummaryForm
    ? styles.otherSettings.alphabetSummaryForm
    : defaultChartStyles().otherSettings!.alphabetSummaryForm!;
}

// export function setAlphabetLetter(
//   abLetter: AlphabetLetter,
//   caseIndex: number,
//   value: string
// ): AlphabetLetter {
//   const { letter, ...rest } = abLetter;
//   return {
//     ...rest,
//     letter: letter.set(caseIndex, value)
//   };
// }

// export function demoAlphabetChart(): AlphabetChart {
//   return List(
//     [
//       "Α",
//       "Β",
//       "Γ",
//       "Δ",
//       "Ε",
//       "Ζ",
//       "Η",
//       "Θ",
//       "Ι",
//       "Κ",
//       "Λ",
//       "Μ",
//       "Ν",
//       "Ξ",
//       "Ο",
//       "Π",
//       "Ρ",
//       "Σ",
//       "Τ",
//       "Υ",
//       "Φ",
//       "Χ",
//       "Ψ",
//       "Ω"
//     ].map(ucLetter => ({
//       letter: List([ucLetter, ucLetter.toLocaleLowerCase()]),
//       exampleWord: "",
//       imagePath: ""
//     }))
//   );
// }
