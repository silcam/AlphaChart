import React from "react";
import { AlphabetListing } from "../../models/Alphabet";
import { Link } from "react-router-dom";
import Loading from "../common/Loading";

interface IProps {
  alphabets: AlphabetListing[] | null;
  hideUser?: boolean;
}

export default function AlphabetsList(props: IProps) {
  return props.alphabets ? (
    <ul className="compAlphabetsList">
      {props.alphabets
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(alphabet => (
          <li key={alphabet._id}>
            <Link to={`/alphabets/view/${alphabet._id}`}>{alphabet.name}</Link>
            {!props.hideUser && (
              <span className="username">{alphabet.userDisplayName}</span>
            )}
          </li>
        ))}
    </ul>
  ) : (
    <Loading />
  );
}
