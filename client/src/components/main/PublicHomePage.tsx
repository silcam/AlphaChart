import React from "react";
import CreateAccountOrLogIn from "../users/CreateAccountOrLogIn";
import AlphabetsList from "../alphabets/AlphabetsList";
import { AlphabetListing } from "../../models/Alphabet";
import { useTranslation } from "../common/useTranslation";

interface IProps {
  alphabets: AlphabetListing[] | null;
}

export default function PublicHomePage(props: IProps) {
  const t = useTranslation();
  const alphabets = props.alphabets;

  return (
    <div className="flex-row compPublicHomePage">
      <div>
        <CreateAccountOrLogIn />
      </div>
      <div>
        <h2>{t("Alphabet_charts")}</h2>
        <AlphabetsList alphabets={alphabets} />
      </div>
    </div>
  );
}
