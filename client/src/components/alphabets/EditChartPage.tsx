import React from "react";
import ChartEditor from "./ChartEditor";
import { Alphabet, AlphabetChart } from "../../models/Alphabet";
import useNetwork from "../common/useNetwork";
import { apiPath } from "../../models/Api";
import update from "immutability-helper";
import useRefireBuffer from "../common/useRefireBuffer";

interface IProps {
  id: string;
  alphabet: Alphabet;
  setAlphabet: (a: Alphabet) => void;
  setEditing: (e: boolean) => void;
}

export default function EditChartPage(props: IProps) {
  const [saving, request] = useNetwork();
  const withRefireBuffer = useRefireBuffer();

  const save = async (chart: AlphabetChart) => {
    props.setAlphabet(update(props.alphabet, { chart: { $set: chart } }));
    withRefireBuffer(() =>
      request(axios =>
        axios.post(apiPath(`/alphabets/${props.id}/charts`), chart)
      )
    );
  };

  return (
    <ChartEditor
      alphabet={props.alphabet}
      save={save}
      saving={saving}
      setEditing={props.setEditing}
    />
  );
}
