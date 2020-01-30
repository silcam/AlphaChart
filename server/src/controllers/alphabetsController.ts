import { Express, Request } from "express";
import AlphabetData from "../storage/AlphabetData";
import {
  DraftAlphabet,
  AlphabetChart,
  toAlphabet,
  StoredAlphabetListing,
  AlphOwnerType
} from "../../../client/src/models/Alphabet";
import { UploadedFile } from "express-fileupload";
import fileUpload = require("express-fileupload");
import Images from "../storage/Images";
import {
  currentUser,
  getById,
  currentUserStrict,
  validateString
} from "./controllerHelper";
import { apiPath } from "../../../client/src/api/Api";
import { addGetHandler, addPostHandler, withErrorResponse } from "./serverApi";
import { ObjectID, ObjectId } from "mongodb";
import cannotEditAlphabet, {
  cannotControlAlphabet
} from "../actions/cannotEditAlphabet";
import UserData from "../storage/UserData";
import { toPublicUser, User } from "../../../client/src/models/User";
import { Group, toGroup } from "../../../client/src/models/Group";
import GroupData from "../storage/GroupData";
import { unset } from "../../../client/src/util/objectUtils";
import languageLetterIndex from "../actions/languageLetterIndex";
import { escapeRegExp } from "../common/StringUtils";
import { randomSelection } from "../common/ArrayUtils";

export default function alphabetsController(app: Express) {
  addGetHandler(app, "/alphabets", async req => {
    const listings = await AlphabetData.alphabets();
    return {
      alphabetListings: listings.map(toAlphabet),
      users: await usersForAlphabets(listings),
      groups: await groupsForAlphabets(listings)
    };
  });

  addGetHandler(app, "/alphabets/mine", async req => {
    const user = await currentUserStrict(req);
    const groups = await GroupData.groupsByUser(user._id);
    const listings = await AlphabetData.alphabetsByUserOrGroup(
      user._id,
      groups.map(g => g._id)
    );

    return {
      alphabetListings: listings.map(toAlphabet),
      users: await usersForAlphabets(listings),
      groups: await groupsForAlphabets(listings)
    };
  });

  addGetHandler(app, "/alphabets/quality", async req => {
    const listings = await AlphabetData.alphabetsByFilter(function() {
      return (
        this.chart.letters.length > 11 &&
        this.chart.letters.every(
          letter => letter.exampleWord.length > 0 && letter.imagePath.length > 0
        )
      );
    });

    const pickedListings = randomSelection(listings, 5);

    return {
      alphabetListings: pickedListings.map(toAlphabet),
      users: await usersForAlphabets(pickedListings),
      groups: await groupsForAlphabets(pickedListings)
    };
  });

  addGetHandler(app, "/alphabets/letterIndex", async req => {
    return languageLetterIndex();
  });

  addGetHandler(app, "/alphabets/byLetter", async req => {
    const letter = req.query.letter;
    validateString(letter);
    const listings = await AlphabetData.alphabetsByNamePattern(
      new RegExp(`^${escapeRegExp(letter)}`, "i")
    );
    return {
      alphabetListings: listings.map(toAlphabet),
      users: await usersForAlphabets(listings),
      groups: await groupsForAlphabets(listings)
    };
  });

  addGetHandler(app, "/alphabets/:id", async req => {
    const alphabet = await getById(req.params.id, AlphabetData.alphabet);
    return {
      alphabets: [toAlphabet(alphabet)],
      users: await usersForAlphabets([alphabet]),
      groups: await groupsForAlphabets([alphabet])
    };
  });

  addGetHandler(app, "/archivedAlphabets/:id", async req => {
    const alphabet = await getById(req.params.id, AlphabetData.getArchived);
    return toAlphabet(alphabet);
  });

  addPostHandler(app, "/alphabets/:id/copy", async req => {
    const ownerData: { owner: string; ownerType: "user" | "group" } = req.body;
    await validateOwnership(req, ownerData);
    const alphabet = await getById(req.params.id, AlphabetData.alphabet);

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
    const user = await currentUser(req);
    const alphabet = await getById(req.params.id, AlphabetData.alphabet);
    const receiver = await getById(req.body.userId, UserData.user);
    if (await cannotControlAlphabet(user, alphabet)) throw { status: 401 };

    const newAlphabet = await AlphabetData.shareAlphabet(
      alphabet._id,
      receiver._id
    );
    if (!newAlphabet) throw { status: 500 };

    return {
      alphabets: [toAlphabet(newAlphabet)],
      users: await usersForAlphabets([newAlphabet]),
      groups: await groupsForAlphabets([newAlphabet])
    };
  });

  addPostHandler(app, "/alphabets/:id/unshare", async req => {
    const unshareUserId: ObjectId = new ObjectID(req.body.userId);
    const user = await currentUser(req);
    const alphabet = await getById(req.params.id, AlphabetData.alphabet);
    if (await cannotControlAlphabet(user, alphabet)) throw { status: 401 };

    const newAlphabet = await AlphabetData.unshareAlphabet(
      alphabet._id,
      unshareUserId
    );
    if (!newAlphabet) throw { status: 500 };
    return toAlphabet(newAlphabet);
  });

  addPostHandler(app, "/alphabets", async req => {
    const draftAlphabet: DraftAlphabet = req.body;
    await validateOwnership(req, draftAlphabet);
    const alphabet = await AlphabetData.createAlphabet(draftAlphabet);
    return toAlphabet(alphabet);
  });

  addPostHandler(app, "/alphabets/:id/update", async req => {
    const alphabet = await getById(req.params.id, AlphabetData.alphabet);
    const user = await currentUserStrict(req);
    const name = req.body.name;

    if (await cannotControlAlphabet(user, alphabet)) throw { status: 401 };
    if (!name) throw { status: 422 };

    const newAlphabet = await AlphabetData.updateAlphabet(alphabet._id, {
      name
    });
    if (!newAlphabet) throw { status: 500 };
    return {
      alphabets: [toAlphabet(newAlphabet)],
      alphabetListings: [unset(toAlphabet(newAlphabet), "chart")]
    };
  });

  addPostHandler(app, "/alphabets/:id/charts", async req => {
    const newChart: AlphabetChart = req.body; // VALIDATE
    const alphabet = await getById(req.params.id, AlphabetData.alphabet);
    const user = await currentUserStrict(req);
    if (await cannotEditAlphabet(user, alphabet)) throw { status: 401 };

    const newAlphabet = await AlphabetData.updateChart(req.params.id, newChart);
    if (!newAlphabet) throw { status: 500 };

    return toAlphabet(newAlphabet);
  });

  app.post(apiPath("/alphabets/:id/images"), fileUpload(), async (req, res) => {
    withErrorResponse(res, async () => {
      const imageFile = req.files!.image as UploadedFile;
      const alphabet = await getById(req.params.id, AlphabetData.alphabet);

      const user = await currentUserStrict(req);
      if (await cannotEditAlphabet(user, alphabet)) throw { status: 401 };

      const imagePath = await Images.save(req.params.id, imageFile);
      res.json({ path: imagePath });
    });
  });

  addPostHandler(app, "/alphabets/:id/archive", async req => {
    const alphabet = await getById(req.params.id, AlphabetData.alphabet);
    const user = await currentUserStrict(req);
    if (await cannotControlAlphabet(user, alphabet)) throw { status: 401 };
    await AlphabetData.archive(alphabet._id);
    return { id: alphabet._id.toHexString() };
  });
}

async function usersForAlphabets(
  alphabets: StoredAlphabetListing[]
): Promise<User[]> {
  const ids = alphabets.reduce(
    (ids, alphabet) =>
      alphabet.ownerType == "group"
        ? [...ids, ...alphabet._users]
        : [...ids, ...alphabet._users, alphabet._owner],
    [] as ObjectID[]
  );
  return (await UserData.users(ids)).map(toPublicUser);
}

async function groupsForAlphabets(
  alphabets: StoredAlphabetListing[]
): Promise<Group[]> {
  const groupIds = alphabets
    .filter(a => a.ownerType == "group")
    .map(a => a._owner);
  return (await GroupData.groups(groupIds)).map(toGroup);
}

async function validateOwnership(
  req: Request,
  owner: { owner: string; ownerType: AlphOwnerType }
) {
  if (owner.ownerType === "group") {
    const group = await getById(owner.owner, GroupData.group);
    await currentUserStrict(req, group._users);
  } else {
    await currentUserStrict(req, [new ObjectID(owner.owner)]);
  }
}
