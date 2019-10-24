import React, { useState, useEffect, useContext } from "react";
import htmlToImage, { OptionsType } from "html-to-image";
import { saveAs } from "file-saver";
import OptionButton from "../common/OptionButton";
import { ChartDimens } from "./ViewChartPage";
import ErrorContext from "../common/ErrorContext";
import ColorInput from "../common/ColorInput";

const CHART_ID = "compChart";
const DEFAULT_FONT_SIZE = 16;

interface IProps {
  setChartDimens: (d: ChartDimens | null) => void;
}

export default function ChartToImage(props: IProps) {
  const { setErrorMessage } = useContext(ErrorContext);
  return (
    <div>
      <OptionButton
        onMainClick={() => {
          try {
            makeImage();
          } catch (err) {
            setErrorMessage(err);
          }
        }}
        buttonText="Save Chart Image"
        renderContextMenu={({ hideMenu }) => (
          <OptionsMenu
            hideMenu={hideMenu}
            setChartDimens={props.setChartDimens}
          />
        )}
      />
    </div>
  );
}

interface IOptionsMenuProps extends IProps {
  hideMenu: () => void;
}

function OptionsMenu(props: IOptionsMenuProps) {
  const chartNode = document.getElementById(CHART_ID);
  const chartNodeDimensions = chartNode
    ? [chartNode.offsetWidth, chartNode.offsetHeight]
    : [0, 0]; // The node should always exist
  const [originalDimensions] = useState(chartNodeDimensions);
  const [dimensions, setDimensions] = useState(chartNodeDimensions);
  const setChartDimensions = (width: number, height: number) => {
    setDimensions([width, height]);
    if (width > 0)
      props.setChartDimens({
        width,
        fontSize: (DEFAULT_FONT_SIZE * width) / originalDimensions[0]
      });
  };
  const setWidth = (w: string) => {
    const width = parseInt(w) || 0;
    const height = (width * originalDimensions[1]) / originalDimensions[0];
    setChartDimensions(width, height);
  };
  const setHeight = (h: string) => {
    const height = parseInt(h) || 0;
    const width = (height * originalDimensions[0]) / originalDimensions[1];
    setChartDimensions(width, height);
  };
  useEffect(() => {
    // Restore chart dimensions on unmount
    return () => {
      props.setChartDimens(null);
    };
    // eslint-disable-next-line
  }, []);
  const [bgColor, setBGColor] = useState("#ffffff");
  const [bgColorValid, setBGColorValid] = useState(true);
  const [enableBGColor, setEnableBGColor] = useState(true);
  const inputValid = !!dimensions[0] && (!enableBGColor || bgColorValid);
  const [saving, setSaving] = useState(false);
  const { setErrorMessage } = useContext(ErrorContext);

  return (
    <div className="compChartToImageOptionsMenu">
      <div className="optMenuHeader">Image Options</div>
      <table>
        <tbody>
          <tr>
            <td>
              <label>Width:</label>
            </td>
            <td>
              <input
                type="text"
                value={Math.round(dimensions[0]) || ""}
                onChange={e => setWidth(e.target.value)}
                size={5}
              />
            </td>
          </tr>
          <tr>
            <td>
              <label>Height:</label>
            </td>
            <td>
              <input
                type="text"
                value={Math.round(dimensions[1]) || ""}
                onChange={e => setHeight(e.target.value)}
                size={5}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div className="bgColor">
        <label>Background Color:</label>
        <div data-disabled={!enableBGColor} className="flex-row">
          <input
            type="checkbox"
            checked={enableBGColor}
            onChange={e => setEnableBGColor(e.target.checked)}
          />
          {enableBGColor && (
            <ColorInput
              color={bgColor}
              setColor={setBGColor}
              setInputValid={setBGColorValid}
            />
          )}
        </div>
      </div>
      <div className="buttonRow">
        <button
          disabled={!inputValid || saving}
          onClick={async () => {
            setSaving(true);
            try {
              await makeImage({
                backgroundColor: enableBGColor ? bgColor : undefined
              });
            } catch (err) {
              setErrorMessage(err);
            }
            setSaving(false);
          }}
        >
          {saving ? "Saving..." : "Save"}
        </button>
        <button onClick={props.hideMenu}>Cancel</button>
      </div>
    </div>
  );
}

async function makeImage(opts: OptionsType = { backgroundColor: "#ffffff" }) {
  try {
    const chartNode = document.getElementById(CHART_ID);
    if (!chartNode) throw new Error("No chart found in makeImage()!");
    const dataUrl = await htmlToImage.toPng(chartNode, opts);
    saveAs(dataUrl, "chart.png");
  } catch (err) {
    console.error(err);
    throw "There was a problem creating that chart.";
  }
}
