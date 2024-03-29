const path = require("path");
const fs = require("fs");

const trailingPathSepRegExp = new RegExp(`\\${path.sep}+$`);

function resolvePackagePath(packageName, options) {
  const packageJSONPath = resolvePackageJSONPath(packageName, options);

  if (!packageJSONPath) {
    return undefined;
  }

  // normalize path to remove trailing path separators
  return packageJSONPath
    .replace("package.json", "")
    .replace(trailingPathSepRegExp, "");
}

function tryFindPackagePath(packageName, options) {
  try {
    // this can throw if the package doesn't have an exported main field
    return require.resolve(packageName, options);
  } catch (ignore) {}

  let paths;
  if (options && options.paths) {
    paths = options.paths;
  } else {
    paths = [process.cwd()];
  }

  for (const dir of paths) {
    try {
      const pathToCheck = path.resolve(dir, "node_modules", packageName);
      if (fs.existsSync(pathToCheck)) {
        return pathToCheck;
      }
    } catch (ignore) {
      // ignore
    }
  }
}

function resolvePackageJSONPath(packageName, options) {
  try {
    return require.resolve(`${packageName}/package.json`, options);
  } catch (ignore) {}

  try {
    // try find last index of node_modules/<packageName>
    const packageMainPath = tryFindPackagePath(packageName, options);

    if (!packageMainPath) {
      // we couldn't find the main path, so we likely won't find the package.json either.
      return undefined;
    }

    const searchWord = `node_modules${path.sep}${packageName.replace(
      "/",
      path.sep
    )}`;
    const foundIndex = packageMainPath.lastIndexOf(searchWord);

    if (foundIndex > -1) {
      const packagePath = packageMainPath.slice(
        0,
        foundIndex + searchWord.length
      );

      return path.join(packagePath, "package.json");
    }

    // fallback to fs traversal in case of linked packages not in node_modules
    let currentDir = path.dirname(packageMainPath);
    let possiblePackageJSONPath;
    while (true) {
      const packageJSONPath = path.join(currentDir, "package.json");

      if (fs.existsSync(packageJSONPath)) {
        try {
          const packageJSONContents = JSON.parse(
            fs.readFileSync(packageJSONPath)
          );

          if (packageJSONContents.name === packageName) {
            // we found the package.json path for <packageName> - bail
            return packageJSONPath;
          }
        } catch (ignore) {
          // invalid json? fail or return packageJSONPath?
        }

        // we mark this as a possible path but don't return. We'll use this if no other package.json is found...
        possiblePackageJSONPath = packageJSONPath;
      }

      const dir = path.dirname(currentDir);
      if (dir === currentDir) {
        // we've reached the fs root - break out of the loop
        break;
      }
      // otherwise keep the loop going with the parent dir.
      currentDir = dir;
    }

    // this is a last-resort package.json path that we found near the resolved package,
    // but did not match the packageName or was in an invalid json file
    if (possiblePackageJSONPath) {
      console.log("using possible package.json path", possiblePackageJSONPath);
      return possiblePackageJSONPath;
    }
  } catch (ignore) {}

  // package has not been found
  return undefined;
}

module.exports = resolvePackagePath;
module.exports.resolvePackagePath = resolvePackagePath;
module.exports.resolvePackageJSONPath = resolvePackageJSONPath;
