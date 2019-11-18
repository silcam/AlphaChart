import { Express } from "express";
import { interactsWithMail as iwm } from "nodemailer-stub";

export default function testSentEmailController(app: Express) {
  app.get("/test-email/last-mail", (req, res) => {
    res.send(iwm.lastMail());
  });
}
