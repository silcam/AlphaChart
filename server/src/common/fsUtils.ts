import fs from "fs";
import path from "path";

export function mkdirSafe(dirPath: string) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { mode: 0o755 });
}

interface Options {
  keepRoot?: boolean;
}

export function unlinkRecursive(filepath: string, opt: Options = {}) {
  // console.log(`Unlink ${filepath}`);
  if (fs.existsSync(filepath)) {
    if (fs.statSync(filepath).isDirectory()) {
      fs.readdirSync(filepath).forEach(filename => {
        unlinkRecursive(path.join(filepath, filename));
      });
      if (!opt.keepRoot) fs.rmdirSync(filepath);
    } else {
      fs.unlinkSync(filepath);
    }
  }
}
