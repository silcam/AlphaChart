import React from "react";
import {
  Alphabet,
  AlphabetLetter,
  AlphabetChart,
  stylesFor
} from "../../models/Alphabet";
import ImageInput from "./ImageInput";
import update from "immutability-helper";

interface IProps {
  alphabet: Alphabet;
  chart: AlphabetChart;
  setChart: (chart: AlphabetChart) => void;
  edit?: boolean;
  selectedIndex?: number;
  setSelectedIndex?: (index: number) => void;
}

export default function Chart(props: IProps) {
  const chart = props.chart;
  const alphabetTable = clump(chart.letters, Math.max(chart.cols, 1));
  const cellWidth = 100 / chart.cols;

  const updateLetter = (index: number, letter: Partial<AlphabetLetter>) =>
    props.setChart(update(chart, { letters: { [index]: { $merge: letter } } }));
  const updateMeta = (meta: Partial<typeof chart.meta>) =>
    props.setChart(update(chart, { meta: { $merge: meta } }));
  const updateStyles = (styles: Partial<typeof chart.styles>) =>
    props.setChart(update(chart, { styles: { $merge: styles } }));

  return (
    <div className="compChart" id="compChart">
      <div className="alphaTitle" style={stylesFor(chart, "title")}>
        {props.edit ? (
          <input
            type="text"
            value={chart.meta.title || ""}
            onChange={e => updateMeta({ title: e.target.value })}
            style={{ fontSize: "1em" }}
            placeholder="Title"
          />
        ) : (
          chart.meta.title
        )}
      </div>
      {(props.edit || chart.meta.subtitle) && (
        <div className="alphaSubtitle" style={stylesFor(chart, "subtitle")}>
          {props.edit ? (
            <input
              type="text"
              value={chart.meta.subtitle || ""}
              onChange={e => updateMeta({ subtitle: e.target.value })}
              style={{ fontSize: "1em" }}
              placeholder="Subtitle"
            />
          ) : (
            chart.meta.subtitle
          )}
        </div>
      )}
      <div>
        <div className="alphatable">
          {alphabetTable.map((row, rowIndex) => (
            <div className="alpharow" key={rowIndex}>
              {row.map((abletter, letterIndex) => {
                const index = flatIndex(chart.cols, rowIndex, letterIndex);
                return (
                  <div
                    className={`alphacell ${
                      props.edit ? "edit-alphacell" : ""
                    }`}
                    key={letterIndex}
                    style={{ width: `${cellWidth}%` }}
                    data-selected={index === props.selectedIndex}
                    onClick={() =>
                      props.setSelectedIndex &&
                      props.setSelectedIndex(
                        props.selectedIndex === index ? -1 : index
                      )
                    }
                  >
                    <div className="letter">{abletter.forms.join(" ")}</div>

                    <div className="flex-space" />

                    <div>
                      {props.edit ? (
                        <ImageInput
                          alphabet={props.alphabet}
                          letter={abletter}
                          setImagePath={imagePath =>
                            updateLetter(index, { imagePath })
                          }
                        />
                      ) : (
                        <img
                          src={encodeURI(abletter.imagePath)}
                          alt={abletter.exampleWord}
                        />
                      )}
                    </div>
                    <div style={{ marginTop: "8px" }}>
                      {props.edit ? (
                        <input
                          type="text"
                          placeholder="Example Word"
                          value={abletter.exampleWord}
                          onChange={e =>
                            updateLetter(index, {
                              exampleWord: e.target.value
                            })
                          }
                          onClick={e => e.stopPropagation()}
                        />
                      ) : (
                        <div className="exampleWord">
                          {Array.from(abletter.exampleWord).map(
                            (char, index) => (
                              <span
                                key={index}
                                data-key-letter={abletter.forms.includes(char)}
                              >
                                {char}
                              </span>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {row.length < chart.cols && (
                <div
                  className="alphacell"
                  style={{
                    width: `${(chart.cols - row.length) * cellWidth}%`
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function clump<T>(list: T[], clumpsOf: number): T[][] {
  const empty: T[][] = [];
  return list.reduce((table, item, index) => {
    if (index % clumpsOf === 0) table.push([item]);
    else table[table.length - 1].push(item);
    return table;
  }, empty);
}

function flatIndex(cols: number, rowIndex: number, letterIndex: number) {
  return rowIndex * cols + letterIndex;
}
