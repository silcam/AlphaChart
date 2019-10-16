import React, { useState, useEffect } from "react";
import { LogInFunc, CreateAccountFunc } from "../users/useCurrentUser";
import CreateAccountOrLogIn from "../users/CreateAccountOrLogIn";
import AlphabetsList from "../alphabets/AlphabetsList";
import { Alphabet } from "../../models/Alphabet";
import Axios from "axios";

interface IProps {
  logIn: LogInFunc;
  createAccount: CreateAccountFunc;
}

export default function PublicHomePage(props: IProps) {
  const [alphabets, setAlphabets] = useState<Alphabet[] | null>(null);

  useEffect(() => {
    Axios.get("/api/alphabets").then(response => {
      setAlphabets(response.data);
    });
  }, []);

  return (
    <div className="flex-row compPublicHomePage">
      <div>
        <CreateAccountOrLogIn
          logIn={props.logIn}
          createAccount={props.createAccount}
        />
      </div>
      <div>
        <h2>View Alphabets</h2>
        <AlphabetsList alphabets={alphabets} />
      </div>
    </div>
  );
}
