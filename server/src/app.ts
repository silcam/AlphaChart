import express from "express";
import bodyParser from "body-parser";
import usersController from "./controllers/usersController";
import cookieSession from "cookie-session";
import secrets from "./common/secrets";
import alphabetsController from "./controllers/alphabetsController";
import apiVersion from "./controllers/apiVersion";
import testDbController from "./controllers/testDbController";
import testSentEmailController from "./controllers/testSentEmailController";

const app = express();

// const PORT = process.env.NODE_ENV === "test" ? 3001 : 3001;
const PORT = 3001;
app.set("port", PORT);

app.use(bodyParser.json());
app.use(cookieSession({ secret: secrets.cookieSecret }));
app.use(apiVersion);

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

// Handle client-side routes
app.get("*", (req, res) => {
  res.sendFile(`${process.cwd()}/client/build/index.html`);
});

export default app;
