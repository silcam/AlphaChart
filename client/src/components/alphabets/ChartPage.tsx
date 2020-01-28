import React, { useState } from "react";
import EditChartPage from "./EditChartPage";
import ViewChartPage from "./ViewChartPage";
import { useLocation } from "react-router-dom";
import { useLoad } from "../../api/apiRequest";
import { loadAlphabet } from "./alphabetSlice";
import { useAlphabet } from "./useAlphabets";
import EditAlphabet from "./EditAlphabet";

interface IProps {
  id: string;
}

export default function ChartPage(props: IProps) {
  const location = useLocation();
  const [editing, setEditing] = useState(location.state && location.state.edit);
  const [editingAlphabet, setEditingAlphabet] = useState(false);

  const alphabet = useAlphabet(props.id);
  useLoad(loadAlphabet(props.id));

  if (!alphabet) return null;

  return editingAlphabet ? (
    <EditAlphabet alphabet={alphabet} done={() => setEditingAlphabet(false)} />
  ) : editing ? (
    <EditChartPage {...props} alphabet={alphabet} setEditing={setEditing} />
  ) : (
    <ViewChartPage
      {...props}
      alphabet={alphabet}
      setEditing={setEditing}
      editAlphabet={() => setEditingAlphabet(true)}
    />
  );
}
