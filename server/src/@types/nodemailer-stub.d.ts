declare module "nodemailer-stub" {
  import { Transport } from "nodemailer";

  interface MailInfo {
    messageId: string;
    // response,
    // envelope: envelope,
    from: string;
    to: string[];
    content: string;
    contents: string[];
    contentType: string;
    subject: string;
  }

  interface InteractsWithMail {
    lastMail: () => MailInfo;
    newMail: (mail: MailInfo) => InteractsWithMail;
    flushMails: () => void;
    sentMailsCount: () => number;
  }

  export const stubTransport: Transport;
  export const errorTransport: Transport;
  export const interactsWithMail: InteractsWithMail;
}
