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
    Axios.get("/api/alphabets/mine").then(response => {
      setAlphabets(response.data);
    });
  }, []);

  return (
    <div className="HomePage">
      <div>
        <Link to={`/alphabets/new`}>
          <button>New Alphabet</button>
        </Link>
      </div>
      <div>
        <h2>My Alphabets</h2>
        <AlphabetsList alphabets={alphabets} />
      </div>
    </div>
  );
}
