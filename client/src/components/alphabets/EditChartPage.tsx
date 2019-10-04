import React, { useState, useEffect } from "react";
import ChartEditor from "./ChartEditor";
import { Alphabet, AlphabetChart } from "../../models/Alphabet";
import Axios from "axios";
import Loading from "../common/Loading";
import { History } from "history";

interface IProps {
  id: string;
  history: History;
}

export default function EditChartPage(props: IProps) {
  const [alphabet, setAlphabet] = useState<Alphabet | null>(null);
  useEffect(() => {
    Axios.get(`/api/alphabets/${props.id}`).then(response =>
      setAlphabet(response.data)
    );
  }, [props.id]);

  const save = async (chart: AlphabetChart) => {
    await Axios.post(`/api/alphabets/${props.id}/charts`, chart);
    props.history.push(`/alphabets/view/${props.id}`);
  };

  return alphabet === null ? (
    <Loading />
  ) : (
    <ChartEditor alphabet={alphabet} save={save} />
  );
}
