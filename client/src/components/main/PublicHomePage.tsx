import React, { useState, useEffect } from "react";
import { LogInFunc, CreateAccountFunc } from "../users/useCurrentUser";
import CreateAccountOrLogIn from "../users/CreateAccountOrLogIn";
import AlphabetsList from "../alphabets/AlphabetsList";
import { AlphabetListing } from "../../models/Alphabet";
import useNetwork from "../common/useNetwork";
import { useTranslation } from "../common/I18nContext";
import { apiPath } from "../../models/Api";

interface IProps {
  logIn: LogInFunc;
  createAccount: CreateAccountFunc;
}

export default function PublicHomePage(props: IProps) {
  const t = useTranslation();
  const [alphabets, setAlphabets] = useState<AlphabetListing[] | null>(null);
  const [loading, request] = useNetwork();

  useEffect(() => {
    request(axios => axios.get(apiPath("/alphabets")))
      .then(response => {
        response && setAlphabets(response.data);
      })
      .catch(err => console.error(err));
  }, []);

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
