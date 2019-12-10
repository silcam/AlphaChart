import React, { useState } from "react";
import ChartEditor from "./ChartEditor";
import { Alphabet, AlphabetChart } from "../../models/Alphabet";
import update from "immutability-helper";
import useRefireBuffer from "../common/useRefireBuffer";
import { usePush } from "../../api/apiRequest";
import { pushChart } from "./alphabetSlice";

interface IProps {
  id: string;
  alphabet: Alphabet;
  setEditing: (e: boolean) => void;
}

export default function EditChartPage(props: IProps) {
  const withRefireBuffer = useRefireBuffer();
  const [alphabet, setAlphabet] = useState(props.alphabet);

  const [saveChart, saving] = usePush(pushChart);

  const save = async (chart: AlphabetChart) => {
    const newAlphabet = update(alphabet, { chart: { $set: chart } });
    setAlphabet(newAlphabet);
    withRefireBuffer(() => saveChart(newAlphabet));
  };

  return (
    <ChartEditor
      alphabet={alphabet}
      save={save}
      saving={saving}
      setEditing={props.setEditing}
    />
  );
}
