import React, { useState } from "react";
import { blankAlphabet, DraftAlphabet } from "../../models/Alphabet";
import { History } from "history";
import keyHandler from "../common/KeyHandler";
import useNetwork from "../common/useNetwork";

interface IProps {
  history: History;
}

export default function NewAlphabetPage(props: IProps) {
  const [name, setName] = useState("");
  const formIsValid = name.length > 0;
  const [loading, request] = useNetwork();

  const save = async () => {
    if (formIsValid) {
      const alphabet: DraftAlphabet = {
        ...blankAlphabet(name)
      };
      const response = await request(axios =>
        axios.post("/api/alphabets", alphabet)
      );
      if (response) {
        const id = response.data._id;
        props.history.push(`/alphabets/edit/${id}/chart`);
      }
    }
  };

  return (
    <div>
      <h2>New Alphabet</h2>
      <label>Language:</label>
      <div style={{ margin: "20px 0" }}>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyPress={keyHandler({ Enter: save })}
          autoFocus
        />
      </div>
      <button onClick={() => save()} disabled={!formIsValid || loading}>
        {loading ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
