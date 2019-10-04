import { Express, Response } from "express";
import {
  NewUser,
  validationErrors,
  currentUser,
  LoginAttempt
} from "../../client/src/alphabet/User";
import Data from "./Data";
import { checkPassword } from "./password";

export default function usersController(app: Express) {
  app.post("/api/users", async (req, res) => {
    const newUser: NewUser = req.body;
    try {
      const errors = validationErrors(newUser);
      if (errors) res.status(422).json({ error: errors.join(" ") });
      else {
        const user = await Data.createUser(newUser);
        res.json(currentUser(user));
      }
    } catch (err) {
      console.error(JSON.stringify(err));
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
      const currentUserEmail = req.session!.email;
      if (currentUserEmail) {
        const user = await Data.user(currentUserEmail);
        if (user) {
          res.json(currentUser(user));
          return;
        } else {
          req.session!.email = undefined;
        }
      }
      res.json(null);
    } catch (err) {
      fiveHundred(res);
    }
  });

  app.post("/api/users/login", async (req, res) => {
    try {
      const loginAttempt: LoginAttempt = req.body;
      const user = await Data.user(loginAttempt.email);
      if (
        user &&
        checkPassword(
          loginAttempt.password,
          user.passwordHash,
          user.passwordSalt
        )
      ) {
        req.session!.email = user.email;
        res.json(currentUser(user));
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
