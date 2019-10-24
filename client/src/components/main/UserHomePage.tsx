import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Alphabet } from "../../models/Alphabet";
import Axios from "axios";
import AlphabetsList from "../alphabets/AlphabetsList";
import { LogOutFunc } from "../users/useCurrentUser";
import { CurrentUser } from "../../models/User";

interface IProps {
  logOut: LogOutFunc;
  currentUser: CurrentUser;
}

export default function UserHomePage(props: IProps) {
  const [alphabets, setAlphabets] = useState<Alphabet[] | null>(null);

  useEffect(() => {
    Axios.get("/api/alphabets").then(response => {
      setAlphabets(response.data);
    });
  }, []);

  const myAlphabets =
    alphabets && alphabets.filter(a => a.user === props.currentUser.email);
  const otherAlphabets =
    alphabets && alphabets.filter(a => a.user !== props.currentUser.email);

  return (
    <div className="HomePage">
      <div>
        <Link to={`/alphabets/new`}>
          <button>New Alphabet</button>
        </Link>
      </div>
      <div className="flex-row">
        <div>
          <h2>My Alphabets</h2>
          <AlphabetsList alphabets={myAlphabets} />
        </div>
        <div>
          <h2>Other Alphabets</h2>
          <AlphabetsList alphabets={otherAlphabets} />
        </div>
      </div>
    </div>
  );
}
