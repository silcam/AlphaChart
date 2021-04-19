import fs from "fs";
import log from "./log";

const SECRETS_FILEPATH = "./secrets.json";

interface ISecrets {
  cookieSecret: string;
  userIdSalt: string;
  emailFromAddress: string;
  mgDomain: string;
  mgSMTPusername: string;
  mgSMTPpassword: string;
  smtpServer: string;
  smtpPort: number;
}

let secrets: ISecrets;
if (fs.existsSync(SECRETS_FILEPATH)) {
  secrets = JSON.parse(fs.readFileSync(SECRETS_FILEPATH).toString());
} else {
  log.warn("WARNING: Using default secrets!!");
  secrets = {
    cookieSecret: "abc123",
    userIdSalt: "salt",
    emailFromAddress: "alphachart@example.com",
    mgDomain: "example.com",
    mgSMTPusername: "username",
    mgSMTPpassword: "password",
    smtpServer: "smtp.example.com",
    smtpPort: 587
  };
}

export default secrets;
