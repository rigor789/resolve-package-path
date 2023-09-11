const { resolvePackagePath } = require("./");

const path = require("path");

const nodeMajorVersion = +process.versions.node.split(".")[0];

const expectedPath = (packageName, dir) => {
  if (dir) {
    return path.resolve(__dirname, dir, packageName);
  }
  switch (process.env.PACKAGE_MANAGER) {
    case "yarn":
      return path.resolve(__dirname, "node_modules", packageName);
    case "pnpm":
    case "npm":
    default:
      return path.resolve(__dirname, "stubs", packageName);
  }
};

const tests = [
  {
    packageName: "package-a",
    expectedPath: expectedPath("package-a"),
  },
  {
    packageName: "package-alias",
    expectedPath: true,
    skip: nodeMajorVersion < 14,
  },
  {
    packageName: "package-b",
    expectedPath: expectedPath("package-b"),
  },
  {
    packageName: "package-c",
    expectedPath: expectedPath("package-c"),
  },
  {
    packageName: "package-no-main-exports",
    expectedPath: expectedPath("package-no-main-exports", "node_modules"),
  },
  {
    packageName: "@scope/package-a",
    expectedPath: expectedPath("@scope/package-a"),
  },
  {
    packageName: "@scope/package-b",
    expectedPath: expectedPath("@scope/package-b"),
  },
  {
    packageName: "@scope/package-c",
    expectedPath: expectedPath("@scope/package-c"),
  },
  {
    packageName: "nonexistent",
    expectedPath: undefined,
  },
];

tests.map((test) => {
  if (test.skip) {
    console.log("SKIPPED", test.packageName);
    console.log("\n");
    return;
  }

  const packagePath = resolvePackagePath(test.packageName);
  console.log(
    test.packageName + " has been resolved to:\n\t" + packagePath + "\n"
  );

  if (
    (test.expectedPath === true && packagePath != undefined) ||
    test.expectedPath === packagePath
  ) {
    console.log("OK");
  } else {
    console.error("FAIL");
    if (test.expectedPath === true) {
      console.error(`\nExpected \n\t"${packagePath}" \nto be truthy.`);
    } else {
      console.error(
        `\nExpected \n\t"${packagePath}" \nto equal \n\t"${test.expectedPath}"`
      );
    }

    // set process to a failed exit code
    process.exitCode = 1;
  }

  console.log("\n");
});
