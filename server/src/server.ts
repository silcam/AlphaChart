import express from "express";
import Data from "./Data";
import { DraftAlphabet } from "../../client/src/alphabet/Alphabet";
import bodyParser from "body-parser";

const app = express();

app.set("port", process.env.PORT || 3001);

app.use(bodyParser.json());

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.get("/api/alphabets", async (req, res) => {
  const alphabets = await Data.alphabets();
  res.json(alphabets);
});

app.post("/api/alphabets/new", async (req, res) => {
  const draftAlphabet: DraftAlphabet = req.body;
  await Data.createAlphabet(draftAlphabet);
  res.json({});
});

app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`);
});
