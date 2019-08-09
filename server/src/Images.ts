import { UploadedFile } from "express-fileupload";
import { mkdirSafe } from "./fsUtils";
import path from "path";

async function save(id: string, file: UploadedFile) {
  const publicPath = path.join(process.cwd(), "client", "public");
  const dirPath = path.join("images", id);
  mkdirSafe(path.join(publicPath, dirPath));
  const filePath = path.join(dirPath, file.name);
  await file.mv(path.join(publicPath, filePath));
  return `/images/${id}/${file.name}`;
}

export default {
  save
};
