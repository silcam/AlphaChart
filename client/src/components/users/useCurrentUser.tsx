import { CurrentUser, LoginAttempt, NewUser } from "../../models/User";
import { useState, useEffect, useContext } from "react";
import Axios from "axios";
import ErrorContext from "../common/ErrorContext";

type LoginError = "Invalid" | "Unknown";
export type LogInFunc = (
  loginAttempt: LoginAttempt,
  handleError: (e: LoginError) => void
) => void;
export type LogOutFunc = (handleError: () => void) => Promise<void>;
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

  const { setErrorMessage } = useContext(ErrorContext);

  useEffect(() => {
    try {
      getCurrentUser(setCurrentUser);
    } catch (err) {
      setErrorMessage("Trouble loading user info...");
    }
  }, []);

  const logIn = async (
    loginAttempt: LoginAttempt,
    handleError: (e: LoginError) => void
  ) => {
    try {
      const response = await Axios.post("/api/users/login", loginAttempt);
      setCurrentUser(response.data);
    } catch (err) {
      if (err.response && err.response.status === 401) handleError("Invalid");
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
      if (err.response && err.response.status === 422)
        handleError(err.response.data.error);
      else handleError("Unknown error");
    }
  };

  return [currentUser, logIn, logOut, createAccount];
}

async function getCurrentUser(setCurrentUser: (u: CurrentUser | null) => void) {
  const response = await Axios.get("/api/users/current");
  setCurrentUser(response.data);
}
