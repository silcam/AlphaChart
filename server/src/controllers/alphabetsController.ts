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
import { ObjectID, ObjectId } from "mongodb";
import cannotEditAlphabet, {
  cannotControlAlphabet
} from "../actions/cannotEditAlphabet";
import UserData from "../storage/UserData";

export default function alphabetsController(app: Express) {
  addGetHandler(app, "/alphabets", async req => {
    return AlphabetData.alphabets();
  });

  addGetHandler(app, "/alphabets/:id", async req => {
    try {
      const id = new ObjectID(req.params.id);
      const alphabet = await AlphabetData.alphabet(id);
      if (alphabet) return toAlphabet(alphabet);
    } catch (err) {
      // 404
    }
    throw { status: 404 };
  });

  addPostHandler(app, "/alphabets/:id/copy", async req => {
    const ownerData: { owner: string; ownerType: "user" | "group" } = req.body;
    const alphabet = await AlphabetData.alphabet(new ObjectID(req.params.id));
    if (alphabet === null) throw { status: 404 };
    if (
      alphabet._owner.toHexString() == ownerData.owner &&
      alphabet.ownerType == ownerData.ownerType
    )
      throw { status: 422 };
    const newAlphabet = await AlphabetData.copyAlphabet(
      alphabet,
      new ObjectID(ownerData.owner),
      ownerData.ownerType
    );
    return { id: `${newAlphabet._id}` };
  });

  addPostHandler(app, "/alphabets/:id/share", async req => {
    const receiverId: ObjectId = new ObjectID(req.body.userId);
    const alphabetId: ObjectId = new ObjectID(req.params.id);
    const user = await currentUser(req);
    const alphabet = await AlphabetData.alphabet(alphabetId);
    const receiver = await UserData.user(receiverId);
    if (!alphabet || !receiver) throw { status: 404 };
    if (!user || (await cannotControlAlphabet(user, alphabet)))
      throw { status: 401 };
    const newAlphabet = await AlphabetData.shareAlphabet(
      alphabet._id,
      receiver._id
    );
    if (!newAlphabet) throw { status: 500 };
    return toAlphabet(newAlphabet);
  });

  addPostHandler(app, "/alphabets", async req => {
    const user = await verifyLogin(req);
    if (!user) throw { status: 401 };

    const draftAlphabet: DraftAlphabet = req.body;
    const alphabet = await AlphabetData.createAlphabet(draftAlphabet);
    return toAlphabet(alphabet);
  });

  addPostHandler(app, "/alphabets/:id/charts", async req => {
    const newChart: AlphabetChart = req.body; // VALIDATE
    const alphabet = await AlphabetData.alphabet(new ObjectID(req.params.id));
    const user = await currentUser(req);
    if (!alphabet) throw { status: 404 };
    if (!user || (await cannotEditAlphabet(user, alphabet)))
      throw { status: 401 };

    const newAlphabet = await AlphabetData.updateChart(req.params.id, newChart);
    if (!newAlphabet) throw { status: 500 };

    return toAlphabet(newAlphabet);
  });

  app.post(apiPath("/alphabets/:id/images"), fileUpload(), async (req, res) => {
    const imageFile = req.files!.image as UploadedFile;
    const alphabet = await AlphabetData.alphabet(new ObjectID(req.params.id));
    if (!alphabet) {
      res.status(404).send();
    } else {
      const user = await currentUser(req);
      if (user && !(await cannotEditAlphabet(user, alphabet))) {
        const imagePath = await Images.save(req.params.id, imageFile);
        res.json({ path: imagePath });
      } else {
        res.status(401).send();
      }
    }
  });
}
