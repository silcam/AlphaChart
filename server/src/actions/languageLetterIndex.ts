import AlphabetData from "../storage/AlphabetData";

export default async function languageLetterIndex(): Promise<string[]> {
  const languageNames = await AlphabetData.alphabetNames();
  return languageNames
    .reduce((letters: string[], name) => {
      const letter = name.slice(0, 1).toLocaleUpperCase();
      return letters.includes(letter) ? letters : letters.concat([letter]);
    }, [])
    .sort();
}
