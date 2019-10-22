import React, { useContext, useEffect } from "react";
import ErrorContext from "./ErrorContext";
import { useLocation } from "react-router-dom";
import LnkBtn from "./LnkBtn";

export default function ErrorMessage() {
  const { errorMessage, setErrorMessage } = useContext(ErrorContext);

  const location = useLocation();
  useEffect(() => {
    setErrorMessage("");
  }, [location.pathname]);

  return errorMessage ? (
    <div className="compErrorMessage">
      <div>{errorMessage}</div>
      <LnkBtn text="X" onClick={() => setErrorMessage("")} />
    </div>
  ) : null;
}
