"use strict";

const mongodb = require("mongodb");
const assert = require("assert").strict;

module.exports.up = async function() {
  const collection = await abCollection();
  const alphabets = await collection.find().toArray();
  for (let i = 0; i < alphabets.length; ++i) {
    const alphabet = alphabets[i];
    const result = await collection.updateOne(
      { _id: alphabet._id },
      { $set: { chart: alphabet.charts[0] }, $unset: { charts: "" } }
    );
    assert.equal(result.modifiedCount, 1);
  }
};

module.exports.down = async function() {
  const collection = await abCollection();
  const alphabets = await collection.find().toArray();
  for (let i = 0; i < alphabets.length; ++i) {
    const alphabet = alphabets[i];
    const result = await collection.updateOne(
      { _id: alphabet._id },
      { $set: { charts: [alphabet.chart] }, $unset: { chart: "" } }
    );
    assert.equal(result.modifiedCount, 1);
  }
};

async function abCollection() {
  const client = await mongodb.MongoClient.connect("mongodb://localhost:27017");
  const db = client.db("alphachart");
  return db.collection("alphabets");
}
