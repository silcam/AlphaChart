import { Express } from "express";
import AlphabetData from "../storage/AlphabetData";
import {
  DraftAlphabet,
  AlphabetChart,
  toAlphabet
} from "../../../client/src/models/Alphabet";
import { UploadedFile } from "express-fileupload";
import fileUpload = require("express-fileupload");
import Images from "../storage/Images";
import { verifyLogin, currentUser } from "./controllerHelper";
import { apiPath } from "../../../client/src/api/Api";
import { addGetHandler, addPostHandler } from "./serverApi";

export default function alphabetsController(app: Express) {
  addGetHandler(app, "/alphabets", async req => {
    return AlphabetData.alphabets();
  });

  addGetHandler(app, "/alphabets/mine", async req => {
    const user = await currentUser(req);
    return user ? AlphabetData.alphabets(user) : [];
  });

  addGetHandler(app, "/alphabets/:id", async req => {
    const alphabet = await AlphabetData.alphabet(req.params.id);
    if (alphabet) return toAlphabet(alphabet);
    throw { status: 404 };
  });

  addPostHandler(app, "/alphabets/:id/copy", async req => {
    const alphabet = await AlphabetData.alphabet(req.params.id);
    const user = await currentUser(req);
    if (alphabet === null) throw { status: 404 };
    if (user === null) throw { status: 401 };
    if (alphabet._user.equals(user._id)) throw { status: 422 };
    const newAlphabet = await AlphabetData.copyAlphabet(alphabet, user);
    return { id: `${newAlphabet._id}` };
  });

  addPostHandler(app, "/alphabets", async req => {
    const user = await verifyLogin(req);
    if (!user) throw { status: 401 };

    const draftAlphabet: DraftAlphabet = req.body;
    const alphabet = await AlphabetData.createAlphabet(draftAlphabet, user);
    return toAlphabet(alphabet);
  });

  addPostHandler(app, "/alphabets/:id/charts", async req => {
    const newChart: AlphabetChart = req.body; // VALIDATE
    const alphabet = await AlphabetData.alphabet(req.params.id);
    if (!alphabet) throw { status: 404 };

    const user = await verifyLogin(req, alphabet._user);
    if (!user) throw { status: 401 };

    const newAlphabet = await AlphabetData.updateChart(req.params.id, newChart);
    if (!newAlphabet) throw { status: 500 };

    return toAlphabet(newAlphabet);
  });

  app.post(apiPath("/alphabets/:id/images"), fileUpload(), async (req, res) => {
    const imageFile = req.files!.image as UploadedFile;
    const alphabet = await AlphabetData.alphabet(req.params.id);
    if (!alphabet) {
      res.status(404).send();
    } else {
      const user = await verifyLogin(req, alphabet._user);
      if (user) {
        const imagePath = await Images.save(req.params.id, imageFile);
        res.json({ path: imagePath });
      } else {
        res.status(401).send();
      }
    }
  });
}
