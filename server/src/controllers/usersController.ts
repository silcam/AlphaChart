import { Express } from "express";
import {
  NewUser,
  toCurrentUser,
  LoginAttempt,
  toPublicUser,
  StoredUser,
  validPassword
} from "../../../client/src/models/User";
import UserData from "../storage/UserData";
import { currentUser, currentUserStrict, getById } from "./controllerHelper";
import newUnverifiedUser from "../actions/newUnverifiedUser";
import verifyUser, { verifyUniqueEmail } from "../actions/verifyUser";
import login from "../actions/login";
import { Locale } from "../../../client/src/i18n/i18n";
import { addGetHandler, addPostHandler } from "./serverApi";
import GroupData from "../storage/GroupData";
import { toGroup } from "../../../client/src/models/Group";
import AlphabetData from "../storage/AlphabetData";
import { toAlphabet } from "../../../client/src/models/Alphabet";
import { ObjectID } from "mongodb";
import { filterKeys } from "../../../client/src/util/objectUtils";
import { APIError } from "../../../client/src/api/Api";
import UnverifiedUserData from "../storage/UnverifiedUserData";
import sendNewUserMail from "../mail/sendNewUserMail";
import { last } from "../common/ArrayUtils";
import { checkPassword, createPassword, createHash } from "../common/password";
import sendPasswordResetMail from "../mail/sendPasswordResetMail";

export default function usersController(app: Express) {
  // addGetHandler(app, "/users", async req => {
  //   const users = await UserData.users();
  //   return users.map(user => toPublicUser(user));
  // });

  addGetHandler(app, "/users/search", async req => {
    const query = req.query.q;
    const users = await UserData.search(query);
    return { users: users.map(u => toPublicUser(u)) };
  });

  addPostHandler(app, "/users", async req => {
    const newUser: NewUser = req.body;
    const locale: Locale = req.session!.locale || "en";

    const unverifiedUser = await newUnverifiedUser(newUser, locale);
    return null;
  });

  addPostHandler(app, "/users/resendConfirmation", async req => {
    const email = req.body.email;
    const locale: Locale = req.session!.locale || "en";

    const unverifiedUser = last(await UnverifiedUserData.findByEmail(email));
    if (unverifiedUser) await sendNewUserMail(unverifiedUser, locale);
    return { email };
  });

  addPostHandler(app, "/users/verify", async req => {
    const verification: string = req.body.verification;
    const user = await verifyUser(verification);
    return toCurrentUser(user);
  });

  addGetHandler(app, "/users/current", async req => {
    const user = await currentUser(req);
    if (user) {
      return currentUserResponse(user);
    } else {
      req.session!.userId = undefined;
      return {
        currentUser: { locale: req.session!.locale },
        groups: [],
        alphabetListings: []
      };
    }
  });

  addPostHandler(app, "/users/login", async req => {
    const loginAttempt: LoginAttempt = req.body;
    const user = await login(loginAttempt);
    req.session!.userId = `${user._id}`;
    return currentUserResponse(user);
  });

  addPostHandler(app, "/users/locale", async req => {
    const locale = req.body.locale;
    if (locale) {
      req.session!.locale = locale;
      const user = await currentUser(req);
      if (user) {
        user.locale = locale;
        UserData.update(user);
      }
    }
    return null;
  });

  addPostHandler(app, "/users/logout", async req => {
    req.session!.userId = undefined;
    return null;
  });

  addPostHandler(app, "/users/:id/update", async req => {
    const user = await currentUserStrict(req);
    if (!user._id.equals(new ObjectID(req.params.id))) throw { status: 401 };

    const userUpdate: Partial<StoredUser> = filterKeys(req.body, [
      "email",
      "name"
    ]);
    if (userUpdate.email && !(await verifyUniqueEmail(userUpdate.email)))
      throw { status: 422, response: { errorCode: APIError.EmailInUse } };

    Object.assign(user, userUpdate);

    await UserData.update(user);
    return { users: [toPublicUser(user)], currentUser: toCurrentUser(user) };
  });

  addPostHandler(app, "/users/:id/changePassword", async req => {
    const user = await getById(req.params.id, UserData.user);

    // Validate Request
    if (req.body.resetKey) {
      const userForKey = await UserData.userByPasswordResetKey(
        req.body.resetKey
      );
      if (!userForKey || !userForKey._id.equals(user._id))
        throw { status: 401 };
    } else {
      await currentUserStrict(req, [user._id]);
      if (
        !checkPassword(req.body.password, user.passwordHash, user.passwordSalt)
      )
        throw { status: 401, response: { errorCode: APIError.BadPassword } };
    }
    if (!validPassword(req.body.newPassword)) throw { status: 422 };

    // Change Password
    const { hash, salt } = createPassword(req.body.newPassword);
    await UserData.update({
      ...user,
      passwordHash: hash,
      passwordSalt: salt,
      passwordResetKey: undefined
    });

    return { success: true };
  });

  addGetHandler(app, "/users/passwordReset/:key", async req => {
    const user = await UserData.userByPasswordResetKey(req.params.key);
    if (!user) throw { status: 422 };

    return toPublicUser(user);
  });

  addPostHandler(app, "/users/resetPassword", async req => {
    const user = await UserData.userByEmail(req.body.email);
    if (!user)
      throw { status: 422, response: { errorCode: APIError.NoSuchEmail } };

    user.passwordResetKey = createHash();
    await UserData.update(user);
    await sendPasswordResetMail(
      user,
      user.locale || req.session!.locale || "en"
    );

    return { success: true };
  });
}

async function currentUserResponse(user: StoredUser) {
  const groups = await GroupData.groupsByUser(user._id);
  return {
    currentUser: toCurrentUser(user),
    groups: groups.map(toGroup),
    alphabetListings: (await AlphabetData.alphabetsByUser(user._id))
      .concat(await AlphabetData.alphabetsByGroup(groups.map(g => g._id)))
      .map(toAlphabet)
  };
}
