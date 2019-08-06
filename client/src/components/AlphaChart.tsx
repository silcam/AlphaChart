import React, { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import LetterEntry from "./LetterEntry";
import { Alphabet, demoAlphabet } from "../alphabet/Alphabet";
import { List, fromJS } from "immutable";
import ChartEditor from "./ChartEditor";
import Axios from "axios";

const LANG_NAME = "Ελληνικα";
// const ALPHABET = List();
const ALPHABET: Alphabet = demoAlphabet();

export default function AlphaChart() {
  const [langName, setLangName] = useState(LANG_NAME);
  const [alphabet, setAlphabet] = useState<Alphabet>(ALPHABET);
  const setFromLetterEntry = (newLangName: string, newAlphabet: Alphabet) => {
    setLangName(newLangName);
    setAlphabet(newAlphabet);
  };

  const [hw, setHw] = useState("");
  useEffect(() => {
    Axios.get("/api/hw").then(response => {
      setHw(response.data.message);
    });
  }, []);

  return (
    <div>
      <p>{hw}</p>
      <Switch>
        <Route
          path="/chart"
          render={() => <ChartEditor langName={langName} alphabet={alphabet} />}
        />
        <Route
          render={({ history }) => (
            <LetterEntry
              langName={langName}
              alphabet={alphabet}
              setFromLetterEntry={setFromLetterEntry}
              history={history}
            />
          )}
        />
      </Switch>
    </div>
  );
}
