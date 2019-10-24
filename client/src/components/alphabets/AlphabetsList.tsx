import React from "react";
import { Alphabet } from "../../models/Alphabet";
import { Link } from "react-router-dom";
import Loading from "../common/Loading";

interface IProps {
  alphabets: Alphabet[] | null;
}

export default function AlphabetsList(props: IProps) {
  return props.alphabets ? (
    <ul className="compAlphabetsList">
      {props.alphabets
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(alphabet => (
          <li key={alphabet._id}>
            <Link to={`/alphabets/view/${alphabet._id}`}>{alphabet.name}</Link>
          </li>
        ))}
    </ul>
  ) : (
    <Loading />
  );
}
