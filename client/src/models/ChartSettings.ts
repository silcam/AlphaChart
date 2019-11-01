import { ChartStyles } from "./Alphabet";

export type LetterPosition = "Left" | "Right" | "Center" | "Split";
export interface LetterSettings {
  reverse: boolean;
  position: LetterPosition;
}

export function letterSettingsFromStyles(styles: ChartStyles): LetterSettings {
  const justifyContent = styles.letter!.justifyContent;
  const reverse = styles.letter!.flexDirection === "row-reverse";
  return {
    reverse,
    position:
      justifyContent === "center"
        ? "Center"
        : justifyContent === "space-between"
        ? "Split"
        : (justifyContent === "flex-start" && !reverse) ||
          (justifyContent === "flex-end" && reverse)
        ? "Left"
        : "Right"
  };
}

export function cssFromLetterSettings(
  settings: LetterSettings
): {
  justifyContent: "flex-start" | "flex-end" | "space-between" | "center";
  flexDirection: "row" | "row-reverse";
} {
  const { reverse, position } = settings;
  return {
    flexDirection: reverse ? "row-reverse" : "row",
    justifyContent:
      position === "Center"
        ? "center"
        : position === "Split"
        ? "space-between"
        : (position === "Left" && !reverse) || (position === "Right" && reverse)
        ? "flex-start"
        : "flex-end"
  };
}
