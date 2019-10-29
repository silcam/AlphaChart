import React from "react";
import { useHistory } from "react-router-dom";
import useNetwork from "../common/useNetwork";
import { useTranslation } from "../common/I18nContext";
import { apiPath } from "../../models/Api";

interface IProps {
  id: string;
}

export default function CopyAlphabetButton(props: IProps) {
  const t = useTranslation();
  const history = useHistory();
  const [loading, request] = useNetwork();

  const copyAlphabet = async () => {
    const response = await request(axios =>
      axios.post(apiPath(`/alphabets/${props.id}/copy`))
    );
    if (response) {
      history.push(`/alphabets/view/${response.data._id}`);
    }
  };

  return (
    <button onClick={copyAlphabet} disabled={loading}>
      {loading ? t("Loading") : t("Copy_to_my_alphabets")}
    </button>
  );
}
