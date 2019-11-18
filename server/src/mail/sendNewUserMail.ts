import { UnverifiedUser } from "../../../client/src/models/User";
import sendMail from "./Mailer";
import { Locale, tForLocale, TFunc } from "../../../client/src/i18n/i18n";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://alphachart.gospelcoding.org"
    : "http://localhost:3000";

export default async function sendNewUserMail(
  user: UnverifiedUser,
  locale: Locale
) {
  const t = tForLocale(locale);
  const body = newUserBody(user, t);
  return sendMail(user.email, t("Confirm_your_Alphachart_account"), body);
}

function newUserBody(user: UnverifiedUser, t: TFunc) {
  return `
    <h2>${t("Welcome_to_Alphachart")}</h2>
    <p>${t("Hi", { name: user.name })},</p>
    <p>${t("Welcome_email_confirm_text", {
      startLink: `<a href="${BASE_URL}/users/verify/${user.verification}">`,
      endLink: "</a>"
    })}</p>
    <p>${t("Welcome_email_ignore")}</p>
  `;
}
