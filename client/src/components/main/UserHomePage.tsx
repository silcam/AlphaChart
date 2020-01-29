import React from "react";
import { Link } from "react-router-dom";
import { AlphabetListingInflated } from "../../models/Alphabet";
import AlphabetsList from "../alphabets/AlphabetsList";
import { useTranslation } from "../common/useTranslation";
import { CurrentUser } from "../../models/User";
import useCanEdit from "../alphabets/useCanEdit";
import { useAlphabetListings } from "../alphabets/useAlphabets";

interface IProps {
  user: CurrentUser;
}

export default function UserHomePage(props: IProps) {
  const t = useTranslation();
  const alphabets = useAlphabetListings();
  const canEdit = useCanEdit();

  const myAlphabets: AlphabetListingInflated[] = [];
  const otherAlphabets: AlphabetListingInflated[] = [];
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
          <AlphabetsList alphabets={myAlphabets} hideUser={props.user} />
        </div>
        <div>
          <h2>{t("Other_alphabets")}</h2>
          <AlphabetsList alphabets={otherAlphabets} />
        </div>
      </div>
    </div>
  );
}
