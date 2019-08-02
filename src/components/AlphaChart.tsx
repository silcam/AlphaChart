import React, { useState } from "react";
import { Switch, Route } from "react-router-dom";
import LetterEntry from "./LetterEntry/LetterEntry";
import { Alphabet } from "../alphabet/Alphabet";
import { List } from "immutable";

export default function AlphaChart() {
  const [langName, setLangName] = useState("");
  const [alphabet, setAlphabet] = useState<Alphabet>(List());
  const setFromLetterEntry = (newLangName: string, newAlphabet: Alphabet) => {
    setLangName(newLangName);
    setAlphabet(newAlphabet);
  };

  return (
    <Switch>
      <Route
        render={({ history }) => (
          <LetterEntry
            setFromLetterEntry={setFromLetterEntry}
            history={history}
          />
        )}
      />
    </Switch>
  );
}
