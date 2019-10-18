import React from "react";
import { AlphabetLetter } from "../../models/Alphabet";

interface IProps {
  letter: AlphabetLetter;
}

export default function ExampleWord(props: IProps) {
  const letter = props.letter;
  const keyLetterPtrn = new RegExp(`(${letter.forms.join("|")})`, "g");
  const pieces = letter.exampleWord.split(keyLetterPtrn);
  return (
    <div className="exampleWord">
      {pieces.map((piece, index) =>
        index % 2 === 0 ? (
          piece
        ) : (
          <span key={index} data-key-letter={true}>
            {piece}
          </span>
        )
      )}
    </div>
  );
}
