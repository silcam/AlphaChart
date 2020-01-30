import React, { useState } from "react";
import { useLoad } from "../../api/apiRequest";
import alphabetSlice, {
  loadLetterIndex,
  loadAlphabetsByLetter
} from "./alphabetSlice";
import { useAppSelector } from "../../state/appState";
import { useTranslation } from "../common/useTranslation";
import AlphabetsList from "./AlphabetsList";
import { useAlphabetListings } from "./useAlphabets";
import { useDispatch } from "react-redux";

export default function AlphabetsBrowserPage() {
  useLoad(loadLetterIndex());

  const t = useTranslation();
  const letterIndex = useAppSelector(state => state.alphabets.letterIndex);
  const selectedLetter = useAppSelector(
    state => state.alphabets.selectedLetter
  );
  const dispatch = useDispatch();
  const setSelectedLetter = (letter: string) =>
    dispatch(alphabetSlice.actions.setSelectedLetter(letter));

  if (letterIndex.length == 0) return null;

  return (
    <div className="compAlphabetsBrowser">
      <h1>{t("Alphabet_charts")}</h1>
      <LetterPicker {...{ letterIndex, selectedLetter, setSelectedLetter }} />
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
