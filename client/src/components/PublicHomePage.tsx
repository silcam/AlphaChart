import React from "react";
import LoginForm from "./LoginForm";
import { LogInFunc } from "./useCurrentUser";

interface IProps {
  logIn: LogInFunc;
}

export default function PublicHomePage(props: IProps) {
  return (
    <div id="page-root" className="compPublicHomePage">
      <div>
        <h2>Log In</h2>
        <LoginForm logIn={props.logIn} />
      </div>
      <div>
        <h2>View Alphabets</h2>
      </div>
    </div>
  );
}
