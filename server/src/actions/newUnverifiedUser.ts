import {
  NewUser,
  UnverifiedUser,
  validationErrors,
  NewUnverifiedUser
} from "../../../client/src/models/User";
import { createPassword } from "../common/password";
import UserData from "../storage/UserData";
import UnverifiedUserData from "../storage/UnverifiedUserData";
import sendNewUserMail from "../mail/sendNewUserMail";
import { Locale } from "../../../client/src/i18n/i18n";

export type NewUnverifiedUserErrorType = "Invalid" | "AlreadyExists";

export default async function newUnverifiedUser(
  user: NewUser,
  locale: Locale
): Promise<UnverifiedUser> {
  const existing = await UserData.userByEmail(user.email);
  if (existing)
    throw {
      status: 422,
      response: { error: "User_exists", subs: { email: user.email } }
    };

  const vErrors = validationErrors(user);
  if (vErrors)
    throw {
      status: 422,
      response: { error: vErrors.join(" ") }
    };

  if (!user.name) user.name = user.email.replace(/@.*/, "");
  const passwordParams = createPassword(user.password);
  const { hash: verification } = createPassword(
    new Date().valueOf().toString()
  );
  const newUnverifiedUser: NewUnverifiedUser = {
    email: user.email,
    name: user.name,
    passwordHash: passwordParams.hash,
    passwordSalt: passwordParams.salt,
    verification,
    created: new Date().valueOf()
  };

  const unverifiedUser = await UnverifiedUserData.create(newUnverifiedUser);
  await sendNewUserMail(unverifiedUser, locale);
  return unverifiedUser;
}
