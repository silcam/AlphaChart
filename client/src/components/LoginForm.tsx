import React, { useState } from "react";
import { LoginAttempt } from "../alphabet/User";
import { LogInFunc } from "./useCurrentUser";

interface IProps {
  logIn: LogInFunc;
}

export default function LoginForm(props: IProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const handleError = (e: "Invalid" | "Unknown") => {
    switch (e) {
      case "Invalid":
        setErrorMessage("Invalid login");
        break;
      case "Unknown":
        setErrorMessage("Unkown error");
        break;
    }
  };

  const logIn = async () => {
    const loginAttempt: LoginAttempt = { email, password };
    props.logIn(loginAttempt, handleError);
  };

  return (
    <div>
      <h2>Log In</h2>
      <form
        onSubmit={e => {
          e.preventDefault();
          logIn();
        }}
      >
        <p>
          <input
            type="text"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
          />
        </p>
        <p>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
          />
        </p>
        <p className="error">{errorMessage}</p>
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}
