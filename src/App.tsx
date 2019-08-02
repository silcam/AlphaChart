import React from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import AlphaChart from "./components/AlphaChart";

export default function App() {
  return (
    <BrowserRouter>
      <AlphaChart />
    </BrowserRouter>
  );
}
