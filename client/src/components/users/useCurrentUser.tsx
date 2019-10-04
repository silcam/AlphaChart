import { CurrentUser, LoginAttempt, NewUser } from "../../models/User";
import { useState, useEffect } from "react";
import Axios from "axios";

type LoginError = "Invalid" | "Unknown";
export type LogInFunc = (
  loginAttempt: LoginAttempt,
  handleError: (e: LoginError) => void
) => void;
export type LogOutFunc = (handleError: () => void) => void;
export type CreateAccountFunc = (
  newUser: NewUser,
  handleError: (msg: string) => void
) => void;

export default function useCurrentUser(): [
  CurrentUser | null,
  LogInFunc,
  LogOutFunc,
  CreateAccountFunc
] {
  const [currentUser, setCurrentUser] = useState<null | CurrentUser>(null);

  useEffect(() => {
    getCurrentUser(setCurrentUser);
  }, []);

  const logIn = async (
    loginAttempt: LoginAttempt,
    handleError: (e: LoginError) => void
  ) => {
    try {
      const response = await Axios.post("/api/users/login", loginAttempt);
      setCurrentUser(response.data);
    } catch (err) {
      if (err.response && err.response.status == 401) handleError("Invalid");
      else handleError("Unknown");
    }
  };

  const logOut = async (handleError: () => void) => {
    try {
      await Axios.post("/api/users/logout");
      setCurrentUser(null);
    } catch (err) {
      handleError();
    }
  };

  const createAccount = async (
    newUser: NewUser,
    handleError: (msg: string) => void
  ) => {
    try {
      const response = await Axios.post("/api/users", newUser);
      setCurrentUser(response.data);
    } catch (err) {
      if (err.response && err.response.status == 422)
        handleError(err.response.data.error);
      else handleError("Unknown error");
    }
  };

  return [currentUser, logIn, logOut, createAccount];
}

async function getCurrentUser(setCurrentUser: (u: CurrentUser | null) => void) {
  try {
    const response = await Axios.get("/api/users/current");
    setCurrentUser(response.data);
  } catch (err) {
    console.error(err);
  }
}
