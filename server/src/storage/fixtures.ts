import { createPassword } from "../common/password";
import { ObjectID } from "bson";
import { StoredUser } from "../../../client/src/models/User";
import { StoredAlphabet } from "../../../client/src/models/Alphabet";

interface Fixtures {
  users: StoredUser[];
  alphabets: StoredAlphabet[];
}

const users = [
  {
    name: "Titus",
    email: "titus@yahoo.com",
    _id: "titus@yahoo.com",
    password: "minecraft"
  },
  {
    name: "Lucy",
    email: "lucy@me.com",
    _id: "lucy@me.com",
    password: "princess"
  }
];

const dbUsers = users.map(user => {
  const { password, ...dbUser } = user;
  const { hash, salt } = createPassword(password);
  return { ...dbUser, passwordHash: hash, passwordSalt: salt };
});

const fixtures: Fixtures = {
  users: dbUsers,
  alphabets: [
    {
      _id: new ObjectID("5d4c38e158e6dbb33d7d7b12"),
      name: "Ελληνικα",
      chart: {
        timestamp: 1568107634729,
        cols: 5,
        meta: { title: "Ελληνικα" },
        styles: {},
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
      },
      user: "titus@yahoo.com"
    }
  ]
};

export default fixtures;
