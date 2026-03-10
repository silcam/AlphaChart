import React from "react";
import { Routes, Route, useParams } from "react-router-dom";
import NewAlphabetPage from "./NewAlphabetPage";
import ChartPage from "./ChartPage";
import AlphabetsBrowserPage from "./AlphabetsBrowserPage";

function ChartPageRoute() {
  const { id } = useParams<{ id: string }>();
  return <ChartPage key={id} id={id!} />;
}

export default function AlphabetsRoute() {
  return (
    <Routes>
      <Route path="new" element={<NewAlphabetPage />} />
      <Route path="view/:id" element={<ChartPageRoute />} />
      <Route path="*" element={<AlphabetsBrowserPage />} />
    </Routes>
  );
}
