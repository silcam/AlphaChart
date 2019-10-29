import { Express, Response } from "express";
import {
  NewUser,
  validationErrors,
  toCurrentUser,
  LoginAttempt
} from "../../../client/src/models/User";
import UserData from "../storage/UserData";
import { checkPassword } from "../common/password";
import { currentUser } from "./controllerHelper";
import log from "../common/log";
import { apiPath } from "../../../client/src/models/Api";

export default function usersController(app: Express) {
  app.post(apiPath("/users"), async (req, res) => {
    const newUser: NewUser = req.body;
    try {
      const errors = validationErrors(newUser);
      if (errors) res.status(422).json({ error: errors.join(" ") });
      else {
        const user = await UserData.createUser(newUser);
        req.session!.email = newUser.email;
        res.json(toCurrentUser(user));
      }
    } catch (err) {
      log.error(JSON.stringify(err));
      if (err.errmsg.includes("duplicate key")) {
        res
          .status(422)
          .json({ error: `A user already exists for ${newUser.email}` });
      } else {
        fiveHundred(res);
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
      fiveHundred(res);
    }
  });

  app.post(apiPath("/users/login"), async (req, res) => {
    try {
      const loginAttempt: LoginAttempt = req.body;
      const user = await UserData.user(loginAttempt.email);
      if (
        user &&
        checkPassword(
          loginAttempt.password,
          user.passwordHash,
          user.passwordSalt
        )
      ) {
        req.session!.email = user.email;
        res.json(toCurrentUser(user));
      } else {
        res.status(401).json({ error: "Invalid login" });
      }
    } catch (err) {
      fiveHundred(res);
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
      fiveHundred(res);
    }
  });

  app.post(apiPath("/users/logout"), (req, res) => {
    req.session!.email = undefined;
    res.status(204).send();
  });
}

function fiveHundred(res: Response) {
  res.status(500).json({ error: "Unknown" });
}
