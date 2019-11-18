import en, { Strings, TKey } from "./en";
import fr from "./fr";

const strings = {
  en,
  fr
};
export type Locale = keyof typeof strings;

export function availableLocales(): Locale[] {
  return Object.keys(strings) as Locale[];
}

function translate(
  strings: Strings,
  key: TKey,
  subs: { [key: string]: string } = {}
) {
  if (key === "") return "";
  if (!strings[key]) console.error(`Missing i18n key: ${key}`);
  return Object.keys(subs).reduce((outStr, subKey) => {
    const keyPattern = `%{${subKey}}`;
    while (outStr.includes(keyPattern)) {
      outStr = outStr.replace(keyPattern, subs[subKey]);
    }
    return outStr;
  }, strings[key]);
}

export type TFunc = (key: TKey, subs?: { [key: string]: string }) => string;

export function tForLocale(locale: keyof typeof strings): TFunc {
  return (key, subs) => translate(strings[locale], key, subs);
}
