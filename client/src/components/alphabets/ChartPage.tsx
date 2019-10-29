import React, { useState, useEffect } from "react";
import { CurrentUserOrNot } from "../../models/User";
import { Alphabet } from "../../models/Alphabet";
import EditChartPage from "./EditChartPage";
import ViewChartPage from "./ViewChartPage";
import useNetwork from "../common/useNetwork";
import { apiPath } from "../../models/Api";
import Loading from "../common/Loading";
import { useLocation } from "react-router-dom";

interface IProps {
  id: string;
  user: CurrentUserOrNot;
}

export default function ChartPage(props: IProps) {
  const location = useLocation();
  const [editing, setEditing] = useState(location.state && location.state.edit);
  const [alphabet, setAlphabet] = useState<Alphabet | null>(null);
  const [loading, request] = useNetwork();

  useEffect(() => {
    request(axios => axios.get(apiPath(`/alphabets/${props.id}`)))
      .then(response => response && setAlphabet(response.data))
      .catch(err => console.error(err));
  }, [props.id]);

  if (loading) return <Loading />;
  if (alphabet)
    return editing ? (
      <EditChartPage
        {...props}
        alphabet={alphabet}
        setAlphabet={setAlphabet}
        setEditing={setEditing}
      />
    ) : (
      <ViewChartPage {...props} alphabet={alphabet} setEditing={setEditing} />
    );
  return null;
}
