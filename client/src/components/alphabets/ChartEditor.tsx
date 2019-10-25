import React, { useState } from "react";
import {
  AlphabetChart,
  Alphabet,
  blankAlphabetLetter
} from "../../models/Alphabet";
import { Link } from "react-router-dom";
import NumberPicker from "../common/NumberPicker";
import update from "immutability-helper";
import Chart from "./Chart";
import AddLetter from "./AddLetter";
import LetterSideMenu from "./LetterSideMenu";
import useStateModified from "../common/useStateModified";
import LnkBtn from "../common/LnkBtn";
import SettingsSideMenu from "./SettingsSideMenu";
import { useTranslation } from "../common/I18nContext";

interface IProps {
  alphabet: Alphabet;
  save: (chart: AlphabetChart) => void;
}

export default function ChartEditor(props: IProps) {
  const t = useTranslation();
  const originalChart = props.alphabet.charts[0];
  const [chart, setChart, chartModified] = useStateModified(originalChart);
  const setCols = (cols: number) =>
    setChart(update(chart, { cols: { $set: cols } }));

  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const done = () => props.save(chart);

  return (
    <div style={{ paddingBottom: "30px" }}>
      <div
        className="flex-row"
        style={{
          margin: "24px 0",
          justifyContent: "flex-start"
        }}
      >
        <button onClick={done} disabled={!chartModified}>
          {t("Save_and_quit")}
        </button>
        <Link to={`/alphabets/view/${props.alphabet._id}`}>
          <button onClick={() => {}} className="red">
            {t("Cancel")}
          </button>
        </Link>
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
          />
        )
      )}
    </div>
  );
}
