const path = require("path");
const fs = require("fs");

const trailingPathSepRegExp = new RegExp(`\\${path.sep}$`);

function resolvePackagePath(packageName, options = {}) {
  const packageJSONPath = resolvePackageJSONPath(packageName, options)

  if(!packageJSONPath) {
    return false
  }

  return packageJSONPath
    .replace("package.json", "")
    .replace(trailingPathSepRegExp, "");
}

function resolvePackageJSONPath(packageName, options = {}) {
  let packageJSONPath;

  try {
    packageJSONPath = require.resolve(`${packageName}/package.json`);
  } catch (err) {
  }

  // try find last index of node_modules/<packageName>
  if (!packageJSONPath) {
    try {
      const packageMainPath = require.resolve(`${packageName}`);
      const searchWord = `node_modules${path.sep}${packageName.replace(
        "/",
        path.sep
      )}`;
      const foundIndex = packageMainPath.lastIndexOf(searchWord);

      if (foundIndex > -1) {
        console.log('here?', foundIndex, packageMainPath)
        const packagePath = packageMainPath.substr(
          0,
          foundIndex + searchWord.length
        );

        packageJSONPath = path.join(packagePath, "package.json");
      } else {
        // fallback to fs traversal in case of linked packages not in node_modules
        console.log('fallback to fs traversal - SLOW.')
        let currentDir = path.dirname(packageMainPath)
        while (true) {
          const _packageJSONPath = path.join(currentDir, 'package.json')
          if(fs.existsSync(_packageJSONPath)) {
            packageJSONPath = _packageJSONPath;
            break;
          }
          const dir = path.dirname(currentDir);
          if(dir === currentDir) {
            // we've reached the fs root - break out of the loop
            break;
          }
          // otherwise keep the loop going with the parent dir.
          currentDir = dir;
        }
      }
    } catch (err) {
      console.log("second catch", err);
    }
  }
  
  return packageJSONPath;
}

module.exports = resolvePackagePath;
