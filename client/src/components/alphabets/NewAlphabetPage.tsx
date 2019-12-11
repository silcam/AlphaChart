import React, { useState } from "react";
import { blankAlphabet, DraftAlphabet } from "../../models/Alphabet";
import { History } from "history";
import keyHandler from "../common/KeyHandler";
import { usePush } from "../../api/apiRequest";
import { pushDraftAlphabet } from "./alphabetSlice";

interface IProps {
  history: History;
}

export default function NewAlphabetPage(props: IProps) {
  const [name, setName] = useState("");
  const formIsValid = name.length > 0;
  const [saveAlphabet, loading] = usePush(pushDraftAlphabet);

  const save = async () => {
    if (formIsValid) {
      const draft: DraftAlphabet = {
        ...blankAlphabet(name)
      };
      const alphabet = await saveAlphabet(draft);
      if (alphabet) {
        const id = alphabet.id;
        props.history.push(`/alphabets/view/${id}`, { edit: true });
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
