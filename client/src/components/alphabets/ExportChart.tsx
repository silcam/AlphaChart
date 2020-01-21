import React, { useEffect, useState } from "react";
import { Alphabet } from "../../models/Alphabet";
import { useTranslation } from "../common/useTranslation";
import Chart from "./Chart";
import LnkBtn from "../common/LnkBtn";
import NumberPicker from "../common/NumberPicker";
import {
  setVerticalImagePadding,
  completeStyles,
  setHorizontalImagePadding
} from "../../models/ChartStyles";
import ExportChartDims from "./ExportChartDims";
import ColorInput from "../common/ColorInput";
import { saveAs } from "file-saver";
import {
  defaultPageDims,
  Dims,
  contentInPixels,
  PageDims,
  pageInPixels
} from "./PageDims";
import TargetDimsPicker from "./TargetDimsPicker";
import { inTolerance } from "../../util/numberUtils";
import update from "immutability-helper";
import { apiPath } from "../../api/Api";
import Axios from "axios";

interface IProps {
  alphabet: Alphabet;
  done: () => void;
}

export default function ExportChart(props: IProps) {
  const t = useTranslation();

  const [settingPageDims, setSettingPageDims] = useState(true);
  const [pageDims, setPageDims] = useState(defaultPageDims());
  const targetDims = contentInPixels(pageDims);

  const [actChartDims, setActChartDims] = useState<Dims>([1, 1]);
  const [previewScale, setPreviewScale] = useState(1);
  const [chartScale, setChartScale] = useState(1);

  const [cols, setCols] = useState(props.alphabet.chart.cols);
  const [baseFont, setBaseFont] = useState(16);
  const [vSpace, setVSpace] = useState(0);
  const [hSpace, setHSpace] = useState(0);
  const [transparentBG, setTransparentBG] = useState(false);
  const [bgColor, setBGColor] = useState("#ffffff");

  const chart = update(props.alphabet.chart, {
    $merge: {
      cols,
      styles: setHorizontalImagePadding(
        setVerticalImagePadding(
          completeStyles(props.alphabet.chart.styles),
          vSpace
        ),
        hSpace
      )
    }
  });

  const [exportingImage, setExportingImage] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const exportImage = async () => {
    setExportingImage(true);
    await makeImage(transparentBG);
    setExportingImage(false);
  };
  const exportPdf = async () => {
    setExportingPdf(true);
    await makePDF(pageDims, actChartDims);
    setExportingPdf(false);
  };

  const rescale = () => {
    scale(
      nodeDims("previewWindow"),
      nodeDims("chartToPreview"),
      previewScale,
      setPreviewScale
    );
    scale(targetDims, nodeDims("chartToExport"), chartScale, setChartScale);
  };

  useEffect(() => {
    document.addEventListener("readystatechange", rescale);
    window.addEventListener("resize", rescale);
    return () => {
      document.removeEventListener("readystatechange", rescale);
      window.removeEventListener("resize", rescale);
    };
  });

  useEffect(() => {
    rescale();
  });

  useEffect(() => {
    const newActChartDims = nodeDims("chartToExport");
    if (!newActChartDims.every((val, i) => val === actChartDims[i]))
      setActChartDims(newActChartDims as Dims);
  });

  return (
    <div className="compExportChart">
      <div className="controls">
        <h3>{t("Export_chart")}</h3>
        {settingPageDims ? (
          <div>
            <TargetDimsPicker value={pageDims} setValue={setPageDims} />
            <button onClick={() => setSettingPageDims(false)}>{t("Ok")}</button>
            <button onClick={props.done}>{t("Cancel")}</button>
          </div>
        ) : (
          <div className="space-kids">
            <LnkBtn
              onClick={() => setSettingPageDims(true)}
              text={`< ${t("Paper_options")}`}
            />
            <ExportChartDims
              targetDims={targetDims}
              fittedChartDims={actChartDims}
            />
            <div>
              <label>{t("Columns")}</label>
              <NumberPicker value={cols} setValue={setCols} />
            </div>
            <div>
              <label>{t("Text_size")}</label>
              <NumberPicker value={baseFont} setValue={setBaseFont} />
            </div>
            <div>
              <label>{t("Extra_vertical_space")}</label>
              <NumberPicker value={vSpace} setValue={setVSpace} minimum={0} />
            </div>
            <div>
              <label>{t("Extra_horizontal_space")} </label>
              <NumberPicker value={hSpace} setValue={setHSpace} minimum={0} />
            </div>
            <div>
              <label>{t("Background_color")} </label>
              {!transparentBG && (
                <ColorInput color={bgColor} setColor={setBGColor} />
              )}
              <label>
                <input
                  type="checkbox"
                  checked={transparentBG}
                  onChange={e => setTransparentBG(e.target.checked)}
                />
                {t("Transparent")}
              </label>
            </div>

            <button
              className="big"
              onClick={exportImage}
              disabled={exportingImage || exportingPdf}
            >
              {exportingImage ? t("Saving") : t("Save_image")}
            </button>
            <button
              className="big"
              onClick={exportPdf}
              disabled={exportingImage || exportingPdf}
            >
              {exportingPdf ? t("Saving") : t("Save_pdf")}
            </button>

            <button className="big" onClick={props.done}>
              {t("Done")}
            </button>
          </div>
        )}
      </div>

      <div className="preview" id="previewWindow">
        <div
          id="chartToPreview"
          style={chartContainerStyles(
            previewScale,
            baseFont,
            transparentBG ? "#999" : bgColor
          )}
        >
          <Chart alphabet={props.alphabet} chart={chart} setChart={() => {}} />
        </div>
      </div>

      <div style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: "100%" }}>
          <div
            id="chartToExport"
            style={chartContainerStyles(
              chartScale,
              baseFont,
              transparentBG ? null : bgColor
            )}
          >
            <Chart
              alphabet={props.alphabet}
              chart={chart}
              setChart={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function chartContainerStyles(
  scale: number,
  baseFont: number,
  bgColor: string | null
) {
  return {
    fontSize: `${baseFont * scale}px`,
    width: `${800 * scale}px`,
    margin: "0 auto",
    backgroundColor: bgColor ? bgColor : undefined
  };
}

function scale(
  targetDims: Dims,
  actDims: Dims,
  currentScale: number,
  setScale: (s: number) => void
) {
  const scale = targetDims[1] / actDims[1];
  const maxScale = targetDims[0] / 800;
  const finalScale = Math.min(maxScale, scale * currentScale);
  if (needToRescale(currentScale, finalScale, targetDims, actDims))
    setScale(finalScale);
}

function needToRescale(
  oldScale: number,
  newScale: number,
  targetDims: Dims,
  actDims: Dims
) {
  return (
    targetDims.some((tDim, i) => actDims[i] > tDim) ||
    !inTolerance(oldScale, newScale, 0.02)
  );
}

function nodeDims(id: string): Dims {
  const node = document.getElementById(id);
  return node ? [node.offsetWidth, node.offsetHeight] : [1, 1];
}

async function makeImage(transparentBG: boolean) {
  const html = document.getElementById("chartToExport")!.outerHTML;
  const response = await Axios.post(
    apiPath("/export/image"),
    { html, transparentBG },
    {
      responseType: "blob"
    }
  );
  saveAs(new Blob([response.data]), "chart.png");
}

async function makePDF(pageDims: PageDims, imageDims: Dims) {
  const html = document.getElementById("chartToExport")!.outerHTML;
  const response = await Axios.post(
    apiPath("/export/pdf"),
    { html, pageDims: pageInPixels(pageDims), imageDims },
    { responseType: "blob" }
  );
  saveAs(new Blob([response.data]), "chart.pdf");
}
