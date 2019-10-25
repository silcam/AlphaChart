import React, { useContext } from "react";
import I18nContext, { availableLocales } from "./I18nContext";
import LnkBtn from "./LnkBtn";
import { capitalize } from "./util";

export default function LocalePicker() {
  const { locale, setLocale } = useContext(I18nContext);
  const locales = availableLocales();
  return (
    <div className="compLocalePicker">
      {locales.map((loc, index) => (
        <span key={loc}>
          {loc === locale ? (
            capitalize(loc)
          ) : (
            <LnkBtn text={capitalize(loc)} onClick={() => setLocale(loc)} />
          )}
          {index < locales.length - 1 && "\u00A0|\u00A0"}
        </span>
      ))}
    </div>
  );
}
