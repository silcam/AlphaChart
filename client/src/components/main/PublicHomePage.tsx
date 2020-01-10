import React from "react";
import CreateAccountOrLogIn from "../users/CreateAccountOrLogIn";
import AlphabetsList from "../alphabets/AlphabetsList";
import { useTranslation } from "../common/useTranslation";
import { useAlphabetListings } from "../alphabets/useAlphabets";

export default function PublicHomePage() {
  const t = useTranslation();
  const alphabets = useAlphabetListings();

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
