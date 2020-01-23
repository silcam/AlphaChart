import UnverifiedUserData from "../storage/UnverifiedUserData";
import UserData from "../storage/UserData";
import { StoredUser } from "../../../client/src/models/User";

export type VerifyUserErrorType = "InvalidCode" | "AlreadyExists";

export default async function verifyUser(
  verification: string
): Promise<StoredUser> {
  const unverifiedUser = await UnverifiedUserData.find(verification);
  if (!unverifiedUser)
    throw { status: 422, response: { error: "Invalid_code" } };

  if (!(await verifyUniqueEmail(unverifiedUser.email)))
    throw {
      status: 422,
      response: { error: "User_exists", subs: { email: unverifiedUser.email } }
    };

  const { verification: _v, created, _id, ...newUser } = unverifiedUser;
  const user = await UserData.createUser(newUser);
  UnverifiedUserData.remove(verification);

  return user;
}

export async function verifyUniqueEmail(email: string): Promise<boolean> {
  const existing = await UserData.userByEmail(email);
  return existing === null;
}
