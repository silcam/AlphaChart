const fs = require("fs");

const srcImagesPath = "cypress/fixtures/images";
const targetImagesPath = "client/public/images";

if (!fs.existsSync(targetImagesPath)) fs.mkdirSync(targetImagesPath);

const folderNames = fs.readdirSync(srcImagesPath);
folderNames.forEach(folderName => {
  const srcPath = `${srcImagesPath}/${folderName}`;
  const targetPath = `${targetImagesPath}/${folderName}`;
  if (!fs.existsSync(targetPath)) fs.mkdirSync(targetPath);
  const toDelete = fs.readdirSync(targetPath);
  toDelete.forEach(deleteMe => fs.unlinkSync(`${targetPath}/${deleteMe}`));
  const toCopy = fs.readdirSync(srcPath);
  toCopy.forEach(copyMe =>
    fs.copyFileSync(`${srcPath}/${copyMe}`, `${targetPath}/${copyMe}`)
  );
});
