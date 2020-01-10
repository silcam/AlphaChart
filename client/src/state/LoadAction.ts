import { Alphabet, AlphabetListing } from "../models/Alphabet";
import { User, CurrentUser } from "../models/User";
import { Group } from "../models/Group";
import { Locale } from "../i18n/i18n";

export interface LoadAction {
  type: "ACLoad";
  payload: {
    alphabets?: Alphabet[];
    alphabetListings?: AlphabetListing[];
    users?: User[];
    groups?: Group[];
    currentUser?: CurrentUser | { locale: Locale };
  };
}

export function loadAction(payload: LoadAction["payload"]): LoadAction {
  return { type: "ACLoad", payload };
}

// export function isLoadAction(action: any): action is LoadAction {
//   return typeof action == "object" && action.type == "ACLoad";
// }
