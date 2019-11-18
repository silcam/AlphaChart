import { LoginAttempt, StoredUser } from "../../../client/src/models/User";
import UserData from "../storage/UserData";
import UnverifiedUserData from "../storage/UnverifiedUserData";
import { checkPassword } from "../common/password";

export type LoginErrorType = "Invalid" | "Unverified";

export default async function login(
  loginAttempt: LoginAttempt
): Promise<StoredUser> {
  const user = await UserData.user(loginAttempt.email);
  if (user) {
    if (
      checkPassword(loginAttempt.password, user.passwordHash, user.passwordSalt)
    )
      return user;
    return throwErr("Invalid");
  } else {
    const unverifiedUsers = await UnverifiedUserData.findByEmail(
      loginAttempt.email
    );
    if (unverifiedUsers.length > 0) return throwErr("Unverified");
    return throwErr("Invalid");
  }
}

function throwErr(errType: LoginErrorType): never {
  throw { errType };
}
