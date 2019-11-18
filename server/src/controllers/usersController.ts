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

export default function usersController(app: Express) {
  app.post(apiPath("/users"), async (req, res) => {
    const newUser: NewUser = req.body;
    const locale: Locale = req.session!.locale || "en";
    try {
      const unverifiedUser = await newUnverifiedUser(newUser, locale);
      res.status(204).send();
    } catch (err) {
      const errType: NewUnverifiedUserErrorType = err.errType;
      if (errType === "AlreadyExists") {
        res
          .status(422)
          .json({ error: "User_exists", subs: { email: newUser.email } });
      } else if (errType === "Invalid") {
        res.status(422).json({ error: err.validationErrors.join(" ") });
      } else {
        fiveHundred(res, err);
      }
    }
  });

  app.post(apiPath("/users/verify"), async (req, res) => {
    const verification: string = req.body.verification;
    try {
      const user = await verifyUser(verification);
      res.json(toCurrentUser(user));
    } catch (err) {
      const errType: VerifyUserErrorType = err.errType;
      if (errType === "AlreadyExists") {
        res
          .status(422)
          .json({ error: "User_exists", subs: { email: err.user.email } });
      } else if (errType === "InvalidCode") {
        res.status(422).json({ error: "Invalid_code" });
      } else {
        fiveHundred(res, err);
      }
    }
  });

  app.get(apiPath("/users/current"), async (req, res) => {
    try {
      const user = await currentUser(req);
      if (user) {
        res.json(toCurrentUser(user));
      } else {
        req.session!.email = undefined;
        res.json({ locale: req.session!.locale });
      }
    } catch (err) {
      fiveHundred(res, err);
    }
  });

  app.post(apiPath("/users/login"), async (req, res) => {
    const loginAttempt: LoginAttempt = req.body;
    try {
      const user = await login(loginAttempt);
      req.session!.email = user.email;
      res.json(toCurrentUser(user));
    } catch (err) {
      const errType: LoginErrorType = err.errType;
      if (errType === "Invalid")
        res.status(401).json({ error: "Invalid_login" });
      else if (errType === "Unverified")
        res.status(401).json({ error: "Account_not_verified" });
      else fiveHundred(res, err);
    }
  });

  app.post(apiPath("/users/locale"), async (req, res) => {
    try {
      const locale = req.body.locale;
      if (locale) {
        req.session!.locale = locale;
        const user = await currentUser(req);
        if (user) {
          user.locale = locale;
          UserData.update(user);
        }
        res.status(204).send();
      }
    } catch (err) {
      fiveHundred(res, err);
    }
  });

  app.post(apiPath("/users/logout"), (req, res) => {
    req.session!.email = undefined;
    res.status(204).send();
  });
}

function fiveHundred(res: Response, err: any) {
  console.error(err);
  res.status(500).json({ error: "Unknown" });
}
