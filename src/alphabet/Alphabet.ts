import { List } from "immutable";

export type Alphabet = List<List<string>>;

export function validAlphabet(alphabet: Alphabet) {
  return (
    alphabet.size > 0 &&
    alphabet.every(letters => ![undefined, ""].includes(letters.get(0)))
  );
}
