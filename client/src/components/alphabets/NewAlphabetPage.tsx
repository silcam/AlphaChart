import React, { useState } from "react";
import { blankAlphabet, DraftAlphabet } from "../../models/Alphabet";
import Axios from "axios";
import { History } from "history";
import KeyHandler from "../common/KeyHandler";

interface IProps {
  history: History;
}

export default function NewAlphabetPage(props: IProps) {
  const [name, setName] = useState("");
  const formIsValid = name.length > 0;

  const save = async () => {
    if (formIsValid) {
      const alphabet: DraftAlphabet = {
        ...blankAlphabet(),
        name
      };
      const response = await Axios.post("/api/alphabets", alphabet);
      const id = response.data._id;
      props.history.push(`/alphabets/edit/${id}/chart`);
    }
  };

  return (
    <KeyHandler onEnter={save}>
      <h2>New Alphabet</h2>
      <label>Language:</label>
      <div style={{ margin: "20px 0" }}>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>
      <button onClick={() => save()} disabled={!formIsValid}>
        Save
      </button>
    </KeyHandler>
  );
}
