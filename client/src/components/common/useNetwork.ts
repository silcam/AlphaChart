import { useContext, useState, useEffect } from "react";
import ErrorContext from "./ErrorContext";
import Axios, { AxiosInstance } from "axios";

const TROUBLE_CONNECTING = "Trouble connecting to server, trying to reconnect";
type Request = <T>(
  cb: (axios: AxiosInstance) => Promise<T>,
  errorMessages?: { [key: number]: string }
) => Promise<T | null>;

interface UseNetworkOpts {
  throwErrorsWithResponse?: boolean;
}

export default function useNetwork(
  opts: UseNetworkOpts = {}
): [boolean, Request] {
  const { setErrorMessage } = useContext(ErrorContext);
  const [loading, setLoading] = useState(false);
  const [tryingToReconnect, setTryingToReconnect] = useState(false);
  const [dots, setDots] = useState("...");

  useEffect(() => {
    if (tryingToReconnect) {
      setTimeout(async () => {
        try {
          await Axios.get("/api/users/current");
          setErrorMessage("");
          setTryingToReconnect(false);
        } catch (err) {
          setDots(dots === "..." ? "." : `${dots}.`);
          setErrorMessage(`${TROUBLE_CONNECTING}${dots}`);
        }
      }, 500);
    }
  }, [tryingToReconnect, dots]);

  const request: Request = async (cb, errorMessages = {}) => {
    try {
      setLoading(true);
      return await cb(Axios.create({ timeout: 5000 }));
    } catch (err) {
      console.error(err);
      if (err.response) {
        if (opts.throwErrorsWithResponse) throw err;
        setErrorMessage(
          errorMessages[err.response.status] ||
            `App Error (Code ${err.response.status})`
        );
        return null;
      } else if (err.request) {
        setErrorMessage(`${TROUBLE_CONNECTING}${dots}`);
        setTryingToReconnect(true);
        return null;
      } else {
        throw err;
      }
    } finally {
      setLoading(false);
    }
  };
  return [loading, request];
}
