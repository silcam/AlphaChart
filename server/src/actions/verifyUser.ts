import UnverifiedUserData from "../storage/UnverifiedUserData";
import UserData from "../storage/UserData";
import { StoredUser } from "../../../client/src/models/User";

export type VerifyUserErrorType = "InvalidCode" | "AlreadyExists";

export default async function verifyUser(
  verification: string
): Promise<StoredUser> {
  const unverifiedUser = await UnverifiedUserData.find(verification);
  if (!unverifiedUser) return throwErr("InvalidCode");

  const { verification: _v, created, ...user } = unverifiedUser;
  user._id = user.email;
  try {
    await UserData.createUser(user);
  } catch (err) {
    if (err.errmsg.includes("duplicate key"))
      return throwErr("AlreadyExists", { user });
    else throw err;
  }

  UnverifiedUserData.remove(verification);

  return user;
}

function throwErr(
  errType: VerifyUserErrorType,
  errBody: { user?: StoredUser } = {}
): never {
  throw { ...errBody, errType };
}
