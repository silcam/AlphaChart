import { StoredUser } from "../../../client/src/models/User";
import { Locale, tForLocale, TFunc } from "../../../client/src/i18n/i18n";
import sendMail from "./Mailer";
import { BASE_URL } from "../app";

export default async function sendPasswordResetMail(
  user: StoredUser,
  locale: Locale
) {
  const t = tForLocale(locale);
  const body = passwordResetBody(user, t);
  return sendMail(user.email, t("Password_reset"), body);
}

function passwordResetBody(user: StoredUser, t: TFunc) {
  return `
    <h2>${t("Password_reset")}</h2>
    <p>${t("Hi", { name: user.name })},</p>
    <p>
      ${t("Password_reset_body", {
        email: user.email,
        startLink: `<a href="${BASE_URL}/users/passwordReset/${user.passwordResetKey}">`,
        endLink: "</a>"
      })}
    </p>
    <p>${t("Password_reset_if_wasnt_you")}</p>
    <p><a href="${BASE_URL}">Alphachart</a>
  `;
}
