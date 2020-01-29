import React from "react";
import { AlphabetListingInflated } from "../../models/Alphabet";
import { Link } from "react-router-dom";
import Loading from "../common/Loading";
import { useSelector } from "react-redux";
import { AppState } from "../../state/appState";
import { CurrentUser } from "../../models/User";

interface IProps {
  alphabets: AlphabetListingInflated[] | null;
  hideUser?: CurrentUser;
}

export default function AlphabetsList(props: IProps) {
  const user = useSelector((state: AppState) => state.currentUser.user);

  return props.alphabets ? (
    <ul className="compAlphabetsList">
      {props.alphabets.map(alphabet => (
        <li key={alphabet.id}>
          <Link to={`/alphabets/view/${alphabet.id}`}>{alphabet.name}</Link>
          <span className="username">
            {alphabetUserName(
              alphabet,
              props.hideUser ? props.hideUser.id : ""
            )}
          </span>
        </li>
      ))}
    </ul>
  ) : (
    <Loading />
  );
}

function alphabetUserName(
  alphabet: AlphabetListingInflated,
  hideUserId: string
) {
  return alphabet.ownerObj && alphabet.ownerObj.id !== hideUserId
    ? alphabet.ownerObj.name
    : "";
}
