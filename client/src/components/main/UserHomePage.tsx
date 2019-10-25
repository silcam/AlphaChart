import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Alphabet } from "../../models/Alphabet";
import AlphabetsList from "../alphabets/AlphabetsList";
import { LogOutFunc } from "../users/useCurrentUser";
import { CurrentUser } from "../../models/User";
import useNetwork from "../common/useNetwork";
import { useTranslation } from "../common/I18nContext";

interface IProps {
  logOut: LogOutFunc;
  currentUser: CurrentUser;
}

export default function UserHomePage(props: IProps) {
  const t = useTranslation();
  const [alphabets, setAlphabets] = useState<Alphabet[] | null>(null);
  const [loading, request] = useNetwork();

  useEffect(() => {
    request(axios => axios.get("/api/alphabets"))
      .then(response => response && setAlphabets(response.data))
      .catch(err => console.error(err));
  }, []);

  const myAlphabets =
    alphabets && alphabets.filter(a => a.user === props.currentUser.email);
  const otherAlphabets =
    alphabets && alphabets.filter(a => a.user !== props.currentUser.email);

  return (
    <div className="HomePage">
      <div>
        <Link to={`/alphabets/new`}>
          <button>{t("New_alphabet_chart")}</button>
        </Link>
      </div>
      <div className="flex-row">
        <div>
          <h2>{t("My_alphabets")}</h2>
          <AlphabetsList alphabets={myAlphabets} />
        </div>
        <div>
          <h2>{t("Other_alphabets")}</h2>
          <AlphabetsList alphabets={otherAlphabets} />
        </div>
      </div>
    </div>
  );
}
