import React, { useState } from "react";
import EditChartPage from "./EditChartPage";
import ViewChartPage from "./ViewChartPage";
import { useLocation } from "react-router-dom";
import { useLoad } from "../../api/apiRequest";
import { loadAlphabet } from "./alphabetSlice";
import { useSelector } from "react-redux";
import { AppState } from "../../state/appState";

interface IProps {
  id: string;
}

export default function ChartPage(props: IProps) {
  const location = useLocation();
  const [editing, setEditing] = useState(location.state && location.state.edit);

  const alphabet = useSelector(
    (state: AppState) => state.alphabets.alphabets[props.id]
  );
  useLoad(loadAlphabet(props.id));

  if (alphabet)
    return editing ? (
      <EditChartPage {...props} alphabet={alphabet} setEditing={setEditing} />
    ) : (
      <ViewChartPage {...props} alphabet={alphabet} setEditing={setEditing} />
    );
  return null;
}
