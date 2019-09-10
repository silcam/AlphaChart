import React from "react";
import htmlToImage from "html-to-image";
// import download from "download";
import { saveAs } from "file-saver";

export default function ChartToImage() {
  return (
    <div>
      <button onClick={makeImage}>Save Chart Image</button>
    </div>
  );
}

async function makeImage() {
  try {
    const chartNode = document.getElementById("chart");
    if (!chartNode) throw "No chart found in makeImage()!";
    const dataUrl = await htmlToImage.toPng(chartNode, {
      backgroundColor: "#fff"
    });
    saveAs(dataUrl, "chart.png");
  } catch (err) {
    console.error(err);
  }
}
