"use strict";

const mongodb = require("mongodb");
const bson = require("bson");
const ObjectId = bson.ObjectId;
const assert = require("assert").strict;

module.exports.up = async function() {
  const { alphaCollection } = await getCollections();

  const alphabets = await alphaCollection.find({}).toArray();
  for (let i = 0; i < alphabets.length; ++i) {
    const alphabet = alphabets[i];
    if (alphabet.chart.styles.images) {
      let newImageStyles = Object.keys(alphabet.chart.styles.images).reduce(
        (newImageStyles, imagePath) => {
          newImageStyles[stripExt(imagePath)] =
            alphabet.chart.styles.images[imagePath];
          return newImageStyles;
        },
        {}
      );
      const result = await alphaCollection.updateOne(
        { _id: alphabet._id },
        { $set: { "chart.styles.images": newImageStyles } }
      );
    }
  }
};

module.exports.down = function(next) {
  next();
};

function stripExt(str) {
  return str.replace(/\..*$/, "");
}

async function getCollections() {
  const client = await mongodb.MongoClient.connect("mongodb://localhost:27017");
  const db = client.db("alphachart");
  return {
    alphaCollection: db.collection("alphabets"),
    userCollection: db.collection("users")
  };
}
