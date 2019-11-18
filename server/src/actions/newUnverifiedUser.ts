import {
  NewUser,
  UnverifiedUser,
  validationErrors
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
  const existing = await UserData.user(user.email);
  if (existing) return throwErr("AlreadyExists");

  const vErrors = validationErrors(user);
  if (vErrors) return throwErr("Invalid", { validationErrors: vErrors });

  if (!user.name) user.name = user.email.replace(/@.*/, "");
  const passwordParams = createPassword(user.password);
  const { hash: verification } = createPassword(
    new Date().valueOf().toString()
  );
  const unverifiedUser: UnverifiedUser = {
    _id: verification,
    email: user.email,
    name: user.name,
    passwordHash: passwordParams.hash,
    passwordSalt: passwordParams.salt,
    verification,
    created: new Date().valueOf()
  };

  await UnverifiedUserData.create(unverifiedUser);
  await sendNewUserMail(unverifiedUser, locale);
  return unverifiedUser;
}

function throwErr(
  errType: NewUnverifiedUserErrorType,
  errBody: { validationErrors?: string[] } = {}
): never {
  throw { ...errBody, errType };
}
