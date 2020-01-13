"use strict";

const mongodb = require("mongodb");
const assert = require("assert").strict;

module.exports.up = async function() {
  const { db, alphaCollection, userCollection } = await getCollections();

  // Create group collection
  await db.createCollection("groups");

  // Create user search index
  await userCollection.createIndex({ email: "text", name: "text" });

  // Update alphabet fields
  alphaCollection.updateMany(
    {},
    {
      $rename: { _user: "_owner" },
      $set: {
        _users: [],
        ownerType: "user"
      }
    }
  );
};

module.exports.down = function(next) {
  next();
};

async function getCollections() {
  const client = await mongodb.MongoClient.connect("mongodb://localhost:27017");
  const db = client.db("alphachart");
  return {
    db,
    alphaCollection: db.collection("alphabets"),
    userCollection: db.collection("users")
  };
}
