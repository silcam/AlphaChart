"use strict";

const mongodb = require("mongodb");

module.exports.up = async function() {
  const { alphaCollection } = await getCollections();

  const alphabets = await alphaCollection.find({}).toArray();
  for (let i = 0; i < alphabets.length; ++i) {
    const alphabet = alphabets[i];
    const styles = alphabet.chart.styles;

    if (styles.table) {
      const pxWidth = parseInt(styles.table.borderWidth);
      const emWidth = pxWidth * 0.125;
      const outer = {
        ...styles.table,
        borderWidth: `${emWidth}em ${emWidth}em 0 0`
      };
      const inner = {
        ...styles.table,
        borderWidth: `0 0 ${emWidth}em ${emWidth}em`
      };
      styles.table = { outer, inner };
    }

    if (styles.images) {
      Object.keys(styles.images).forEach(key => {
        const pxPad = parseInt(styles.images[key].paddingBottom);
        const emPad = pxPad * 0.0625;
        styles.images[key].paddingBottom = `${emPad}em`;
      });
    }

    if (styles.alphabetSummaryLetter) {
      const fontSize = styles.alphabetSummary
        ? parseFloat(styles.alphabetSummary.fontSize)
        : 1.6;
      const pxPad = parseInt(
        styles.alphabetSummaryLetter.padding.split(" ")[1]
      );
      const emPad = pxPad / (16 * fontSize);
      styles.alphabetSummaryLetter.padding = `0 ${emPad}em`;
    }

    await alphaCollection.updateOne(
      { _id: alphabet._id },
      { $set: { "chart.styles": styles } }
    );
  }
};

module.exports.down = function(next) {
  next();
};

async function getCollections() {
  const client = await mongodb.MongoClient.connect("mongodb://localhost:27017");
  const db = client.db("alphachart");
  return {
    alphaCollection: db.collection("alphabets"),
    userCollection: db.collection("users")
  };
}
