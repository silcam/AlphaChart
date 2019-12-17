import React from "react";
import { Group } from "../../models/Group";
import { Link } from "react-router-dom";

interface IProps {
  groups: Group[];
  title: string;
  selectedId?: string;
}

export default function GroupList(props: IProps) {
  return (
    <div>
      <h2>{props.title}</h2>
      <ul className="std indent">
        {props.groups.map(group => (
          <li key={group.id}>
            {props.selectedId === group.id ? (
              group.name
            ) : (
              <Link to={`/groups/${group.id}`}>{group.name}</Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
