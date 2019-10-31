import { Express } from "express";
import Data from "../storage/Data";

export default function testDbController(app: Express) {
  app.post("/test-db/load-fixtures", async (req, res) => {
    await Data.loadFixtures();
    res.status(204).send();
  });

  // app.get("/test-db/delete", async (req, res) => {
  //   await Data.deleteDatabase();
  //   res.send("OK");
  // });
}
