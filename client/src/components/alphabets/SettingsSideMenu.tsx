import React from "react";
import {
  ChartStyles,
  AlphabetChart,
  defaultChartStyles,
  stylesFor,
  defaultFonts
} from "../../models/Alphabet";
import update from "immutability-helper";
import FontSizeInput from "./FontSizeInput";
import LnkBtn from "../common/LnkBtn";
import Switch from "react-switch";
import NumberPicker from "../common/NumberPicker";
import ColorInput from "../common/ColorInput";

interface IProps {
  chart: AlphabetChart;
  setStyles: (s: ChartStyles) => void;
  close: () => void;
}

export default function SettingsSideMenu(props: IProps) {
  const keys = Object.keys(defaultChartStyles()) as (keyof ChartStyles)[];
  const styles: ChartStyles = keys.reduce(
    (styles: ChartStyles, key) => ({
      ...styles,
      [key]: stylesFor(props.chart, key)
    }),
    {}
  );
  const updateStyles = (key: keyof ChartStyles, s: any) => {
    const op = props.chart.styles[key] ? "$merge" : "$set";
    props.setStyles(update(props.chart.styles, { [key]: { [op]: s } }));
  };

  return (
    <div className="side-menu settings-side-menu">
      <div style={{ alignSelf: "flex-end" }}>
        <LnkBtn onClick={props.close} text="Close" />
      </div>
      <h1>Chart Settings</h1>
      <div className="input">
        <label>Font:</label>
        <select
          value={styles.chart!.fontFamily}
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
        <label>Title Font Size:</label>
        <FontSizeInput
          fontSize={styles.title!.fontSize!}
          setFontSize={fontSize => updateStyles("title", { fontSize })}
        />
      </div>
      <div className="input">
        <label>Subtitle Font Size:</label>
        <FontSizeInput
          fontSize={styles.subtitle!.fontSize!}
          setFontSize={fontSize => updateStyles("subtitle", { fontSize })}
        />
      </div>
      <div className="input">
        <label>Title Position:</label>
        <select
          value={styles.title!.textAlign}
          onChange={e => {
            props.setStyles(
              update(props.chart.styles, {
                title: {
                  $set: {
                    ...props.chart.styles.title,
                    textAlign: e.target.value
                  }
                },
                subtitle: {
                  $set: {
                    ...props.chart.styles.subtitle,
                    textAlign: e.target.value
                  }
                }
              })
            );
          }}
        >
          {["Left", "Center", "Right"].map(opt => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <div className="input">
        <label>Show Top Alphabet?</label>
        <Switch
          checked={styles.alphabetSummary!.display === "flex"}
          onChange={show =>
            updateStyles("alphabetSummary", { display: show ? "flex" : "none" })
          }
        />
      </div>
      <div className="input">
        <label>Top Alphabet Font Size:</label>
        <FontSizeInput
          fontSize={styles.alphabetSummary!.fontSize!}
          setFontSize={fontSize =>
            updateStyles("alphabetSummary", { fontSize })
          }
        />
      </div>
      <div className="input">
        <label>Top Alphabet Style:</label>
        <select
          value={styles.otherSettings!.alphabetSummaryForm!}
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
      <div className="input">
        <label>Letter Font Size:</label>
        <FontSizeInput
          fontSize={styles.letter!.fontSize!}
          setFontSize={fontSize => updateStyles("letter", { fontSize })}
        />
      </div>
      <div className="input">
        <label>Example Word Font Size:</label>
        <FontSizeInput
          fontSize={styles.exampleWord!.fontSize!}
          setFontSize={fontSize => updateStyles("exampleWord", { fontSize })}
        />
      </div>
      <div className="input">
        <label>Bold key letter?</label>
        <Switch
          checked={styles.exampleWordKeyLetter!.fontWeight === "bold"}
          onChange={bold =>
            updateStyles("exampleWordKeyLetter", {
              fontWeight: bold ? "bold" : "normal"
            })
          }
          onColor="#1892ef"
        />
      </div>
      <div className="input">
        <label>Last Row Filler Font Size:</label>
        <FontSizeInput
          fontSize={styles.lastRowFiller!.fontSize!}
          setFontSize={fontSize => updateStyles("lastRowFiller", { fontSize })}
        />
      </div>
      <div className="input">
        <label>Footer Font Size:</label>
        <FontSizeInput
          fontSize={styles.footer!.fontSize!}
          setFontSize={fontSize => updateStyles("footer", { fontSize })}
        />
      </div>
      <div className="input">
        <label>Border Thickness:</label>
        <NumberPicker
          value={parseInt(styles.table!.borderWidth!)}
          setValue={v => updateStyles("table", { borderWidth: `${v}px` })}
          noType
          minimum={0}
        />
      </div>
      <div className="input">
        <label>Border Color:</label>
        <ColorInput
          color={styles.table!.borderColor!}
          setColor={borderColor => updateStyles("table", { borderColor })}
        />
      </div>
    </div>
  );
}
