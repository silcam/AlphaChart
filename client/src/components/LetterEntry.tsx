import React, { useState } from "react";
import {
  blankAlphabetLetter,
  DraftAlphabet,
  validDraftAlphabet
} from "../alphabet/Alphabet";
import { History } from "history";
import NumberPicker from "./NumberPicker";
import { arrayResize } from "../util";
import update from "immutability-helper";

interface IProps {
  alphabet: DraftAlphabet;
  setAlphabet: (a: DraftAlphabet) => void;
  history: History;
}

export default function LetterEntry(props: IProps) {
  const chart = props.alphabet.chart;
  const [alphabetSize, setAlphabetSize] = useState(
    chart.letters.length > 0 ? chart.letters.length : 26
  );
  const [name, setName] = useState(props.alphabet.name);
  const [enteredLetters, setEnteredLetters] = useState(chart.letters);
  const alphabet = arrayResize(
    enteredLetters,
    alphabetSize,
    blankAlphabetLetter
  );

  const setLetter = (
    letterIndex: number,
    caseIndex: number,
    letter: string
  ) => {
    const newLetter = update(alphabet[letterIndex], {
      forms: { [caseIndex]: { $set: letter } }
    });
    setEnteredLetters(
      update(enteredLetters, {
        [letterIndex]: { $set: newLetter }
      })
    );
  };

  const draftAlphabet: DraftAlphabet = {
    name,
    chart: { ...chart, letters: alphabet }
  };
  const formValid = validDraftAlphabet(draftAlphabet);

  const saveAndQuit = () => {
    props.setAlphabet(draftAlphabet);
    props.history.push("/alphabets/new/chart");
  };

  return (
    <div
      id="page-root"
      className="LetterEntry"
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "600px"
      }}
    >
      <div style={{ paddingTop: "80px" }}>
        <div style={{ margin: "24px" }}>
          <label>Language:</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div style={{ margin: "24px" }}>
          <label>Letters:</label>
          <NumberPicker value={alphabetSize} setValue={setAlphabetSize} />
        </div>
        <div style={{ margin: "24px" }}>
          <button onClick={saveAndQuit} disabled={!formValid}>
            Save
          </button>
          {chart.letters.length > 0 && (
            <button onClick={props.history.goBack}>Cancel</button>
          )}
        </div>
      </div>

      <div style={{ overflowY: "auto", padding: "24px" }}>
        <table>
          <tbody>
            {alphabet.map((letters, letterIndex) => (
              <tr key={letterIndex}>
                {letters.forms.map((letter, caseIndex) => (
                  <td key={caseIndex}>
                    <input
                      type="text"
                      value={letter}
                      onChange={e =>
                        setLetter(letterIndex, caseIndex, e.target.value)
                      }
                      placeholder={
                        letterIndex === 0 ? (caseIndex === 0 ? "A" : "a") : ""
                      }
                      size={2}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
