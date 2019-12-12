"use strict";

const mongodb = require("mongodb");
const assert = require("assert").strict;

module.exports.up = async function() {
  const { alphaCollection, userCollection } = await getCollections();
  const users = await userCollection.find().toArray();
  for (let i = 0; i < users.length; ++i) {
    const { _id, ...user } = users[i];
    console.log(`UPDATE user ${user.email}`);

    // Re-insert the user to autogenerate the _id
    let result = await userCollection.insertOne(user);
    const newUser = result.ops[0];
    assert.equal(typeof newUser._id, "object");
    console.log(`...new _id ${newUser._id}`);

    // Delete the original user
    result = await userCollection.deleteOne({ _id: user.email });
    assert.equal(result.deletedCount, 1);

    // Update user references from alphabets
    result = await alphaCollection.updateMany(
      { user: user.email },
      { $set: { _user: newUser._id }, $unset: { user: "" } }
    );
    console.log(`...${result.modifiedCount} alphabets updated.`);
  }
};

module.exports.down = async function() {};

async function getCollections() {
  const client = await mongodb.MongoClient.connect("mongodb://localhost:27017");
  const db = client.db("alphachart");
  return {
    alphaCollection: db.collection("alphabets"),
    userCollection: db.collection("users")
  };
}
