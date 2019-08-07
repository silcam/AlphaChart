import React, { useState } from "react";
import { Switch, Route } from "react-router-dom";
import ChartEditor from "./ChartEditor";
import LetterEntry from "./LetterEntry";
import { blankAlphabet, DraftAlphabet } from "../alphabet/Alphabet";
import Axios from "axios";
import { History } from "history";

interface IProps {
  history: History;
}

export default function NewAlphabetChart(props: IProps) {
  const [alphabet, setAlphabet] = useState(blankAlphabet());

  const save = async (alphabet: DraftAlphabet) => {
    setAlphabet(alphabet);
    await postAlphabet(alphabet);
  };

  const saveAndDone = async (alphabet: DraftAlphabet) => {
    await save(alphabet);
    props.history.push("/");
  };

  return (
    <Switch>
      <Route
        path="/alphabets/new/chart"
        render={() => (
          <ChartEditor alphabet={alphabet} setAlphabetAndDone={saveAndDone} />
        )}
      />
      <Route
        path="/alphabets/new"
        render={({ history }) => (
          <LetterEntry
            alphabet={alphabet}
            setAlphabet={save}
            history={history}
          />
        )}
      />
    </Switch>
  );
}

async function postAlphabet(alphabet: DraftAlphabet) {
  await Axios.post("/api/alphabets/new", alphabet);
}
