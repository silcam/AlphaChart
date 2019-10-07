export interface AlphabetLetter {
  forms: string[];
  exampleWord: string;
  imagePath: string;
}

export interface AlphabetChart {
  letters: AlphabetLetter[];
  timestamp: number;
  cols: number;
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

export function validDraftAlphabet(alphabet: DraftAlphabet) {
  return (
    alphabet.chart.letters.length > 0 &&
    alphabet.chart.letters.every(
      abletter => ![undefined, ""].includes(abletter.forms[0])
    ) &&
    alphabet.name.length > 0
  );
}

export function blankAlphabet(): DraftAlphabet {
  return {
    name: "",
    chart: {
      timestamp: Date.now().valueOf(),
      cols: 5,
      letters: []
    }
  };
}

export function blankAlphabetLetter(): AlphabetLetter {
  return {
    forms: ["", ""],
    exampleWord: "",
    imagePath: ""
  };
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
