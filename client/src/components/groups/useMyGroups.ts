import { Group } from "../../models/Group";
import { useSelector } from "react-redux";
import { AppState } from "../../state/appState";

export default function useMyGroups(): Group[] {
  const user = useSelector((state: AppState) => state.currentUser.user);
  const groups = useSelector((state: AppState) => state.groups);
  return user ? groups.filter(g => g.users.includes(user.id)) : [];
}
