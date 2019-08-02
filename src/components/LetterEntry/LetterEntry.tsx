import React, { useState } from "react";
import { List } from "immutable";
import { Alphabet, validAlphabet } from "../../alphabet/Alphabet";
import { History } from "history";

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
    <div>
      <div>
        <label>
          Language:
          <input
            type="text"
            value={langName}
            onChange={e => setLangName(e.target.value)}
          />
        </label>
      </div>
      <div>
        Letters:
        <input
          type="text"
          value={alphabetSize === 0 ? "" : alphabetSize.toString()}
          onChange={e => setAlphabetSize(parseInt(e.target.value) || 0)}
        />
        <button onClick={e => setAlphabetSize(alphabetSize + 1)}>^</button>
        <button
          onClick={e => setAlphabetSize(alphabetSize - 1)}
          disabled={alphabetSize <= 1}
        >
          v
        </button>
      </div>
      <div>
        <table>
          <tbody>
            {alphabet.map((letters, letterIndex) => (
              <tr>
                {letters.map((letter, caseIndex) => (
                  <td>
                    <input
                      type="text"
                      value={letter}
                      onChange={e =>
                        setLetter(letterIndex, caseIndex, e.target.value)
                      }
                      placeholder={
                        letterIndex === 0 ? (caseIndex === 0 ? "A" : "a") : ""
                      }
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <button onClick={saveAndQuit} disabled={!formValid}>
          Save
        </button>
        {props.alphabet.size > 0 && (
          <button onClick={props.history.goBack}>Cancel</button>
        )}
      </div>
    </div>
  );
}
