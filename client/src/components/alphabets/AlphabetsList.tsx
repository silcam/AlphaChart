import React from "react";
import { AlphabetListing, alphabetOwner } from "../../models/Alphabet";
import { Link } from "react-router-dom";
import Loading from "../common/Loading";
import { useSelector } from "react-redux";
import { AppState } from "../../state/appState";
import { User } from "../../models/User";
import { Group } from "../../models/Group";

interface IProps {
  alphabets: AlphabetListing[] | null;
  hideUser?: boolean;
}

export default function AlphabetsList(props: IProps) {
  const user = useSelector((state: AppState) => state.currentUser.user);
  const users = useSelector((state: AppState) => state.users);
  const groups = useSelector((state: AppState) => state.groups);

  return props.alphabets ? (
    <ul className="compAlphabetsList">
      {props.alphabets.map(alphabet => (
        <li key={alphabet.id}>
          <Link to={`/alphabets/view/${alphabet.id}`}>{alphabet.name}</Link>
          {!props.hideUser && (
            <span className="username">
              {alphabetUserName(alphabet, users, groups, user ? user.id : "")}
            </span>
          )}
        </li>
      ))}
    </ul>
  ) : (
    <Loading />
  );
}

function alphabetUserName(
  alphabet: AlphabetListing,
  users: User[],
  groups: Group[],
  userId: string
) {
  const owner = alphabetOwner(alphabet, users, groups);
  return owner && owner.id !== userId ? owner.name : "";
}
