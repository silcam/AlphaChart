import React from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "../common/useTranslation";
import { usePush } from "../../api/apiRequest";
import { pushCopyAlphabet } from "./alphabetSlice";
import { OptionButtonSimple } from "../common/OptionButton";
import { Alphabet, isOwner } from "../../models/Alphabet";
import { User, CurrentUser } from "../../models/User";
import { Group, isGroup } from "../../models/Group";

interface IProps {
  alphabet: Alphabet;
  user: CurrentUser | null;
  myGroups: Group[];
}

export default function CopyAlphabetButton(props: IProps) {
  const t = useTranslation();
  const history = useHistory();
  const [copy] = usePush(pushCopyAlphabet);
  const user = props.user;
  const myGroups = props.myGroups;

  if (!user) return null;

  const copyToOptions: (User | Group)[] = [...myGroups, user].filter(
    opt => !isOwner(props.alphabet, opt)
  );
  if (copyToOptions.length === 0) return null;

  const copyAlphabet = async (to: User | Group) => {
    const newId = await copy({
      id: props.alphabet.id,
      owner: to.id,
      ownerType: isGroup(to) ? "group" : "user"
    });
    if (newId) {
      history.push(`/alphabets/view/${newId}`);
    }
  };

  return (
    <div className="compCopyAlphabetButton">
      <OptionButtonSimple
        buttonText={t("Copy_to")}
        renderContextMenu={({ hideMenu }) => (
          <table>
            <tbody>
              {copyToOptions.map(opt => (
                <tr key={opt.id}>
                  <td onMouseDown={() => copyAlphabet(opt)}>{opt.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      />
    </div>
  );
}
