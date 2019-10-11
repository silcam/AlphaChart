import fs from "fs";
import log from "./log";

const SECRETS_FILEPATH = "./secrets.json";

interface ISecrets {
  cookieSecret: string;
  userIdSalt: string;
}

let secrets: ISecrets;
if (fs.existsSync(SECRETS_FILEPATH)) {
  secrets = JSON.parse(fs.readFileSync(SECRETS_FILEPATH).toString());
} else {
  log.warn("WARNING: Using default secrets!!");
  secrets = {
    cookieSecret: "abc123",
    userIdSalt: "salt"
  };
}

export default secrets;
