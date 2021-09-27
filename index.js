const path = require("path");

const trailingPathSepRegExp = new RegExp(`\\${path.sep}$`);

function resolvePackagePath(packageName, options = {}) {
  return resolvePackageJSONPath(packageName, options)
    .replace("package.json", "")
    .replace(trailingPathSepRegExp, "");
}

function resolvePackageJSONPath(packageName, options = {}) {
  let packageJSONPath;

  try {
    packageJSONPath = require.resolve(`${packageName}/package.json`);
  } catch (err) {
    console.log("first catch", err);
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

      if (foundIndex) {
        const packagePath = packageMainPath.substr(
          0,
          foundIndex + searchWord.length
        );

        packageJSONPath = path.join(packagePath, "package.json");
      }
    } catch (err) {
      console.log("second catch", err);
    }
  }

  // fallback to fs traversal in case of linked packages not in node_modules

  return packageJSONPath;
}

module.exports = resolvePackagePath;
