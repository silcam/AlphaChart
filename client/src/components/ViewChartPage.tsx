import React, { useState, useEffect } from "react";
import { Alphabet } from "../alphabet/Alphabet";
import Axios from "axios";
import Chart from "./Chart";
import Loading from "./Loading";
import { Link } from "react-router-dom";

interface IProps {
  id: string;
}

export default function ViewChartPage(props: IProps) {
  const [alphabet, setAlphabet] = useState<Alphabet | null>(null);
  useEffect(() => {
    Axios.get(`/api/alphabets/${props.id}`).then(response =>
      setAlphabet(response.data)
    );
  }, [props.id]);
  return (
    <div id="page-root">
      <div>
        <Link to={`/`}>Home</Link>
      </div>
      <div>
        <Link to={`/alphabets/edit/${props.id}/chart`}>Edit</Link>
      </div>
      <p />
      {alphabet === null ? (
        <Loading />
      ) : (
        <Chart
          alphabet={alphabet}
          chart={alphabet.charts[0]}
          updateLetter={() => {}}
        />
      )}
    </div>
  );
}
