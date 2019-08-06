import React, { useState } from "react";
import { Switch, Route } from "react-router-dom";
import LetterEntry from "./LetterEntry";
import { Alphabet, demoAlphabet } from "../alphabet/Alphabet";
import { List, fromJS } from "immutable";
import ChartEditor from "./ChartEditor";

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

  return (
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
  );
}
