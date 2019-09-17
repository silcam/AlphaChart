import express from "express";
import Data from "./Data";
import {
  DraftAlphabet,
  AlphabetChart
} from "../../client/src/alphabet/Alphabet";
import bodyParser from "body-parser";
import fileUpload, { UploadedFile } from "express-fileupload";
import Images from "./Images";
import usersController from "./usersController";
import cookieSession from "cookie-session";
import secrets from "./secrets";

const app = express();

app.set("port", process.env.PORT || 3001);

app.use(bodyParser.json());
app.use(cookieSession({ secret: secrets.cookieSecret }));

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.get("/api/alphabets", async (req, res) => {
  const alphabets = await Data.alphabets();
  res.json(alphabets);
});

app.get("/api/alphabets/:id", async (req, res) => {
  const alphabet = await Data.alphabet(req.params.id);
  if (alphabet === null) res.status(404).send("404");
  else res.json(alphabet);
});

app.post("/api/alphabets", async (req, res) => {
  const draftAlphabet: DraftAlphabet = req.body;
  const alphabet = await Data.createAlphabet(draftAlphabet);
  res.json(alphabet);
});

app.post("/api/alphabets/:id/charts", async (req, res) => {
  const newChart: AlphabetChart = req.body;
  const newAlphabet = await Data.createChart(req.params.id, newChart);
  res.json(newAlphabet);
});

app.post("/api/alphabets/:id/images", fileUpload(), async (req, res) => {
  const imageFile = req.files!.image as UploadedFile;
  const imagePath = await Images.save(req.params.id, imageFile);
  res.json({ path: imagePath });
});

usersController(app);

app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`);
});
