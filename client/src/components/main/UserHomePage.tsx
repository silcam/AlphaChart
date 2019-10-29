import React from "react";
import { Link } from "react-router-dom";
import { AlphabetListing } from "../../models/Alphabet";
import AlphabetsList from "../alphabets/AlphabetsList";
import { LogOutFunc } from "../users/useCurrentUser";
import { CurrentUser } from "../../models/User";
import { useTranslation } from "../common/I18nContext";

interface IProps {
  logOut: LogOutFunc;
  currentUser: CurrentUser;
  alphabets: AlphabetListing[] | null;
}

export default function UserHomePage(props: IProps) {
  const t = useTranslation();
  const alphabets = props.alphabets;

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
          <AlphabetsList alphabets={myAlphabets} hideUser />
        </div>
        <div>
          <h2>{t("Other_alphabets")}</h2>
          <AlphabetsList alphabets={otherAlphabets} />
        </div>
      </div>
    </div>
  );
}
