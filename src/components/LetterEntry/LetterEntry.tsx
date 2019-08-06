import React, { useState } from "react";
import { List } from "immutable";
import { Alphabet, validAlphabet } from "../../alphabet/Alphabet";
import { History } from "history";
import NumberPicker from "../NumberPicker";

interface IProps {
  setFromLetterEntry: (langName: string, alphabet: Alphabet) => void;
  history: History;
  langName: string;
  alphabet: Alphabet;
}

export default function LetterEntry(props: IProps) {
  const [alphabetSize, setAlphabetSize] = useState(
    props.alphabet.size > 0 ? props.alphabet.size : 26
  );
  const [langName, setLangName] = useState(props.langName);
  const [enteredLetters, setEnteredLetters] = useState(props.alphabet);

  const alphabet = enteredLetters
    .setSize(alphabetSize)
    .map(letters => letters || List(["", ""]));

  const setLetter = (
    letterIndex: number,
    caseIndex: number,
    letter: string
  ) => {
    setEnteredLetters(
      enteredLetters.set(
        letterIndex,
        alphabet.get(letterIndex)!.set(caseIndex, letter)
      )
    );
  };

  const formValid = langName.length > 0 && validAlphabet(alphabet);

  const saveAndQuit = () => {
    props.setFromLetterEntry(langName, alphabet);
    props.history.push("/chart");
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
            value={langName}
            onChange={e => setLangName(e.target.value)}
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
          {props.alphabet.size > 0 && (
            <button onClick={props.history.goBack}>Cancel</button>
          )}
        </div>
      </div>

      <div style={{ overflowY: "auto", padding: "24px" }}>
        <table>
          <tbody>
            {alphabet.map((letters, letterIndex) => (
              <tr key={letterIndex}>
                {letters.map((letter, caseIndex) => (
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
