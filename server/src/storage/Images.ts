import { UploadedFile } from "express-fileupload";
import { mkdirSafe } from "../common/fsUtils";
import path from "path";
// import { fs as testFs } from "memfs";

async function save(id: string, file: UploadedFile) {
  const publicPath = path.join(process.cwd(), "client", "public");
  const dirPath = path.join("images", id);
  const filename = `${Date.now().valueOf()}${path.extname(file.name)}`;
  const filePath = path.join(dirPath, filename);

  if (process.env.NODE_ENV === "test") {
    // Use memfs for testing ... in the future maybe
    // for now, just don't save images
    // testFs.writeFileSync(path.join(publicPath, filePath), file.data);
  } else {
    mkdirSafe(path.join(publicPath, dirPath));
    await file.mv(path.join(publicPath, filePath));
  }
  return `/images/${id}/${filename}`;
}

export default {
  save
};
