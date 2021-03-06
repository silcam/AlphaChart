import {
  AlphabetInflated,
  Alphabet,
  AlphabetListingInflated,
  AlphabetListing
} from "../../models/Alphabet";
import { useAppSelector } from "../../state/appState";
import { User } from "../../models/User";
import { Group } from "../../models/Group";

export default function useAlphabets(ids: string[]): AlphabetInflated[] {
  const alphabetsById = useAppSelector(state => state.alphabets.alphabets);
  const users = useAppSelector(state => state.users);
  const groups = useAppSelector(state => state.groups);

  const alphabets = ids
    .map(id => alphabetsById[id])
    .filter(a => a) as Alphabet[];
  return inflate(alphabets, users, groups);
}

export function useAlphabet(id: string): AlphabetInflated | null {
  const alphabets = useAlphabets([id]);
  return alphabets.length > 0 ? alphabets[0] : null;
}

export function useAlphabetListings(
  filter: (a: AlphabetListing) => boolean = () => true
): AlphabetListingInflated[] {
  const alphabets = useAppSelector(state => state.alphabets.listings);
  const users = useAppSelector(state => state.users);
  const groups = useAppSelector(state => state.groups);

  const filteredAlphabets = alphabets.filter(filter);
  return inflate(filteredAlphabets, users, groups);
}

export function useFeaturedAlphabetListings(): AlphabetListingInflated[] {
  const alphabets = useAppSelector(state =>
    state.alphabets.listings.filter(a =>
      state.alphabets.featuredIds.includes(a.id)
    )
  );
  const users = useAppSelector(state => state.users);
  const groups = useAppSelector(state => state.groups);

  return inflate(alphabets, users, groups);
}

function inflate<T extends AlphabetListing>(
  alphabets: T[],
  users: User[],
  groups: Group[]
) {
  return alphabets.map(alphabet => ({
    ...alphabet,
    userObjs: users.filter(user => alphabet.users.includes(user.id)),
    ownerObj: (alphabet.ownerType == "user" ? users : groups).find(
      item => item.id == alphabet.owner
    )
  }));
}
