import { Express } from "express";
import { apiPath } from "../../../client/src/api/Api";
import { UploadedFile } from "express-fileupload";
import fileUpload = require("express-fileupload");
import PDFDocument from "pdfkit";

export default function exportController(app: Express) {
  app.post(apiPath("/export/pdf"), fileUpload(), async (req, res) => {
    const imageFile = req.files!.image as UploadedFile;
    pdfForImage(imageFile.tempFilePath);
  });
}

function pdfForImage(imagePath: string) {
  const doc = new PDFDocument();
  doc.image(imagePath, { fit: [250, 300], align: "center", valign: "center" });
  doc.addPage();
}
