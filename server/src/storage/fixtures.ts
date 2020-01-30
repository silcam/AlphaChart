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
  archivedAlphabets: StoredAlphabet[];
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
            imagePath: "/images/5d4c38e158e6dbb33d7d7b12/boat.jpg"
          },
          {
            forms: ["Γ", "γ"],
            exampleWord: "Cat",
            imagePath: "/images/5d4c38e158e6dbb33d7d7b12/cat.png"
          },
          {
            forms: ["Δ", "δ"],
            exampleWord: "Dog",
            imagePath: "/images/5d4c38e158e6dbb33d7d7b12/dog.png"
          },
          {
            forms: ["Ε", "ε"],
            exampleWord: "Eagle",
            imagePath: "/images/5d4c38e158e6dbb33d7d7b12/eagle.jpg"
          },
          {
            forms: ["Ζ", "ζ"],
            exampleWord: "Fox",
            imagePath: "/images/5d4c38e158e6dbb33d7d7b12/fox.jpg"
          },
          {
            forms: ["Η", "η"],
            exampleWord: "Grapes",
            imagePath: "/images/5d4c38e158e6dbb33d7d7b12/grapes.png"
          },
          {
            forms: ["Θ", "θ"],
            exampleWord: "House",
            imagePath: "/images/5d4c38e158e6dbb33d7d7b12/house.jpg"
          },
          {
            forms: ["Ι", "ι"],
            exampleWord: "igloo",
            imagePath: "/images/5d4c38e158e6dbb33d7d7b12/apple.png"
          },
          {
            forms: ["Κ", "κ"],
            exampleWord: "koala",
            imagePath: "/images/5d4c38e158e6dbb33d7d7b12/apple.png"
          },
          {
            forms: ["Λ", "λ"],
            exampleWord: "lamp",
            imagePath: "/images/5d4c38e158e6dbb33d7d7b12/apple.png"
          },
          {
            forms: ["Μ", "μ"],
            exampleWord: "mouse",
            imagePath: "/images/5d4c38e158e6dbb33d7d7b12/apple.png"
          },
          {
            forms: ["Ν", "ν"],
            exampleWord: "necktie",
            imagePath: "/images/5d4c38e158e6dbb33d7d7b12/apple.png"
          },
          {
            forms: ["Ξ", "ξ"],
            exampleWord: "x-ray",
            imagePath: "/images/5d4c38e158e6dbb33d7d7b12/apple.png"
          },
          {
            forms: ["Ο", "ο"],
            exampleWord: "olive",
            imagePath: "/images/5d4c38e158e6dbb33d7d7b12/apple.png"
          },
          {
            forms: ["Π", "π"],
            exampleWord: "pie",
            imagePath: "/images/5d4c38e158e6dbb33d7d7b12/apple.png"
          },
          {
            forms: ["Ρ", "ρ"],
            exampleWord: "rat",
            imagePath: "/images/5d4c38e158e6dbb33d7d7b12/apple.png"
          },
          {
            forms: ["Σ", "σ"],
            exampleWord: "swamp",
            imagePath: "/images/5d4c38e158e6dbb33d7d7b12/apple.png"
          },
          {
            forms: ["Τ", "τ"],
            exampleWord: "tree",
            imagePath: "/images/5d4c38e158e6dbb33d7d7b12/apple.png"
          },
          {
            forms: ["Υ", "υ"],
            exampleWord: "unicorn",
            imagePath: "/images/5d4c38e158e6dbb33d7d7b12/apple.png"
          },
          {
            forms: ["Φ", "φ"],
            exampleWord: "fox",
            imagePath: "/images/5d4c38e158e6dbb33d7d7b12/apple.png"
          },
          {
            forms: ["Χ", "χ"],
            exampleWord: "chorus",
            imagePath: "/images/5d4c38e158e6dbb33d7d7b12/apple.png"
          },
          {
            forms: ["Ψ", "ψ"],
            exampleWord: "pseudopod",
            imagePath: "/images/5d4c38e158e6dbb33d7d7b12/apple.png"
          },
          {
            forms: ["Ω", "ω"],
            exampleWord: "oregano",
            imagePath: "/images/5d4c38e158e6dbb33d7d7b12/apple.png"
          }
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
  ],
  archivedAlphabets: []
};

export default fixtures;
