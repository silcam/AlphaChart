import React from "react";
import { AlphabetChart } from "../../models/Alphabet";
import {
  ChartStyles,
  defaultFonts,
  completeStyles,
  TextAlign,
  isRightToLeft,
  setRightToLeft,
  setBorderColor,
  setBorderWidth
} from "../../models/ChartStyles";
import update from "immutability-helper";
import FontSizeInput from "./FontSizeInput";
import LnkBtn from "../common/LnkBtn";
import Switch from "react-switch";
import NumberPicker from "../common/NumberPicker";
import ColorInput from "../common/ColorInput";
import { useTranslation } from "../common/useTranslation";
import { TKey } from "../../i18n/i18n";
import {
  letterSettingsFromStyles,
  cssFromLetterSettings,
  LetterPosition
} from "../../models/ChartStyles";

interface IProps {
  chart: AlphabetChart;
  setStyles: (s: ChartStyles) => void;
  close: () => void;
}

export default function SettingsSideMenu(props: IProps) {
  const t = useTranslation();
  const styles = completeStyles(props.chart.styles);
  const updateStyles = (key: keyof ChartStyles, s: any) => {
    const op = props.chart.styles[key] ? "$merge" : "$set";
    props.setStyles(update(props.chart.styles, { [key]: { [op]: s } }));
  };
  const letterSettings = letterSettingsFromStyles(styles);

  return (
    <div className="side-menu settings-side-menu">
      <div style={{ alignSelf: "flex-end" }}>
        <LnkBtn onClick={props.close} text={t("Close")} />
      </div>
      <h1>{t("Chart_settings")}</h1>
      <div className="input">
        <label>{t("Font")}:</label>
        <select
          value={styles.chart.fontFamily}
          onChange={e => updateStyles("chart", { fontFamily: e.target.value })}
        >
          {defaultFonts.map(font => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>
      </div>
      <div className="input">
        <label>{t("Right_to_left")}:</label>
        <Switch
          checked={isRightToLeft(styles)}
          onChange={rightToLeft =>
            props.setStyles(setRightToLeft(styles, rightToLeft))
          }
        />
      </div>

      <hr />

      <div className="input">
        <label>{t("Title_font_size")}:</label>
        <FontSizeInput
          fontSize={styles.title.fontSize!}
          setFontSize={fontSize => updateStyles("title", { fontSize })}
        />
      </div>
      <div className="input">
        <label>{t("Subtitle_font_size")}:</label>
        <FontSizeInput
          fontSize={styles.subtitle.fontSize!}
          setFontSize={fontSize => updateStyles("subtitle", { fontSize })}
        />
      </div>
      <div className="input">
        <label>{t("Title_position")}:</label>
        <select
          value={styles.title.textAlign.toLocaleLowerCase()}
          onChange={e => {
            props.setStyles(
              update(props.chart.styles, {
                title: {
                  $set: {
                    ...props.chart.styles.title,
                    textAlign: e.target.value as TextAlign
                  }
                },
                subtitle: {
                  $set: {
                    ...props.chart.styles.subtitle,
                    textAlign: e.target.value as TextAlign
                  }
                }
              })
            );
          }}
        >
          {(["left", "center", "right"] as TKey[]).map(opt => (
            <option key={opt} value={opt}>
              {t(opt)}
            </option>
          ))}
        </select>
      </div>

      <hr />

      <div className="input">
        <label>{t("Show_top_alphabet")}</label>
        <Switch
          checked={styles.alphabetSummary.display === "flex"}
          onChange={show =>
            updateStyles("alphabetSummary", { display: show ? "flex" : "none" })
          }
        />
      </div>
      {styles.alphabetSummary.display === "flex" && (
        <React.Fragment>
          <div className="input">
            <label>{t("Top_alphabet_font_size")}:</label>
            <FontSizeInput
              fontSize={styles.alphabetSummary.fontSize!}
              setFontSize={fontSize =>
                updateStyles("alphabetSummary", { fontSize })
              }
            />
          </div>
          <div className="input">
            <label>{t("Top_alphabet_spacing")}:</label>
            <NumberPicker
              value={parseInt(
                styles.alphabetSummaryLetter.padding.replace(/^0 /, "")
              )}
              setValue={v =>
                updateStyles("alphabetSummaryLetter", {
                  padding: `0 ${v * 0.05}em`
                })
              }
              noType
              minimum={0}
            />
          </div>
          <div className="input">
            <label>{t("Top_alphabet_style")}:</label>
            <select
              value={styles.otherSettings.alphabetSummaryForm!}
              onChange={e =>
                updateStyles("otherSettings", {
                  alphabetSummaryForm: e.target.value
                })
              }
            >
              {props.chart.letters[0] &&
                props.chart.letters[0].forms.map((form, index) => (
                  <option key={index} value={index}>
                    {form}
                  </option>
                ))}
            </select>
          </div>
        </React.Fragment>
      )}

      <hr />

      <div className="input">
        <label>{t("Letter_font_size")}:</label>
        <FontSizeInput
          fontSize={styles.letter.fontSize!}
          setFontSize={fontSize => updateStyles("letter", { fontSize })}
        />
      </div>
      <div className="input">
        <label>{t("Reverse_letters")}:</label>
        <Switch
          checked={letterSettings.reverse}
          onChange={reverse =>
            updateStyles(
              "letter",
              cssFromLetterSettings({ ...letterSettings, reverse })
            )
          }
          onColor="#1892ef"
        />
      </div>
      <div className="input">
        <label>{t("Letter_position")}:</label>
        <select
          value={letterSettings.position}
          onChange={e =>
            updateStyles(
              "letter",
              cssFromLetterSettings({
                ...letterSettings,
                position: e.target.value as LetterPosition
              })
            )
          }
        >
          {(["left", "right", "center", "split"] as LetterPosition[]).map(
            position => (
              <option key={position} value={position}>
                {t(position)}
              </option>
            )
          )}
        </select>
      </div>
      <div className="input">
        <label>{t("Example_word_font_size")}:</label>
        <FontSizeInput
          fontSize={styles.exampleWord.fontSize!}
          setFontSize={fontSize => updateStyles("exampleWord", { fontSize })}
        />
      </div>
      <div className="input">
        <label>{t("Bold_key_letter")}</label>
        <Switch
          checked={styles.exampleWordKeyLetter.fontWeight === "bold"}
          onChange={bold =>
            updateStyles("exampleWordKeyLetter", {
              fontWeight: bold ? "bold" : "normal"
            })
          }
          onColor="#1892ef"
        />
      </div>

      <hr />

      <div className="input">
        <label>{t("Last_row_filler_font_size")}:</label>
        <FontSizeInput
          fontSize={styles.lastRowFiller.fontSize}
          setFontSize={fontSize => updateStyles("lastRowFiller", { fontSize })}
        />
      </div>
      <div className="input">
        <label>{t("Footer_font_size")}:</label>
        <FontSizeInput
          fontSize={styles.footer.fontSize}
          setFontSize={fontSize => updateStyles("footer", { fontSize })}
        />
      </div>

      <hr />

      <div className="input">
        <label>{t("Border_color")}:</label>
        <ColorInput
          color={styles.table.outer.borderColor}
          setColor={borderColor =>
            props.setStyles(setBorderColor(styles, borderColor))
          }
        />
      </div>
      <div className="input">
        <label>{t("Border_thickness")}:</label>
        <NumberPicker
          value={Math.round(parseFloat(styles.table.outer.borderWidth) / 0.125)}
          setValue={v => props.setStyles(setBorderWidth(styles, v * 0.125))}
          noType
          minimum={0}
        />
      </div>
    </div>
  );
}
