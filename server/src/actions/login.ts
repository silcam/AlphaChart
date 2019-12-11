import { LoginAttempt, StoredUser } from "../../../client/src/models/User";
import UserData from "../storage/UserData";
import UnverifiedUserData from "../storage/UnverifiedUserData";
import { checkPassword } from "../common/password";

export type LoginErrorType = "Invalid" | "Unverified";

export default async function login(
  loginAttempt: LoginAttempt
): Promise<StoredUser> {
  const user = await UserData.userByEmail(loginAttempt.email);
  if (user) {
    if (
      checkPassword(loginAttempt.password, user.passwordHash, user.passwordSalt)
    )
      return user;
    throw { status: 401, response: { error: "Invalid_login" } };
  } else {
    const unverifiedUsers = await UnverifiedUserData.findByEmail(
      loginAttempt.email
    );
    if (unverifiedUsers.length > 0)
      throw { status: 401, response: { error: "Account_not_verified" } };
    throw { status: 401, response: { error: "Invalid_login" } };
  }
}
