import nodemailer from "nodemailer";
import secrets from "../common/secrets";
import fs from "fs";
import { stubTransport } from "nodemailer-stub";

const { emailFromAddress } = secrets;

export default async function sendMail(
  to: string,
  subject: string,
  body: string
) {
  const mailer = getMailer();
  return mailer.sendMail({
    to,
    from: emailFromAddress,
    subject,
    html: emailLayout(body)
  });
}

function getMailer() {
  return process.env.NODE_ENV === "production"
    ? nodemailer.createTransport({ sendmail: true, path: "/usr/sbin/sendmail" })
    : nodemailer.createTransport(stubTransport);
}

function getMailTrapMailer() {
  return nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: JSON.parse(fs.readFileSync(`./mailTrapAuth.json`).toString())
  });
}

function emailLayout(body: string) {
  return `
    <html>
      <style type="text/css">
        @font-face {
          font-family: 'AndikaNewBasic';
          src: local('AndikaNewBasic'), url(https://alphachart.gospelcoding.org/fonts/AndikaNewBasic-R.ttf);
        }
        body {
          font-family: "AndikaNewBasic", "Helvetica Neue", Sans-Serif;
        }
      </style>

      <body>
        ${body}
      </body>
    </html>
  `;
}
