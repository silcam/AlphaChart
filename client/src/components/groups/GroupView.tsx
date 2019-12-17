import React from "react";
import { Group } from "../../models/Group";
import { useTranslation } from "../common/useTranslation";
import { useSelector } from "react-redux";
import { AppState } from "../../state/appState";
import { Link } from "react-router-dom";

interface IProps {
  group: Group;
}

export default function GroupView(props: IProps) {
  const t = useTranslation();
  const alphabets = useSelector((state: AppState) => state.alphabets.listings);
  const groupAlphabets = alphabets.filter(
    a => a.ownerType === "group" && a.owner === props.group.id
  );

  return (
    <div>
      <h2>{props.group.name}</h2>
      <h3>{t("Alphabet_charts")}</h3>
      <ul>
        {groupAlphabets.map(alphabet => (
          <li key={alphabet.id}>
            <Link to={`/alphabets/view/${alphabet.id}`}>{alphabet.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
