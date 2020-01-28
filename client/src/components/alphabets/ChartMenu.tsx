import React from "react";
import { Alphabet } from "../../models/Alphabet";
import DropDownMenu from "../common/DropDownMenu";
import { useTranslation } from "../common/useTranslation";
import { usePush } from "../../api/apiRequest";
import { pushArchiveChart } from "./alphabetSlice";
import { useHistory } from "react-router-dom";

interface IProps {
  alphabet: Alphabet;
  editAlphabet: () => void;
}

export default function ChartMenu(props: IProps) {
  const t = useTranslation();
  const history = useHistory();

  const [sendArchive] = usePush(pushArchiveChart);
  const archiveChart = async () => {
    if (
      window.confirm(t("Confirm_archive_chart", { name: props.alphabet.name }))
    ) {
      const success = await sendArchive(props.alphabet.id);
      if (success) history.push("/");
    }
  };

  return (
    <DropDownMenu
      items={[
        [t("Change_name"), props.editAlphabet],
        [t("Archive"), archiveChart]
      ]}
    />
  );
}
