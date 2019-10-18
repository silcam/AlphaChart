import React from "react";
import {
  Alphabet,
  AlphabetLetter,
  AlphabetChart,
  stylesFor
} from "../../models/Alphabet";
import ImageInput from "./ImageInput";
import update from "immutability-helper";
import WithLineBreaks from "../common/WithLineBreaks";
import ExampleWord from "./ExampleWord";
import AlphaFooter from "./AlphaFooter";

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

  return (
    <div className="compChart" id="compChart">
      <div className="alphaTitle" style={stylesFor(chart, "title")}>
        {props.edit ? (
          <input
            type="text"
            value={chart.meta.title || ""}
            onChange={e => updateMeta({ title: e.target.value })}
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
                      ) : abletter.imagePath ? (
                        <img
                          src={encodeURI(abletter.imagePath)}
                          alt={abletter.exampleWord}
                        />
                      ) : null}
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
                        <ExampleWord letter={abletter} />
                      )}
                    </div>
                  </div>
                );
              })}
              {row.length < chart.cols && (
                <div
                  className="alphacell lastRowFiller"
                  style={{
                    ...stylesFor(chart, "lastRowFiller"),
                    width: `${(chart.cols - row.length) * cellWidth}%`
                  }}
                >
                  {props.edit ? (
                    <textarea
                      value={chart.meta.lastRowFiller}
                      onChange={e =>
                        updateMeta({ lastRowFiller: e.target.value })
                      }
                      placeholder="Optional Footer"
                    />
                  ) : (
                    <WithLineBreaks text={chart.meta.lastRowFiller || ""} />
                  )}
                </div>
              )}
            </div>
          ))}
          {chart.letters.length % chart.cols === 0 &&
            (props.edit || chart.meta.lastRowFiller) && (
              <AlphaFooter
                edit={props.edit}
                text={chart.meta.lastRowFiller}
                setText={lastRowFiller => updateMeta({ lastRowFiller })}
                styles={stylesFor(chart, "lastRowFiller")}
              />
            )}
          {(props.edit || chart.meta.footer) && (
            <AlphaFooter
              edit={props.edit}
              text={chart.meta.footer}
              setText={footer => updateMeta({ footer })}
              styles={stylesFor(chart, "footer")}
            />
          )}
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
