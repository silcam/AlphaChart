import React from "react";
import { AlphabetLetter } from "../../models/Alphabet";
import regexEscape from "../common/regexEscape";

interface IProps {
  letter: AlphabetLetter;
  keyLetterStyle: any;
}

export default function ExampleWord(props: IProps) {
  const letter = props.letter;
  const nbspWord = letter.exampleWord.replace(/ /g, "\u00A0");
  const keyLetterPtrn = new RegExp(
    `(${letter.forms.map(f => regexEscape(f)).join("|")})`,
    "g"
  );
  const pieces = nbspWord.split(keyLetterPtrn);
  return (
    <div className="exampleWord">
      {pieces.map((piece, index) =>
        index % 2 === 0 ? (
          piece
        ) : (
          <span key={index} style={props.keyLetterStyle}>
            {piece}
          </span>
        )
      )}
    </div>
  );
}
