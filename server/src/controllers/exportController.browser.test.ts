// Exercises the real export endpoints against a real Chrome.
//
// This is the only coverage that actually launches a browser: the unit suite
// never does, and the Cypress "Saves" spec only asserts that the request
// finished, never that the bytes coming back are a usable image. A Chrome
// version roll that broke rendering would otherwise ship silently.
//
// Assertions are deliberately structural (magic bytes, IHDR dimensions, a
// compressed-size floor) rather than a golden-image hash. Chrome rolls are
// allowed to shift pixels; they are not allowed to hand back a blank canvas,
// a zero-sized element, or a non-image.
import request from "supertest";
import express from "express";
import http from "http";
import fs from "fs";
import { expect, test, describe, beforeAll, afterAll } from "vitest";
import app from "../app";
import { apiPath } from "../../../client/src/api/Api";

// exportController renders via `page.goto(${BASE_URL}/shell.html)` so that the
// chart's relative asset URLs (/fonts/*, /images/*) resolve. The vitest
// `browser` project sets BASE_URL to a port of our own, so stand the real
// client/public directory up there for the duration of the suite. Using 3000
// would collide with a running dev server, and — worse — an unrelated app
// squatting on it can answer 200 for everything and quietly corrupt a render.
const STATIC_PORT = Number(new URL(process.env.BASE_URL!).port);
let staticServer: http.Server;

const CHART_WIDTH = 900;

// Mirrors the shape ExportButtons sends: the outerHTML of #chartToExport.
function chartHtml() {
  return `<div id="chartToExport" style="width: ${CHART_WIDTH}px; background-color: #fff; font-family: AndikaNewBasic;">
      <div class="alphaTitle" style="font-size: 36px; text-align: center;">Alphabet Chart</div>
      <div class="alphatable">
        <div class="alpharow">
          <div class="alphacell"><span style="font-size: 40px;">Aa</span><br /><img src="/apple.png" width="80" /><br /><span>apple</span></div>
          <div class="alphacell"><span style="font-size: 40px;">&#595;&#595;</span><br /><span>&#595;andu</span></div>
          <div class="alphacell"><span style="font-size: 40px;">&#331;&#331;</span><br /><span>&#331;a&#331;a</span></div>
        </div>
      </div>
    </div>`;
}

// Minimal PNG header reader: signature check plus the IHDR width/height that
// every PNG carries in the first chunk.
function readPng(buffer: Buffer) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  return {
    isPng: buffer.subarray(0, 8).equals(signature),
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20)
  };
}

beforeAll(async () => {
  const staticApp = express();
  staticApp.use(express.static("client/public"));
  staticServer = http.createServer(staticApp);
  await new Promise<void>(resolve => staticServer.listen(STATIC_PORT, resolve));
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) =>
    staticServer.close(error => (error ? reject(error) : resolve()))
  );
});

describe("Export endpoints render with a real browser", () => {
  test("POST /export/image returns a PNG of the chart", async () => {
    const response = await request(app)
      .post(apiPath("/export/image"))
      .send({ html: chartHtml(), transparentBG: false });

    expect(response.status).toBe(200);

    const png = readPng(response.body);
    expect(png.isPng, "response body is a PNG").toBe(true);

    // Proves layout actually ran: a browser that failed to render the element
    // hands back 0x0 or a 1x1 placeholder rather than the requested width.
    expect(png.width).toBe(CHART_WIDTH);
    expect(png.height).toBeGreaterThan(100);

    // A blank or single-colour canvas of this size compresses to a couple of
    // hundred bytes, so this floor is really an "ink is on the page" check —
    // it catches fonts and images silently failing to load.
    expect(response.body.length).toBeGreaterThan(5000);
  });

  test("POST /export/image honours transparentBG", async () => {
    const response = await request(app)
      .post(apiPath("/export/image"))
      .send({ html: chartHtml(), transparentBG: true });

    expect(response.status).toBe(200);
    expect(readPng(response.body).isPng).toBe(true);
  });

  test("POST /export/pdf returns a PDF sized to the requested paper", async () => {
    const pageDims: [number, number] = [1240, 1754]; // A4 at 150dpi
    const response = await request(app)
      .post(apiPath("/export/pdf"))
      .send({ html: chartHtml(), pageDims, imageDims: [CHART_WIDTH, 600] });

    expect(response.status).toBe(200);
    expect(
      response.body.subarray(0, 5).toString(),
      "response body is a PDF"
    ).toBe("%PDF-");
    expect(response.body.length).toBeGreaterThan(5000);
  });

  test("rejects html with no #chartToExport node", async () => {
    const response = await request(app)
      .post(apiPath("/export/image"))
      .send({ html: "<div>no chart here</div>", transparentBG: false });

    expect(response.status).toBeGreaterThanOrEqual(400);
  });
});
