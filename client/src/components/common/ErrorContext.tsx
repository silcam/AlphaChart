import React from "react";

const ErrorContext = React.createContext({
  errorMessage: "",
  setErrorMessage: (_msg: string) => {}
});

export default ErrorContext;
