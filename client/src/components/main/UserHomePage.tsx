import React from "react";
import { Link } from "react-router-dom";
import { AlphabetListing } from "../../models/Alphabet";
import AlphabetsList from "../alphabets/AlphabetsList";
import { useTranslation } from "../common/useTranslation";
import { useSelector } from "react-redux";
import { AppState } from "../../state/appState";

interface IProps {
  alphabets: AlphabetListing[] | null;
}

export default function UserHomePage(props: IProps) {
  const t = useTranslation();
  const alphabets = props.alphabets;
  const user = useSelector((state: AppState) => state.currentUser.user);
  if (!user) throw "Null user in UserHomePage";

  const myAlphabets = alphabets && alphabets.filter(a => a.user === user.email);
  const otherAlphabets =
    alphabets && alphabets.filter(a => a.user !== user.email);

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
