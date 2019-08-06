import { List } from "immutable";

interface AlphabetLetter {
  letter: List<string>;
  exampleWord: string;
  imagePath: string;
}

export type Alphabet = List<AlphabetLetter>;

export function validAlphabet(alphabet: Alphabet) {
  return (
    alphabet.size > 0 &&
    alphabet.every(
      abletter => ![undefined, ""].includes(abletter.letter.get(0))
    )
  );
}

export function blankAlphabetLetter(): AlphabetLetter {
  return {
    letter: List(["", ""]),
    exampleWord: "",
    imagePath: ""
  };
}

export function setAlphabetLetter(
  abLetter: AlphabetLetter,
  caseIndex: number,
  value: string
): AlphabetLetter {
  const { letter, ...rest } = abLetter;
  return {
    ...rest,
    letter: letter.set(caseIndex, value)
  };
}

export function demoAlphabet(): Alphabet {
  return List(
    [
      "Α",
      "Β",
      "Γ",
      "Δ",
      "Ε",
      "Ζ",
      "Η",
      "Θ",
      "Ι",
      "Κ",
      "Λ",
      "Μ",
      "Ν",
      "Ξ",
      "Ο",
      "Π",
      "Ρ",
      "Σ",
      "Τ",
      "Υ",
      "Φ",
      "Χ",
      "Ψ",
      "Ω"
    ].map(ucLetter => ({
      letter: List([ucLetter, ucLetter.toLocaleLowerCase()]),
      exampleWord: "",
      imagePath: ""
    }))
  );
}
