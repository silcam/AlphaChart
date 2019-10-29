import { CurrentUser, LoginAttempt, NewUser } from "../../models/User";
import { useState, useEffect, useContext } from "react";
import ErrorContext from "../common/ErrorContext";
import useNetwork from "../common/useNetwork";
import I18nContext, { useTranslation, Locale } from "../common/I18nContext";
import { TKey } from "../../locales/en";
import { apiPath } from "../../models/Api";

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
  const { setLocale } = useContext(I18nContext);
  const [, request] = useNetwork();
  const [, requestThrowsErrorResponses] = useNetwork({
    throwErrorsWithResponse: true
  });

  const { setError } = useContext(ErrorContext);

  const getCurrentUser = async (
    setCurrentUser: (u: CurrentUser | null) => void,
    setLocale: (loc: Locale) => void
  ) => {
    const response = await request(axios =>
      axios.get(apiPath("/users/current"))
    );
    if (response) {
      response.data.email
        ? setCurrentUser(response.data)
        : setCurrentUser(null);
      response.data.locale && setLocale(response.data.locale);
    }
  };

  useEffect(() => {
    try {
      getCurrentUser(setCurrentUser, setLocale);
    } catch (err) {
      setError({ msg: t("Trouble_loading_user_info") });
    }
  }, []);

  const logIn = async (
    loginAttempt: LoginAttempt,
    handleError: (e: LoginError) => void
  ) => {
    try {
      const response = await requestThrowsErrorResponses(axios =>
        axios.post(apiPath("/users/login"), loginAttempt)
      );
      response && setCurrentUser(response.data);
    } catch (err) {
      if (err.response && err.response.status === 401) handleError("Invalid");
      else handleError("Unknown");
    }
  };

  const logOut = async () => {
    const response = await request(axios =>
      axios.post(apiPath("/users/logout"))
    );
    if (response) setCurrentUser(null);
  };

  const createAccount = async (
    newUser: NewUser,
    handleError: (msg: TKey) => void
  ) => {
    try {
      const response = await requestThrowsErrorResponses(axios =>
        axios.post(apiPath("/users"), newUser)
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
