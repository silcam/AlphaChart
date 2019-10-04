import React from "react";
import LetterEntry from "./LetterEntry";
import { blankAlphabet, DraftAlphabet } from "../../models/Alphabet";
import Axios from "axios";
import { History } from "history";

interface IProps {
  history: History;
}

export default function NewAlphabetPage(props: IProps) {
  const save = async (alphabet: DraftAlphabet) => {
    const response = await Axios.post("/api/alphabets", alphabet);
    const id = response.data._id;
    props.history.push(`/alphabets/edit/${id}/chart`);
  };

  return (
    <LetterEntry
      draftAlphabet={blankAlphabet()}
      save={save}
      history={props.history}
    />
  );
}
