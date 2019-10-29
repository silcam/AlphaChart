import React from "react";
import { LogInFunc, CreateAccountFunc } from "../users/useCurrentUser";
import CreateAccountOrLogIn from "../users/CreateAccountOrLogIn";
import AlphabetsList from "../alphabets/AlphabetsList";
import { AlphabetListing } from "../../models/Alphabet";
import { useTranslation } from "../common/I18nContext";

interface IProps {
  logIn: LogInFunc;
  createAccount: CreateAccountFunc;
  alphabets: AlphabetListing[] | null;
}

export default function PublicHomePage(props: IProps) {
  const t = useTranslation();
  const alphabets = props.alphabets;

  return (
    <div className="flex-row compPublicHomePage">
      <div>
        <CreateAccountOrLogIn
          logIn={props.logIn}
          createAccount={props.createAccount}
        />
      </div>
      <div>
        <h2>{t("Alphabet_charts")}</h2>
        <AlphabetsList alphabets={alphabets} />
      </div>
    </div>
  );
}
