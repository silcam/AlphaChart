import { ObjectId } from "bson";
import { ChartStyles, defaultChartStyles, setRightToLeft } from "./ChartStyles";

export interface AlphabetLetter {
  forms: string[];
  exampleWord: string;
  imagePath: string;
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
  chart: AlphabetChart;
}

export interface AlphabetListing extends Omit<Alphabet, "chart"> {
  userDisplayName: string;
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
  const rightToLeft = /[א-ת؀-ۿ]/.test(name);
  const styles = rightToLeft
    ? setRightToLeft(defaultChartStyles(), rightToLeft)
    : defaultChartStyles();
  return {
    name,
    chart: {
      timestamp: Date.now().valueOf(),
      cols: 5,
      letters: [],
      meta: { title: name },
      styles
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
