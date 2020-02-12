import en from "./en.json";
import fr from "./fr.json";

const locales = [fr];

test("No extra strings in translations", () => {
  const extraKeys = locales.map(locale =>
    Object.keys(locale).filter(key => !(key in en))
  );
  expect(extraKeys).toEqual(locales.map(() => []));
});

// This test can be safely skipped if needed.
// English strings will be used where translations are missing
// ( Change from test() to test.skip() )
test("No missing strings in translations", () => {
  const enKeys = Object.keys(en);
  const missingKeys = locales.map(locale =>
    enKeys.filter(key => !(key in locale))
  );
  expect(missingKeys).toEqual(locales.map(() => []));
});
