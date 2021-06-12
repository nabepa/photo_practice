// package.json에서 "type": "module" 했을 때 만난 문제
// 1.
// import * as path from 'path'; 는 됐지만
// import * as path from 'path.js'; 는 에러...
// 2.
// console.log(__dirname) 등이 에러

const path = require('path');
const fs = require('fs');

function make_dir(dir) {
  !fs.existsSync(dir) && fs.mkdirSync(dir);
}

function classify_file(rootDir, oldNames) {
  const videoDir = path.join(rootDir, 'video');
  const capturedDir = path.join(rootDir, 'captured');
  const duplicatedDir = path.join(rootDir, 'duplicated');

  make_dir(videoDir);
  make_dir(capturedDir);
  make_dir(duplicatedDir);

  oldNames.forEach((oldName) => {
    const extension = path.extname(oldName);
    if (extension === '.mp4' || extension === '.mov') {
      const oldPath = path.join(rootDir, oldName);
      const newPath = path.join(videoDir, oldName);
      fs.promises.rename(oldPath, newPath);
    } else if (extension === '.png' || extension === '.aae') {
      const oldPath = path.join(rootDir, oldName);
      const newPath = path.join(capturedDir, oldName);
      fs.promises.rename(oldPath, newPath);
    } else if (extension === '.jpg') {
      if (!oldName.startsWith('IMG_E')) {
        return;
      }
      const originalName = oldName.replace('_E', '_');
      if (!fs.existsSync(path.join(rootDir, originalName))) {
        return;
      }
      const oldPath = path.join(rootDir, originalName);
      const newPath = path.join(duplicatedDir, originalName);
      fs.promises.rename(oldPath, newPath);
    } else if (extension === '') {
      // pass
    } else {
      console.error(`${oldName} have undefined extension`);
      return;
    }
  });
}

const rootDir = path.join(__dirname, process.argv[2]);
if (!fs.existsSync(rootDir)) {
  console.error(`${rootDir} is not founded`);
  return;
}

fs.promises //
  .readdir(rootDir)
  .then((oldNames) => {
    classify_file(rootDir, oldNames);
  })
  .catch(console.error);
