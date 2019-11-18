import React, { useContext } from "react";
import { Locale, tForLocale } from "../../i18n/i18n";

interface I18n {
  locale: Locale;
  setLocale: (l: Locale) => void;
}

const I18nContext = React.createContext<I18n>({
  locale: "en",
  setLocale: () => {}
});

export default I18nContext;

export function useTranslation() {
  const { locale } = useContext(I18nContext);
  return tForLocale(locale);
}
