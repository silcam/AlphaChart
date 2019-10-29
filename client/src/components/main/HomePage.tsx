import React, { useState, useEffect } from "react";
import { CurrentUser } from "../../models/User";
import UserHomePage from "./UserHomePage";
import PublicHomePage from "./PublicHomePage";
import {
  LogInFunc,
  LogOutFunc,
  CreateAccountFunc
} from "../users/useCurrentUser";
import { AlphabetListing } from "../../models/Alphabet";
import useNetwork from "../common/useNetwork";
import { apiPath } from "../../models/Api";

interface IProps {
  currentUser: CurrentUser | null;
  logIn: LogInFunc;
  logOut: LogOutFunc;
  createAccount: CreateAccountFunc;
}

export default function HomePage(props: IProps) {
  const [alphabets, setAlphabets] = useState<AlphabetListing[] | null>(null);
  const [, request] = useNetwork();

  useEffect(() => {
    request(axios => axios.get(apiPath("/alphabets")))
      .then(response => response && setAlphabets(response.data))
      .catch(err => console.error(err));
  }, []);

  return props.currentUser ? (
    <UserHomePage
      logOut={props.logOut}
      currentUser={props.currentUser}
      alphabets={alphabets}
    />
  ) : (
    <PublicHomePage
      logIn={props.logIn}
      createAccount={props.createAccount}
      alphabets={alphabets}
    />
  );
}
