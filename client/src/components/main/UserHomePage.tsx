import React from "react";
import { Link } from "react-router-dom";
import { AlphabetListingInflated } from "../../models/Alphabet";
import AlphabetsList from "../alphabets/AlphabetsList";
import { useTranslation } from "../common/useTranslation";
import { CurrentUser } from "../../models/User";
import useCanEdit from "../alphabets/useCanEdit";
import {
  useAlphabetListings,
  useFeaturedAlphabetListings
} from "../alphabets/useAlphabets";
import { useLoad } from "../../api/apiRequest";
import { loadMyAlphabetListings } from "../alphabets/alphabetSlice";
import { useAppSelector } from "../../state/appState";

interface IProps {
  user: CurrentUser;
}

export default function UserHomePage(props: IProps) {
  const t = useTranslation();
  const canEdit = useCanEdit();
  const myAlphabets = useAlphabetListings(alphabet => canEdit(alphabet));
  const otherAlphabets = useFeaturedAlphabetListings();

  useLoad(loadMyAlphabetListings());

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
          <AlphabetsList alphabets={otherAlphabets} moreLink />
        </div>
      </div>
    </div>
  );
}
