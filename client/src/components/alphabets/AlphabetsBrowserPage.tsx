import React, { useState } from "react";
import { useLoad } from "../../api/apiRequest";
import { loadLetterIndex, loadAlphabetsByLetter } from "./alphabetSlice";
import { useAppSelector } from "../../state/appState";
import { useTranslation } from "../common/useTranslation";
import AlphabetsList from "./AlphabetsList";
import { useAlphabetListings } from "./useAlphabets";

export default function AlphabetsBrowserPage() {
  useLoad(loadLetterIndex());
  const letterIndex = useAppSelector(state => state.alphabets.letterIndex);

  return letterIndex.length > 0 ? (
    <AlphabetsBrowser letterIndex={letterIndex} />
  ) : null;
}

function AlphabetsBrowser(props: { letterIndex: string[] }) {
  const t = useTranslation();
  const [selectedLetter, setSelectedLetter] = useState(props.letterIndex[0]);
  return (
    <div className="compAlphabetsBrowser">
      <h1>{t("Alphabet_charts")}</h1>
      <LetterPicker {...{ ...props, selectedLetter, setSelectedLetter }} />
      <AlphaList letter={selectedLetter} key={selectedLetter} />
    </div>
  );
}

function LetterPicker(props: {
  letterIndex: string[];
  selectedLetter: string;
  setSelectedLetter: (l: string) => void;
}) {
  return (
    <div className="letterPicker">
      {props.letterIndex.map(letter => (
        <button
          key={letter}
          className={letter == props.selectedLetter ? "selected" : ""}
          onClick={() => props.setSelectedLetter(letter)}
        >
          {letter}
        </button>
      ))}
    </div>
  );
}

function AlphaList(props: { letter: string }) {
  useLoad(loadAlphabetsByLetter(props.letter));
  const alphabets = useAlphabetListings(
    alphabet => alphabet.name.slice(0, 1).toLocaleUpperCase() == props.letter
  );
  return <AlphabetsList alphabets={alphabets} />;
}
