import React, { useContext, useEffect } from "react";
import ErrorContext from "./ErrorContext";
import { useLocation } from "react-router-dom";
import LnkBtn from "./LnkBtn";

export default function ErrorMessage() {
  const { error, setError } = useContext(ErrorContext);

  const location = useLocation();
  useEffect(() => {
    setError(null);
  }, [location.pathname]);

  return error ? (
    <div className="compErrorMessage">
      {error.render ? (
        error.render()
      ) : (
        <React.Fragment>
          <div>{error.msg}</div>
          <LnkBtn text="X" onClick={() => setError(null)} />
        </React.Fragment>
      )}
    </div>
  ) : null;
}
