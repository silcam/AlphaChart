import { StoredUser } from "../../../client/src/models/User";
import { StoredAlphabet } from "../../../client/src/models/Alphabet";
import GroupData from "../storage/GroupData";

// Invert the logic, so that forgetting `await` does not result in false positives

export default async function cannotEditAlphabet(
  user: StoredUser | null,
  alphabet: StoredAlphabet
) {
  return !user || !(await canEditAlphabet(user, alphabet));
}

export async function cannotControlAlphabet(
  user: StoredUser | null,
  alphabet: StoredAlphabet
) {
  return !user || !(await canControlAlphabet(user, alphabet));
}

async function canEditAlphabet(user: StoredUser, alphabet: StoredAlphabet) {
  if (alphabet._users.some(id => id.equals(user._id))) return true;

  return await canControlAlphabet(user, alphabet);
}

async function canControlAlphabet(user: StoredUser, alphabet: StoredAlphabet) {
  if (alphabet.ownerType == "user" && user._id.equals(alphabet._owner))
    return true;

  if (alphabet.ownerType == "group") {
    const group = await GroupData.group(alphabet._owner);
    if (group && group._users.some(id => id.equals(user._id))) return true;
  }

  return false;
}
