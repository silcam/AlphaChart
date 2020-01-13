import React from "react";
import { availableLocales } from "../../i18n/i18n";
import LnkBtn from "./LnkBtn";
import { capitalize } from "../../util/stringUtils";
import { useSelector } from "react-redux";
import { AppState } from "../../state/appState";
import { usePush } from "../../api/apiRequest";
import { pushLocale } from "../../state/currentUserSlice";

export default function LocalePicker() {
  const locale = useSelector((state: AppState) => state.currentUser.locale);
  const locales = availableLocales();

  const [setLocale] = usePush(pushLocale);

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
