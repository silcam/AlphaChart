import React from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "../common/useTranslation";
import { usePush } from "../../api/apiRequest";
import { pushCopyAlphabet } from "./alphabetSlice";
import { useSelector } from "react-redux";
import { AppState } from "../../state/appState";

interface IProps {
  id: string;
}

export default function CopyAlphabetButton(props: IProps) {
  const t = useTranslation();
  const history = useHistory();
  const [copy, loading] = usePush(pushCopyAlphabet);
  const user = useSelector((state: AppState) => state.currentUser.user);

  const copyAlphabet = async () => {
    const newId = await copy({
      id: props.id,
      owner: user!.id,
      ownerType: "user"
    });
    if (newId) {
      history.push(`/alphabets/view/${newId}`);
    }
  };

  return (
    <button onClick={copyAlphabet} disabled={loading}>
      {loading ? t("Loading") : t("Copy_to_my_alphabets")}
    </button>
  );
}
