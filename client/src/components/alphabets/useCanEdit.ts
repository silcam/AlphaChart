import { Group } from "../../models/Group";
import { AlphabetListing } from "../../models/Alphabet";
import { useSelector } from "react-redux";
import { AppState } from "../../state/appState";
import useMyGroups from "../groups/useMyGroups";

export default function useCanEdit(): (a: AlphabetListing) => boolean {
  const user = useSelector((state: AppState) => state.currentUser.user);
  const myGroups = useMyGroups();
  if (!user) return () => false;

  return alphabet => canEdit(user.id, myGroups, alphabet);
}

function canEdit(
  userId: string,
  userGroups: Group[],
  alphabet: AlphabetListing
) {
  return (
    (alphabet.ownerType == "user" && alphabet.owner == userId) ||
    (alphabet.ownerType == "group" &&
      userGroups.some(g => g.id == alphabet.owner)) ||
    alphabet.users.includes(userId)
  );
}
