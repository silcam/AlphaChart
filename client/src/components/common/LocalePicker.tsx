import React, { useContext } from "react";
import I18nContext, { availableLocales, Locale } from "./I18nContext";
import LnkBtn from "./LnkBtn";
import { capitalize } from "./util";
import useNetwork from "./useNetwork";
import { apiPath } from "../../models/Api";

export default function LocalePicker() {
  const { locale, setLocale } = useContext(I18nContext);
  const locales = availableLocales();
  const [, request] = useNetwork();

  const setLocaleAndPost = (locale: Locale) => {
    setLocale(locale);
    request(axios => axios.post(apiPath("/users/locale"), { locale }));
  };

  return (
    <div className="compLocalePicker">
      {locales.map((loc, index) => (
        <span key={loc}>
          {loc === locale ? (
            capitalize(loc)
          ) : (
            <LnkBtn
              text={capitalize(loc)}
              onClick={() => setLocaleAndPost(loc)}
            />
          )}
          {index < locales.length - 1 && "\u00A0|\u00A0"}
        </span>
      ))}
    </div>
  );
}
