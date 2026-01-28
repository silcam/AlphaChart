import nodemailer from "nodemailer";
import secrets from "../common/secrets";
import fs from "fs";
import { stubTransport } from "nodemailer-stub";

const {
  emailFromAddress,
  smtpServer,
  smtpPort,
  mgSMTPusername,
  mgSMTPpassword
} = secrets;

export default async function sendMail(
  to: string,
  subject: string,
  body: string
) {
  const mailer = getMailer();
  //console.log(`sending mail to ${to}`)
  return mailer.sendMail({
    to,
    from: emailFromAddress,
    subject,
    html: emailLayout(body)
  });
}

function getMailer() {
  if (process.env.NODE_ENV === "production") {
    return getMailGunMailer();
  } else {
    return nodemailer.createTransport(stubTransport);
  }
}

function getMailGunMailer() {
  return nodemailer.createTransport({
    host: smtpServer,
    port: smtpPort,
    secure: false,
    auth: {
     user: mgSMTPusername,
     pass: mgSMTPpassword
    }
  });
}

function emailLayout(body: string) {
  return `
    <html>
      <style type="text/css">
        @font-face {
          font-family: 'AndikaNewBasic';
          src: local('AndikaNewBasic'), url(https://alphachart.silcam.org/fonts/AndikaNewBasic-R.ttf);
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
