import React from "react";
import { useHistory } from "react-router-dom";
import useNetwork from "../common/useNetwork";

interface IProps {
  id: string;
}

export default function CopyAlphabetButton(props: IProps) {
  const history = useHistory();
  const [loading, request] = useNetwork();

  const copyAlphabet = async () => {
    const response = await request(axios =>
      axios.post(`/api/alphabets/${props.id}/copy`)
    );
    if (response) {
      history.push(`/alphabets/view/${response.data._id}`);
    }
  };

  return (
    <button onClick={copyAlphabet} disabled={loading}>
      {loading ? "Loading..." : "Copy to my alphabets"}
    </button>
  );
}
