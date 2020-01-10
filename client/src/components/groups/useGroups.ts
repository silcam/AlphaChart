import { GroupInflated } from "../../models/Group";
import { useAppSelector } from "../../state/appState";

export default function useGroups(ids?: string[]): GroupInflated[] {
  const groups = useAppSelector(state => state.groups);
  const users = useAppSelector(state => state.users);
  const alphabets = useAppSelector(state => state.alphabets.listings);

  const filteredGroups = ids ? groups.filter(g => ids.includes(g.id)) : groups;

  return filteredGroups.map(group => ({
    ...group,
    userObjs: users.filter(u => group.users.includes(u.id)),
    alphabetObjs: alphabets.filter(
      a => a.ownerType === "group" && a.owner == group.id
    )
  }));
}
