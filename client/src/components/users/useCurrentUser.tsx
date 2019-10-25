import { CurrentUser, LoginAttempt, NewUser } from "../../models/User";
import { useState, useEffect, useContext } from "react";
import ErrorContext from "../common/ErrorContext";
import useNetwork from "../common/useNetwork";
import { useTranslation } from "../common/I18nContext";
import { TKey } from "../../locales/en";

type LoginError = "Invalid" | "Unknown";
export type LogInFunc = (
  loginAttempt: LoginAttempt,
  handleError: (e: LoginError) => void
) => void;
export type LogOutFunc = () => Promise<void>;
export type CreateAccountFunc = (
  newUser: NewUser,
  handleError: (msg: TKey) => void
) => void;

export default function useCurrentUser(): [
  CurrentUser | null,
  LogInFunc,
  LogOutFunc,
  CreateAccountFunc
] {
  const t = useTranslation();
  const [currentUser, setCurrentUser] = useState<null | CurrentUser>(null);
  const [, request] = useNetwork();
  const [, requestThrowsErrorResponses] = useNetwork({
    throwErrorsWithResponse: true
  });

  const { setErrorMessage } = useContext(ErrorContext);

  const getCurrentUser = async (
    setCurrentUser: (u: CurrentUser | null) => void
  ) => {
    const response = await request(axios => axios.get("/api/users/current"));
    response && setCurrentUser(response.data);
  };

  useEffect(() => {
    try {
      getCurrentUser(setCurrentUser);
    } catch (err) {
      setErrorMessage(t("Trouble_loading_user_info"));
    }
  }, []);

  const logIn = async (
    loginAttempt: LoginAttempt,
    handleError: (e: LoginError) => void
  ) => {
    try {
      const response = await requestThrowsErrorResponses(axios =>
        axios.post("/api/users/login", loginAttempt)
      );
      response && setCurrentUser(response.data);
    } catch (err) {
      if (err.response && err.response.status === 401) handleError("Invalid");
      else handleError("Unknown");
    }
  };

  const logOut = async () => {
    const response = await request(axios => axios.post("/api/users/logout"));
    if (response) setCurrentUser(null);
  };

  const createAccount = async (
    newUser: NewUser,
    handleError: (msg: TKey) => void
  ) => {
    try {
      const response = await requestThrowsErrorResponses(axios =>
        axios.post("/api/users", newUser)
      );
      response && setCurrentUser(response.data);
    } catch (err) {
      if (err.response && err.response.status === 422)
        handleError(err.response.data.error);
      else handleError("Unknown_error");
    }
  };

  return [currentUser, logIn, logOut, createAccount];
}
