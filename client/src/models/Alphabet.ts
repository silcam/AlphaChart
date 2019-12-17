import { ObjectId } from "bson";
import { ChartStyles, defaultChartStyles, setRightToLeft } from "./ChartStyles";
import { Group } from "./Group";
import { User } from "./User";

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

export type AlphOwnerType = "user" | "group";
export interface DraftAlphabet {
  name: string;
  chart: AlphabetChart;
  owner: string;
  ownerType: AlphOwnerType;
}

export interface Alphabet {
  id: string;
  name: string;
  owner: string;
  ownerType: AlphOwnerType;
  users: string[];
  chart: AlphabetChart;
}

export interface StoredAlphabet {
  _id: ObjectId;
  name: string;
  _owner: ObjectId;
  ownerType: AlphOwnerType;
  _users: ObjectId[];
  chart: AlphabetChart;
}

export function toAlphabet(sa: StoredAlphabet): Alphabet {
  const { _id, _owner, _users, ...alph } = sa;
  return {
    ...alph,
    id: _id.toHexString(),
    owner: _owner.toHexString(),
    users: _users.map(id => id.toHexString())
  };
}

// export function toStoredAlphabet(alpha: Alphabet): StoredAlphabet {
//   const { id, user, ...sa } = alpha;
//   return { ...alpha, _id: new ObjectID(id), _user: new ObjectID(user) };
// }

export type AlphabetListing = Omit<Alphabet, "chart">;

export function validDraftAlphabet(alphabet: DraftAlphabet) {
  return (
    alphabet.chart.letters.length > 0 &&
    alphabet.chart.letters.every(
      abletter => ![undefined, ""].includes(abletter.forms[0])
    ) &&
    alphabet.name.length > 0
  );
}

export function blankAlphabet(
  name: string,
  userId: string,
  ownerType: AlphOwnerType = "user"
): DraftAlphabet {
  const rightToLeft = /[א-ת؀-ۿ]/.test(name);
  const styles = rightToLeft
    ? setRightToLeft(defaultChartStyles(), rightToLeft)
    : defaultChartStyles();
  return {
    name,
    owner: userId,
    ownerType,
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

export function alphabetCompare(
  a: AlphabetListing,
  b: AlphabetListing
): number {
  return a.name.localeCompare(b.name);
}

export function alphabetOwner(
  alphabet: AlphabetListing,
  users: User[],
  groups: Group[]
): Group | User | undefined {
  const list = alphabet.ownerType == "user" ? users : groups;
  return list.find(item => item.id == alphabet.owner);
}
