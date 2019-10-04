import fs from "fs";

export function mkdirSafe(dirPath: string) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath);
}
