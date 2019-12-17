import React from "react";
import { Link } from "react-router-dom";
import { AlphabetListing } from "../../models/Alphabet";
import AlphabetsList from "../alphabets/AlphabetsList";
import { useTranslation } from "../common/useTranslation";
import { useSelector } from "react-redux";
import { AppState } from "../../state/appState";
import { CurrentUser } from "../../models/User";
import useCanEdit from "../alphabets/useCanEdit";

interface IProps {
  user: CurrentUser;
}

export default function UserHomePage(props: IProps) {
  const t = useTranslation();
  const alphabets = useSelector((state: AppState) => state.alphabets.listings);
  const canEdit = useCanEdit();

  const myAlphabets: AlphabetListing[] = [];
  const otherAlphabets: AlphabetListing[] = [];
  alphabets.forEach(alphabet =>
    canEdit(alphabet)
      ? myAlphabets.push(alphabet)
      : otherAlphabets.push(alphabet)
  );

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
