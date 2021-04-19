import express from "express";
import bodyParser from "body-parser";
import usersController from "./controllers/usersController";
import cookieSession from "cookie-session";
import secrets from "./common/secrets";
import alphabetsController from "./controllers/alphabetsController";
import apiVersion from "./controllers/apiVersion";
import testDbController from "./controllers/testDbController";
import testSentEmailController from "./controllers/testSentEmailController";
import Log from "./common/log";
import groupsController from "./controllers/groupsController";
import exportController from "./controllers/exportController";

const app = express();

// const PORT = process.env.NODE_ENV === "test" ? 3001 : 3001;
const PORT = 3001;
app.set("port", PORT);

export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://alphachart.yaounde.ddns.info"
    : "http://localhost:3000";

app.use(bodyParser.json());
app.use(cookieSession({ secret: secrets.cookieSecret }));
app.use(apiVersion);

app.use((req, res, next) => {
  res.on("finish", () => {
    Log.log(`[HTTP] ${req.method} ${req.path} => ${res.statusCode}`);
  });
  next();
});

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}
if (process.env.NODE_ENV === "test-cypress") {
  testDbController(app);
}
if (process.env.NODE_ENV !== "production") {
  testSentEmailController(app);
}

alphabetsController(app);
usersController(app);
groupsController(app);
exportController(app);

// Handle client-side routes
app.get("*", (req, res) => {
  res.sendFile(`${process.cwd()}/client/build/index.html`);
});

export default app;
