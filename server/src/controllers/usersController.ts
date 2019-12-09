import { Express, Response } from "express";
import {
  NewUser,
  toCurrentUser,
  LoginAttempt
} from "../../../client/src/models/User";
import UserData from "../storage/UserData";
import { currentUser } from "./controllerHelper";
import { apiPath } from "../../../client/src/models/Api";
import newUnverifiedUser, {
  NewUnverifiedUserErrorType
} from "../actions/newUnverifiedUser";
import verifyUser, { VerifyUserErrorType } from "../actions/verifyUser";
import login, { LoginErrorType } from "../actions/login";
import { Locale } from "../../../client/src/i18n/i18n";
import { addGetHandler, addPostHandler } from "./serverApi";

export default function usersController(app: Express) {
  addPostHandler(app, "/users", async req => {
    const newUser: NewUser = req.body;
    const locale: Locale = req.session!.locale || "en";

    const unverifiedUser = await newUnverifiedUser(newUser, locale);
    return null;
  });

  addPostHandler(app, "/users/verify", async req => {
    const verification: string = req.body.verification;
    const user = await verifyUser(verification);
    return toCurrentUser(user);
  });

  addGetHandler(app, "/users/current", async req => {
    const user = await currentUser(req);
    if (user) {
      return toCurrentUser(user);
    } else {
      req.session!.email = undefined;
      return { locale: req.session!.locale };
    }
  });

  addPostHandler(app, "/users/login", async req => {
    const loginAttempt: LoginAttempt = req.body;
    const user = await login(loginAttempt);
    req.session!.email = user.email;
    return toCurrentUser(user);
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
    req.session!.email = undefined;
    return null;
  });
}
