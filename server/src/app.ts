import express from "express";
import bodyParser from "body-parser";
import usersController from "./controllers/usersController";
import cookieSession from "cookie-session";
import secrets from "./common/secrets";
import alphabetsController from "./controllers/alphabetsController";
import apiVersion from "./controllers/apiVersion";

const app = express();

app.set("port", process.env.PORT || 3001);

app.use(bodyParser.json());
app.use(cookieSession({ secret: secrets.cookieSecret }));
app.use(apiVersion);

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

alphabetsController(app);
usersController(app);

// Handle client-side routes
app.get("*", (req, res) => {
  res.sendFile(`${process.cwd()}/client/build/index.html`);
});

export default app;
