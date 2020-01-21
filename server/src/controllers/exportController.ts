import { Express } from "express";
import { apiPath } from "../../../client/src/api/Api";
import PDFDocument from "pdfkit";
import puppeteer, { Page } from "puppeteer";
import fs from "fs";

const TMP_EXPORT_DIR = "tmp/export";

export default function exportController(app: Express, baseURL: string) {
  app.post(apiPath("/export/image"), async (req, res) => {
    const html: string = req.body.html;
    const transparentBG: boolean = req.body.transparentBG;
    const imagePath = await saveImage(baseURL, html, transparentBG);
    res.sendFile(imagePath);

    cleanTmpExportDir();
  });

  app.post(apiPath("/export/pdf"), async (req, res) => {
    const html: string = req.body.html;
    const pageDims: [number, number] = req.body.pageDims;
    const imageDims: [number, number] = req.body.imageDims;

    const imagePath = await saveImage(baseURL, html);
    const pdfPath = imagePath.replace(/png$/, "pdf");

    const doc = new PDFDocument({ size: pageDims });
    const stream = doc.pipe(fs.createWriteStream(pdfPath));

    const imageXY = [0, 1].map(i => (pageDims[i] - imageDims[i]) / 2);
    doc.image(imagePath, imageXY[0], imageXY[1]);
    doc.end();

    stream.on("close", () => {
      res.sendFile(pdfPath);
    });

    cleanTmpExportDir();
  });
}

async function saveImage(
  baseURL: string,
  html: string,
  transparentBG: boolean = false
) {
  const outfile = `${TMP_EXPORT_DIR}/${new Date().valueOf()}.png`;
  await chartBrowserPage(baseURL, html, async page => {
    const element = await page.$("#chartToExport");
    if (!element) throw "Failed to find chart node in submitted html!";
    await element.screenshot({ path: outfile, omitBackground: transparentBG });
  });
  const absPath = `${process.cwd()}/${outfile}`;
  return absPath;
}

async function chartBrowserPage(
  baseURL: string,
  html: string,
  cb: (page: Page) => Promise<void>
) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(`${baseURL}/shell.html`);
  await page.setContent(wrapHtml(html));

  await cb(page);

  browser.close();
}

function wrapHtml(html: string) {
  return `<html><head>${styleElement()}</head><body>${html}</body></html>`;
}

function styleElement() {
  const filenames = ["alphatable.css", "index.css", "components.css"];
  const cssDirPath = "client/src/";
  const css = filenames
    .map(filename => fs.readFileSync(cssDirPath + filename).toString())
    .join("\n");
  return `<style>${css}</style>`;
}

function cleanTmpExportDir() {
  const old = new Date().valueOf() - 1000 * 60 * 60 * 24;
  const filenames = fs.readdirSync(TMP_EXPORT_DIR);
  filenames.forEach(filename => {
    if (parseInt(filename) < old)
      fs.unlink(`${TMP_EXPORT_DIR}/${filename}`, () => {});
  });
}
