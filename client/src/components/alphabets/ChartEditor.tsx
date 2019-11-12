import React, { useState } from "react";
import {
  AlphabetChart,
  Alphabet,
  blankAlphabetLetter
} from "../../models/Alphabet";
import NumberPicker from "../common/NumberPicker";
import update from "immutability-helper";
import Chart from "./Chart";
import AddLetter from "./AddLetter";
import LetterSideMenu from "./LetterSideMenu";
import LnkBtn from "../common/LnkBtn";
import SettingsSideMenu from "./SettingsSideMenu";
import { useTranslation } from "../common/I18nContext";
import useUndo from "../common/useUndo";
import UndoRedo from "../common/UndoRedo";
import { stylesForImage, completeStyles } from "../../models/ChartStyles";

interface IProps {
  alphabet: Alphabet;
  save: (chart: AlphabetChart) => void;
  saving: boolean;
  setEditing: (e: boolean) => void;
}

export default function ChartEditor(props: IProps) {
  const t = useTranslation();
  const chart = props.alphabet.chart;
  const [canUndo, canRedo, setChart, undo, redo] = useUndo(chart, props.save);

  const setCols = (cols: number) =>
    setChart(update(chart, { cols: { $set: cols } }));

  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  return (
    <div style={{ paddingBottom: "30px" }}>
      <div
        className="flex-row"
        style={{
          margin: "24px 0",
          justifyContent: "flex-start"
        }}
      >
        <button onClick={() => props.setEditing(false)}>{t("Done")}</button>
        <UndoRedo canUndo={canUndo} canRedo={canRedo} undo={undo} redo={redo} />
        <div>{props.saving && t("Saving")}</div>
      </div>
      <div className="flex-row">
        <AddLetter
          chart={chart}
          setChart={setChart}
          autoFocus={chart.letters.length === 0}
        />

        <div className="flex-space" />
        <label>{t("Columns")}:</label>
        <NumberPicker value={chart.cols} setValue={setCols} />
        <div style={{ width: "20px" }} />
        <LnkBtn
          text={t("Chart_settings")}
          onClick={() => setShowSettingsMenu(!showSettingsMenu)}
        />
      </div>
      <Chart
        alphabet={props.alphabet}
        chart={chart}
        setChart={setChart}
        selectedIndex={selectedIndex}
        setSelectedIndex={i => {
          setSelectedIndex(i);
          setShowSettingsMenu(false);
        }}
        edit
      />
      {showSettingsMenu ? (
        <SettingsSideMenu
          chart={chart}
          setStyles={styles =>
            setChart(update(chart, { styles: { $set: styles } }))
          }
          close={() => setShowSettingsMenu(false)}
        />
      ) : (
        selectedIndex >= 0 && (
          <LetterSideMenu
            letter={chart.letters[selectedIndex]}
            index={selectedIndex}
            alphabetSize={chart.letters.length}
            key={`${selectedIndex}-${chart.letters.length}`}
            close={() => setSelectedIndex(-1)}
            setLetter={letter =>
              setChart(
                update(chart, {
                  letters: { [selectedIndex]: { $set: letter } }
                })
              )
            }
            deleteLetter={() => {
              setChart(
                update(chart, { letters: { $splice: [[selectedIndex, 1]] } })
              );
              setSelectedIndex(-1);
            }}
            insertBefore={() =>
              setChart(
                update(chart, {
                  letters: {
                    $splice: [[selectedIndex, 0, blankAlphabetLetter()]]
                  }
                })
              )
            }
            insertAfter={() => {
              setChart(
                update(chart, {
                  letters: {
                    $splice: [[selectedIndex + 1, 0, blankAlphabetLetter()]]
                  }
                })
              );
              setSelectedIndex(selectedIndex + 1);
            }}
            moveTo={position => {
              const letter = chart.letters[selectedIndex];
              setChart(
                update(chart, {
                  letters: {
                    $splice: [[selectedIndex, 1], [position, 0, letter]]
                  }
                })
              );
              setSelectedIndex(position);
            }}
            imageStyles={stylesForImage(
              chart.styles,
              chart.letters[selectedIndex].imagePath
            )}
            setImageStyles={styles => {
              const chartStyles = update(completeStyles(chart.styles), {
                images: {
                  [chart.letters[selectedIndex].imagePath]: { $set: styles }
                }
              });
              setChart(update(chart, { styles: { $set: chartStyles } }));
            }}
          />
        )
      )}
    </div>
  );
}
