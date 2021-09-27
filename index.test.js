const resolvePackagePath = require("./");
const path = require("path");

test("it works", () => {
  expect(resolvePackagePath("package-a")).toBe(
    path.join(__dirname, "node_modules", "package-a")
  );
  expect(resolvePackagePath("package-b")).toBe(
    path.join(__dirname, "node_modules", "package-b")
  );
  expect(resolvePackagePath("@scope/package-a")).toBe(
    path.join(__dirname, "node_modules", "@scope", "package-a")
  );
  expect(resolvePackagePath("@scope/package-b")).toBe(
    path.join(__dirname, "node_modules", "@scope", "package-b")
  );
});
