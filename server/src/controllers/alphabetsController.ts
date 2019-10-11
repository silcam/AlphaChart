import { Express } from "express";
import AlphabetData from "../storage/AlphabetData";
import {
  DraftAlphabet,
  AlphabetChart
} from "../../../client/src/models/Alphabet";
import { UploadedFile } from "express-fileupload";
import fileUpload = require("express-fileupload");
import Images from "../storage/Images";
import { verifyLogin } from "./controllerHelper";

export default function alphabetsController(app: Express) {
  app.get("/api/alphabets", async (req, res) => {
    const alphabets = await AlphabetData.alphabets();
    res.json(alphabets);
  });

  app.get("/api/alphabets/:id", async (req, res) => {
    const alphabet = await AlphabetData.alphabet(req.params.id);
    if (alphabet === null) res.status(404).send("404");
    else res.json(alphabet);
  });

  app.post("/api/alphabets", async (req, res) => {
    const user = await verifyLogin(req);
    if (user) {
      const draftAlphabet: DraftAlphabet = req.body;
      const alphabet = await AlphabetData.createAlphabet(draftAlphabet, user);
      res.json(alphabet);
    } else {
      res.status(401).send({ error: "Must be logged in to create alphabet" });
    }
  });

  app.post("/api/alphabets/:id/charts", async (req, res) => {
    const newChart: AlphabetChart = req.body; // VALIDATE
    const alphabet = await AlphabetData.alphabet(req.params.id);
    if (!alphabet) {
      res.status(404).send();
    } else {
      const user = await verifyLogin(req, alphabet.user);
      if (user) {
        const newAlphabet = await AlphabetData.createChart(
          req.params.id,
          newChart
        );
        res.json(newAlphabet);
      } else {
        res.status(401).send();
      }
    }
  });

  app.post("/api/alphabets/:id/images", fileUpload(), async (req, res) => {
    const imageFile = req.files!.image as UploadedFile;
    const alphabet = await AlphabetData.alphabet(req.params.id);
    if (!alphabet) {
      res.status(404).send();
    } else {
      const user = await verifyLogin(req, alphabet.user);
      if (user) {
        const imagePath = await Images.save(req.params.id, imageFile);
        res.json({ path: imagePath });
      } else {
        res.status(401).send();
      }
    }
  });
}
