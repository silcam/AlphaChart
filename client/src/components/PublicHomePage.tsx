import React from "react";
import { LogInFunc, CreateAccountFunc } from "./useCurrentUser";
import CreateAccountOrLogIn from "./CreateAccountOrLogIn";

interface IProps {
  logIn: LogInFunc;
  createAccount: CreateAccountFunc;
}

export default function PublicHomePage(props: IProps) {
  return (
    <div id="page-root" className="flex-row compPublicHomePage">
      <div>
        <CreateAccountOrLogIn
          logIn={props.logIn}
          createAccount={props.createAccount}
        />
      </div>
      <div>
        <h2>View Alphabets</h2>
      </div>
    </div>
  );
}
