import React from "react";
import { User } from "../../models/User";
import SearchTextInput from "../common/SearchTextInput";
import { webGet } from "../../api/apiRequest";
import { useTranslation } from "../common/useTranslation";

interface IProps {
  updateValue: (user: User | null) => void;
  filter?: (u: User) => boolean;
}

export default function UserSearchInput(props: IProps) {
  const t = useTranslation();
  const filter = props.filter ? props.filter : () => true;

  return (
    <SearchTextInput
      sendQuery={q =>
        webGet("/users/search", {}, { q }).then(response =>
          response ? response.users.filter(filter) : null
        )
      }
      updateValue={props.updateValue}
      itemId={u => u.id}
      itemDisplay={u => u.name}
      allowBlank
      placeholder={t("Name_or_email")}
    />
  );
}
