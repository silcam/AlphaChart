import { createPassword } from "../common/password";
import { ObjectID } from "bson";
import { StoredUser } from "../../../client/src/models/User";
import { StoredAlphabet } from "../../../client/src/models/Alphabet";
import { StoredGroup } from "../../../client/src/models/Group";

const ids = {
  titus: new ObjectID("777777777777777777777777"),
  lucy: new ObjectID("555555555555555555555555"),
  joel: new ObjectID("333333333333333333333333"),
  boys: new ObjectID("111111111111111111111111")
};
interface Fixtures {
  users: StoredUser[];
  groups: StoredGroup[];
  alphabets: StoredAlphabet[];
}

const users = [
  {
    name: "Titus",
    email: "titus@yahoo.com",
    _id: ids.titus,
    password: "minecraft"
  },
  {
    name: "Lucy",
    email: "lucy@me.com",
    _id: ids.lucy,
    password: "princess"
  },
  { name: "Joel", email: "joel@aol.com", _id: ids.joel, password: "rockets" }
];

const dbUsers = users.map(user => {
  const { password, ...dbUser } = user;
  const { hash, salt } = createPassword(password);
  return {
    ...dbUser,
    passwordHash: hash,
    passwordSalt: salt
  };
});

const fixtures: Fixtures = {
  users: dbUsers,
  groups: [{ _id: ids.boys, name: "Boys Team", _users: [ids.titus, ids.joel] }],
  alphabets: [
    {
      _id: new ObjectID("5d4c38e158e6dbb33d7d7b12"),
      name: "Ελληνικα",
      _owner: ids.titus,
      _users: [],
      ownerType: "user",
      chart: {
        timestamp: 1568107634729,
        cols: 5,
        meta: { title: "Ελληνικα" },
        styles: { otherSettings: { alphabetSummaryForm: 1 } },
        letters: [
          {
            forms: ["Α", "α"],
            exampleWord: "Apple",
            imagePath: "/images/5d4c38e158e6dbb33d7d7b12/apple.png"
          },
          {
            forms: ["Β", "β"],
            exampleWord: "Boat",
            imagePath: "/images/5d4c38e158e6dbb33d7d7b12/download.jpg"
          },
          {
            forms: ["Γ", "γ"],
            exampleWord: "Cat",
            imagePath: "/images/5d4c38e158e6dbb33d7d7b12/download.png"
          },
          {
            forms: ["Δ", "δ"],
            exampleWord: "Dog",
            imagePath: "/images/5d4c38e158e6dbb33d7d7b12/download-1.png"
          },
          {
            forms: ["Ε", "ε"],
            exampleWord: "Eagle",
            imagePath: "/images/5d4c38e158e6dbb33d7d7b12/download-1.jpg"
          },
          {
            forms: ["Ζ", "ζ"],
            exampleWord: "Fox",
            imagePath: "/images/5d4c38e158e6dbb33d7d7b12/download-2.jpg"
          },
          {
            forms: ["Η", "η"],
            exampleWord: "Grapes",
            imagePath: "/images/5d4c38e158e6dbb33d7d7b12/download-2.png"
          },
          {
            forms: ["Θ", "θ"],
            exampleWord: "House",
            imagePath: "/images/5d4c38e158e6dbb33d7d7b12/download-3.jpg"
          },
          { forms: ["Ι", "ι"], exampleWord: "", imagePath: "" },
          { forms: ["Κ", "κ"], exampleWord: "", imagePath: "" },
          { forms: ["Λ", "λ"], exampleWord: "", imagePath: "" },
          { forms: ["Μ", "μ"], exampleWord: "", imagePath: "" },
          { forms: ["Ν", "ν"], exampleWord: "", imagePath: "" },
          { forms: ["Ξ", "ξ"], exampleWord: "", imagePath: "" },
          { forms: ["Ο", "ο"], exampleWord: "", imagePath: "" },
          { forms: ["Π", "π"], exampleWord: "", imagePath: "" },
          { forms: ["Ρ", "ρ"], exampleWord: "", imagePath: "" },
          { forms: ["Σ", "σ"], exampleWord: "", imagePath: "" },
          { forms: ["Τ", "τ"], exampleWord: "", imagePath: "" },
          { forms: ["Υ", "υ"], exampleWord: "", imagePath: "" },
          { forms: ["Φ", "φ"], exampleWord: "", imagePath: "" },
          { forms: ["Χ", "χ"], exampleWord: "", imagePath: "" },
          { forms: ["Ψ", "ψ"], exampleWord: "", imagePath: "" },
          { forms: ["Ω", "ω"], exampleWord: "", imagePath: "" }
        ]
      }
    },
    {
      _id: new ObjectID("123abc123abc123abc123abc"),
      name: "Gude",
      _owner: ids.lucy,
      ownerType: "user",
      _users: [ids.titus],
      chart: {
        timestamp: 1576153840147,
        cols: 3,
        meta: { title: "Aləfabetə ŋga guɗe" },
        styles: {},
        letters: [
          {
            forms: ["A", "a"],
            exampleWord: "apple",
            imagePath: ""
          },
          {
            forms: ["Ndz", "ndz"],
            exampleWord: "gandzəma",
            imagePath: ""
          },
          {
            forms: ["Ŋ", "ŋ"],
            exampleWord: "daŋa",
            imagePath: ""
          }
        ]
      }
    },
    {
      _id: new ObjectID("789def789def789def789def"),
      name: "Bana",
      _owner: ids.boys,
      ownerType: "group",
      _users: [],
      chart: {
        timestamp: 1576154303054,
        cols: 3,
        meta: { title: "Shiy jangə shiy lə kwəma ka Bana" },
        styles: {},
        letters: [
          {
            forms: ["A", "a"],
            exampleWord: "tamə",
            imagePath: ""
          },
          {
            forms: ["Ɓ", "ɓ"],
            exampleWord: "ɓiya",
            imagePath: ""
          },
          {
            forms: ["Ꞌ", "ʼ"],
            exampleWord: "ʼwəni",
            imagePath: ""
          }
        ]
      }
    }
  ]
};

export default fixtures;
