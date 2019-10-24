import React, { useState, useEffect } from "react";
import ChartEditor from "./ChartEditor";
import { Alphabet, AlphabetChart } from "../../models/Alphabet";
import Loading from "../common/Loading";
import { History } from "history";
import useNetwork from "../common/useNetwork";

interface IProps {
  id: string;
  history: History;
}

export default function EditChartPage(props: IProps) {
  const [alphabet, setAlphabet] = useState<Alphabet | null>(null);
  const [, request] = useNetwork();
  useEffect(() => {
    request(axios => axios.get(`/api/alphabets/${props.id}`))
      .then(response => response && setAlphabet(response.data))
      .catch(err => console.error(err));
  }, [props.id]);

  const save = async (chart: AlphabetChart) => {
    await request(axios =>
      axios.post(`/api/alphabets/${props.id}/charts`, chart)
    );
    props.history.push(`/alphabets/view/${props.id}`);
  };

  return alphabet === null ? (
    <Loading />
  ) : (
    <ChartEditor alphabet={alphabet} save={save} />
  );
}
