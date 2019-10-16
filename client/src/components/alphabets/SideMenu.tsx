import React from "react";
import { AlphabetLetter } from "../../models/Alphabet";
import update from "immutability-helper";
import LnkBtn from "../common/LnkBtn";

interface IProps {
  letter: AlphabetLetter;
  close: () => void;
  setLetter: (letter: AlphabetLetter) => void;
  deleteLetter: () => void;
  insertBefore: () => void;
  insertAfter: () => void;
}

export default function SideMenu(props: IProps) {
  const draftForms = [...props.letter.forms, ""];

  const setForm = (index: number, form: string) =>
    props.setLetter(
      update(props.letter, { forms: { [index]: { $set: form } } })
    );

  const clearEmptyForms = () =>
    props.setLetter(
      update(props.letter, {
        forms: { $set: props.letter.forms.filter(f => f.length > 0) }
      })
    );

  return (
    <div className="side-menu">
      <div style={{ alignSelf: "flex-end" }}>
        <LnkBtn onClick={props.close} text="Close" />
      </div>
      <h1>{props.letter.forms.join("")}</h1>
      <ul style={{ marginBottom: "30px" }}>
        {draftForms.map((form, index) => (
          <li key={index}>
            <input
              type="text"
              value={form}
              onChange={e => setForm(index, e.target.value)}
              onBlur={clearEmptyForms}
              placeholder="Add form"
              size={8}
              autoFocus={index === 0}
            />
          </li>
        ))}
      </ul>
      <button onClick={props.insertBefore}>
        New letter before <b>{props.letter.forms[0]}</b>
      </button>
      <button onClick={props.insertAfter}>
        New letter after <b>{props.letter.forms[0]}</b>
      </button>
      <button className="red" onClick={props.deleteLetter}>
        Delete <b>{props.letter.forms[0]}</b>
      </button>
    </div>
  );
}
