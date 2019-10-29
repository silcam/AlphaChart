import { Express } from "express";
import AlphabetData from "../storage/AlphabetData";
import {
  DraftAlphabet,
  AlphabetChart
} from "../../../client/src/models/Alphabet";
import { UploadedFile } from "express-fileupload";
import fileUpload = require("express-fileupload");
import Images from "../storage/Images";
import { verifyLogin, currentUser } from "./controllerHelper";
import { apiPath } from "../../../client/src/models/Api";

export default function alphabetsController(app: Express) {
  app.get(apiPath("/alphabets"), async (req, res) => {
    const alphabets = await AlphabetData.alphabets();
    res.json(alphabets);
  });

  app.get(apiPath("/alphabets/mine"), async (req, res) => {
    const user = await currentUser(req);
    if (user) {
      const alphabets = await AlphabetData.alphabets(user);
      res.json(alphabets);
    } else {
      res.json([]);
    }
  });

  app.get(apiPath("/alphabets/:id"), async (req, res) => {
    const alphabet = await AlphabetData.alphabet(req.params.id);
    if (alphabet === null) res.status(404).send("404");
    else res.json(alphabet);
  });

  app.post(apiPath("/alphabets/:id/copy"), async (req, res) => {
    try {
      const alphabet = await AlphabetData.alphabet(req.params.id);
      const user = await currentUser(req);
      if (alphabet === null) throw { status: 404 };
      if (user === null) throw { status: 401 };
      if (alphabet.user === user._id) throw { status: 422 };
      const newAlphabet = await AlphabetData.copyAlphabet(alphabet, user);
      res.json({ _id: newAlphabet._id });
    } catch (err) {
      if (err.status) res.status(err.status).send();
      else {
        console.error(err);
        res.status(500).send();
      }
    }
  });

  app.post(apiPath("/alphabets"), async (req, res) => {
    const user = await verifyLogin(req);
    if (user) {
      const draftAlphabet: DraftAlphabet = req.body;
      const alphabet = await AlphabetData.createAlphabet(draftAlphabet, user);
      res.json(alphabet);
    } else {
      res.status(401).send({ error: "Must be logged in to create alphabet" });
    }
  });

  app.post(apiPath("/alphabets/:id/charts"), async (req, res) => {
    const newChart: AlphabetChart = req.body; // VALIDATE
    const alphabet = await AlphabetData.alphabet(req.params.id);
    if (!alphabet) {
      res.status(404).send();
    } else {
      const user = await verifyLogin(req, alphabet.user);
      if (user) {
        const newAlphabet = await AlphabetData.updateChart(
          req.params.id,
          newChart
        );
        res.json(newAlphabet);
      } else {
        res.status(401).send();
      }
    }
  });

  app.post(apiPath("/alphabets/:id/images"), fileUpload(), async (req, res) => {
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
