import React from "react";
import { Alphabet } from "../alphabet/Alphabet";
import { Link } from "react-router-dom";

interface IProps {
  alphabets: Alphabet[];
}

export default function AlphabetsList(props: IProps) {
  return (
    <ul>
      {props.alphabets.map(alphabet => (
        <li key={alphabet._id}>
          <Link to={`/alphabets/view/${alphabet._id}`}>{alphabet.name}</Link>
        </li>
      ))}
    </ul>
  );
}
