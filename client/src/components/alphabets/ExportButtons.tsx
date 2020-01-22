import React, { useState } from "react";
import { PageDims, Dims, pageInPixels } from "./PageDims";
import { useTranslation } from "../common/useTranslation";
import Axios from "axios";
import { apiPath } from "../../api/Api";
import { saveAs } from "file-saver";
import ProgressBar from "../common/ProgressBar";

interface IProps {
  transparentBG: boolean;
  pageDims: PageDims;
  actChartDims: Dims;
  done: () => void;
}

type UpdateProgress = (progressEvent: ProgressEvent) => void;

export default function ExportButtons(props: IProps) {
  const t = useTranslation();

  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const updateProgress: UpdateProgress = e => {
    if (!e.lengthComputable) setProgress(0);
    setProgress((100 * e.loaded) / e.total);
  };

  const exportImage = async () => {
    setExporting(true);
    setProgress(0);
    await makeImage(props.transparentBG, updateProgress);
    setExporting(false);
  };
  const exportPdf = async () => {
    setExporting(true);
    setProgress(0);
    await makePDF(props.pageDims, props.actChartDims, updateProgress);
    setExporting(false);
  };

  return (
    <div className="space-kids">
      {exporting ? (
        <React.Fragment>
          <label style={{ fontSize: "larger" }}>{t("Saving")}</label>
          <ProgressBar progress={progress} indeterminate={progress === 0} />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <button className="big" onClick={exportImage}>
            {t("Save_image")}
          </button>
          <button className="big" onClick={exportPdf}>
            {t("Save_pdf")}
          </button>
        </React.Fragment>
      )}

      <button className="big" onClick={props.done}>
        {t("Done")}
      </button>
    </div>
  );
}

async function makeImage(
  transparentBG: boolean,
  updateProgress: UpdateProgress
) {
  const html = document.getElementById("chartToExport")!.outerHTML;
  const response = await Axios.post(
    apiPath("/export/image"),
    { html, transparentBG },
    {
      responseType: "blob",
      onDownloadProgress: e => updateProgress(e)
    }
  );
  saveAs(new Blob([response.data]), "chart.png");
}

async function makePDF(
  pageDims: PageDims,
  imageDims: Dims,
  updateProgress: UpdateProgress
) {
  const html = document.getElementById("chartToExport")!.outerHTML;
  const response = await Axios.post(
    apiPath("/export/pdf"),
    { html, pageDims: pageInPixels(pageDims), imageDims },
    {
      responseType: "blob",
      onDownloadProgress: e => updateProgress(e)
    }
  );
  saveAs(new Blob([response.data]), "chart.pdf");
}
