import React from "react";
import { BrowserRouter } from "react-router-dom";
import AlphaChart from "./components/AlphaChart";
import store from "./state/appState";
import { Provider } from "react-redux";

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AlphaChart />
      </BrowserRouter>
    </Provider>
  );
}
