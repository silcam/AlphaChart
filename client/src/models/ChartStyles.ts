import update from "immutability-helper";
import { stripExt } from "../util/stringUtils";

export const defaultFonts = [
  "Andika",
  "AndikaNewBasic",
  "CharisSIL-Literacy"
] as const;

export type TextAlign = "left" | "right" | "center";
export interface ImageStyles {
  width: string;
  paddingBottom: string;
  transform?: string;
}
export interface ChartStylesStrict {
  chart: {
    fontFamily: string;
  };
  title: {
    fontSize: string;
    textAlign: TextAlign;
  };
  subtitle: {
    fontSize: string;
    textAlign: TextAlign;
  };
  table: {
    outer: {
      borderStyle: "solid";
      borderWidth: string;
      borderColor: string;
    };
    inner: {
      borderStyle: "solid";
      borderWidth: string;
      borderColor: string;
    };
  };
  row: {
    flexDirection: "row" | "row-reverse";
  };
  letter: {
    fontSize: string;
    flexDirection: "row" | "row-reverse";
    justifyContent: "flex-start" | "flex-end" | "space-between" | "center";
  };
  images: {
    [imagePath: string]: ImageStyles;
  };
  imageContainer: { margin: string; padding: string };
  alphabetSummary: {
    display: "flex" | "none";
    fontSize: string;
  };
  alphabetSummaryLetter: {
    padding: string;
  };
  exampleWord: {
    fontSize: string;
  };
  exampleWordKeyLetter: {
    fontWeight: "normal" | "bold";
  };
  lastRowFiller: {
    fontSize: string;
    textAlign: "left" | "right";
  };
  footer: {
    fontSize: string;
    textAlign: "left" | "right";
  };
  otherSettings: {
    alphabetSummaryForm: number;
    display: string; // Dummy property because TS is hard
  };
}

export type ChartStyles = {
  [P in keyof ChartStylesStrict]?: {
    [SubP in keyof ChartStylesStrict[P]]?: ChartStylesStrict[P][SubP];
  };
};

export function defaultChartStyles(): ChartStylesStrict {
  return {
    chart: { fontFamily: "AndikaNewBasic" },
    title: { fontSize: "3em", textAlign: "center" },
    subtitle: { fontSize: "1.6em", textAlign: "center" },
    table: {
      outer: {
        borderStyle: "solid",
        borderWidth: "0.125em 0.125em 0 0",
        borderColor: "#ddd"
      },
      inner: {
        borderStyle: "solid",
        borderWidth: "0 0 0.125em 0.125em",
        borderColor: "#ddd"
      }
    },
    row: { flexDirection: "row" },
    letter: {
      fontSize: "3em",
      flexDirection: "row",
      justifyContent: "flex-start"
    },
    images: {},
    imageContainer: { margin: "0 0em", padding: "0 0em" },
    alphabetSummary: { display: "flex", fontSize: "1.6em" },
    alphabetSummaryLetter: { padding: "0 0em" },
    exampleWord: { fontSize: "1em" },
    exampleWordKeyLetter: { fontWeight: "bold" },
    lastRowFiller: { fontSize: "1em", textAlign: "left" },
    footer: { fontSize: "1em", textAlign: "left" },
    otherSettings: { alphabetSummaryForm: 0, display: "" }
  };
}

export function defaultImageStyles(): ImageStyles {
  return {
    width: "80%",
    paddingBottom: "0px"
  };
}

export function stylesForImage(
  styles: ChartStyles,
  imagePath: string
): ImageStyles {
  return (
    (styles.images && styles.images[stripExt(imagePath)]) ||
    defaultImageStyles()
  );
}

export function setStylesForImages(
  styles: ChartStyles,
  imagePath: string,
  imageStyles: ImageStyles
): ChartStyles {
  return update(styles, {
    images: {
      [stripExt(imagePath)]: { $set: imageStyles }
    }
  });
}

export function completeStyles(mergeStyles: ChartStyles): ChartStylesStrict {
  let styles = defaultChartStyles();
  (Object.keys(mergeStyles) as (keyof ChartStyles)[]).forEach(key => {
    styles = update(styles, { [key]: { $merge: mergeStyles[key] } });
  });
  return styles;
}

export function alphabetSummaryForm(styles: ChartStylesStrict): number {
  return styles.otherSettings && styles.otherSettings.alphabetSummaryForm
    ? styles.otherSettings.alphabetSummaryForm
    : defaultChartStyles().otherSettings.alphabetSummaryForm!;
}

export type LetterPosition = "left" | "right" | "center" | "split";
export interface LetterSettings {
  reverse: boolean;
  position: LetterPosition;
}

export function letterSettingsFromStyles(
  styles: ChartStylesStrict
): LetterSettings {
  const justifyContent = styles.letter.justifyContent;
  const reverse = styles.letter.flexDirection === "row-reverse";
  return {
    reverse,
    position:
      justifyContent === "center"
        ? "center"
        : justifyContent === "space-between"
        ? "split"
        : (justifyContent === "flex-start" && !reverse) ||
          (justifyContent === "flex-end" && reverse)
        ? "left"
        : "right"
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
      position === "center"
        ? "center"
        : position === "split"
        ? "space-between"
        : (position === "left" && !reverse) || (position === "right" && reverse)
        ? "flex-start"
        : "flex-end"
  };
}

export function isRightToLeft(styles: ChartStylesStrict): boolean {
  return styles.row.flexDirection === "row-reverse";
}

export function setRightToLeft(
  styles: ChartStylesStrict,
  rightToLeft: boolean
): ChartStylesStrict {
  return update(styles, {
    row: { flexDirection: { $set: rightToLeft ? "row-reverse" : "row" } },
    lastRowFiller: { textAlign: { $set: rightToLeft ? "right" : "left" } },
    footer: { textAlign: { $set: rightToLeft ? "right" : "left" } }
  });
}

export function setVerticalImagePadding(
  styles: ChartStylesStrict,
  vValue: number
) {
  return update(styles, {
    imageContainer: { padding: { $set: `${vValue * 0.0625}em 0` } }
  });
}

export function setHorizontalImagePadding(
  styles: ChartStylesStrict,
  hValue: number
) {
  return update(styles, {
    imageContainer: { margin: { $set: `0 ${hValue * 0.0625}em` } }
  });
}

export function setBorderWidth(styles: ChartStylesStrict, borderWidth: number) {
  return update(styles, {
    table: {
      outer: {
        $merge: { borderWidth: `${borderWidth}em ${borderWidth}em 0 0` }
      },
      inner: {
        $merge: { borderWidth: `0 0 ${borderWidth}em ${borderWidth}em` }
      }
    }
  });
}

export function setBorderColor(styles: ChartStylesStrict, borderColor: string) {
  return update(styles, {
    table: {
      outer: { borderColor: { $set: borderColor } },
      inner: { borderColor: { $set: borderColor } }
    }
  });
}

export function rotationValue(imgStyles: ImageStyles): number {
  const pattern = /(-?\d+)deg/;
  if (!imgStyles.transform) return 0;

  const match = pattern.exec(imgStyles.transform);
  return (match && parseInt(match[1])) || 0;
}

export function setRotationValue(
  imgStyles: ImageStyles,
  rotation: number
): ImageStyles {
  if (rotation == 0) {
    const { transform, ...rest } = imgStyles;
    return rest;
  }
  return {
    ...imgStyles,
    transform: `rotate(${rotation}deg)`
  };
}
