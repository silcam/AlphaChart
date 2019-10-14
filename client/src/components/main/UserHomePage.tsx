import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Loading from "../common/Loading";
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

  return (
    <div className="HomePage">
      <div>
        <h2>Alphabets</h2>

        {alphabets === null ? (
          <Loading />
        ) : (
          <AlphabetsList alphabets={alphabets} />
        )}
      </div>
      <div>
        <Link to={`/alphabets/new`}>Create new...</Link>
      </div>
    </div>
  );
}
