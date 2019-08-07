import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Loading from "./Loading";
import { Alphabet } from "../alphabet/Alphabet";
import Axios from "axios";

export default function HomePage() {
  const [alphabets, setAlphabets] = useState<Alphabet[] | null>(null);

  useEffect(() => {
    Axios.get("/api/alphabets").then(response => {
      setAlphabets(response.data);
    });
  }, []);

  return (
    <div id="page-root" className="HomePage">
      <div>
        <h2>Alphabets</h2>
        <ul>
          {alphabets === null ? (
            <Loading />
          ) : (
            alphabets.map(alphabet => (
              <li key={alphabet._id}>
                <Link to={`/alphabets/view/${alphabet._id}`}>
                  {alphabet.name}
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
      <div>
        <Link to={`/alphabets/new`}>Create new...</Link>
      </div>
    </div>
  );
}
