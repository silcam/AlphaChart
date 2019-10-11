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

export default function usersController(app: Express) {
  app.post("/api/users", async (req, res) => {
    const newUser: NewUser = req.body;
    try {
      const errors = validationErrors(newUser);
      if (errors) res.status(422).json({ error: errors.join(" ") });
      else {
        const user = await UserData.createUser(newUser);
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

  app.get("/api/users/current", async (req, res) => {
    try {
      const user = await currentUser(req);
      if (user) {
        res.json(toCurrentUser(user));
      } else {
        req.session!.email = undefined;
        res.json(null);
      }
    } catch (err) {
      fiveHundred(res);
    }
  });

  app.post("/api/users/login", async (req, res) => {
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

  app.post("/api/users/logout", (req, res) => {
    req.session!.email = undefined;
    res.status(204).send();
  });
}

function fiveHundred(res: Response) {
  res.status(500).json({ error: "Unknown" });
}