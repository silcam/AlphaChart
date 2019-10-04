import React, { useState } from "react";
import { CreateAccountFunc } from "./useCurrentUser";
import { NewUser, validationErrors } from "../../models/User";

interface IProps {
  createAccount: CreateAccountFunc;
}

export default function CreateAccountForm(props: IProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const createAccount = () => {
    const newUser: NewUser = {
      email,
      password,
      name: displayName
    };
    const errors = validationErrors(newUser, passwordCheck);
    if (!errors) props.createAccount(newUser, error => setErrors([error]));
    else setErrors(errors);
  };

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        createAccount();
      }}
    >
      <h2>Create New Account</h2>
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
      <p>
        <input
          type="password"
          value={passwordCheck}
          onChange={e => setPasswordCheck(e.target.value)}
          placeholder="Verify Password"
        />
      </p>
      <p>
        <input
          type="text"
          value={displayName}
          onChange={e => setDisplayName(e.target.value)}
          placeholder="Display Name"
        />
      </p>
      <p className="error">
        {errors.map(err => (
          <span style={{ display: "block" }} key={err}>
            {err}
          </span>
        ))}
      </p>
      <button type="submit">Create Account</button>
    </form>
  );
}
