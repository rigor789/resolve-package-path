const { resolvePackagePath } = require("./");

const packages = [
  "package-a",
  "package-b",
  "package-c",
  "@scope/package-a",
  "@scope/package-b",
  "@scope/package-c",
  "nonexistent",
];

packages.map((package) => {
  console.log(
    "> " +
      package +
      " has been resolved to:\n\t" +
      resolvePackagePath(package) +
      "\n\n"
  );
});
