# resolve-package-path

Small utility (no external dependencies) for finding the path of a package across different node versions.

The reason this exists is because `require.resolve("<packageName>/package.json")` can fail if a package defines `exports` in their `package.json` and does not include `package.json`.

Some details on the issue can be found here: https://github.com/nodejs/node/issues/33460

This package works around the issue by:
1. first trying a regular `require.resolve("<packageName>/package.json")`
2. then falling back to `require.resolve("<packageName>")` and finding the last index of `node_modules/<packageName>`
3. finally falls back to the same `require.resolve("<packageName>")` and a filesystem traversal upwards until a matching package.json is found
4. if the package is not found, returns `false`

# API

## resolvePackagePath(packageName, options = {})

Resolves the package path. Options accepts anything that `require.resovle("", options)` accepts. [See Node Docs](https://nodejs.org/api/modules.html#modules_require_resolve_request_options)

Example:

```js
const { resolvePackagePath } = require("resolve-package-path");

console.log(resolvePackagePath('package-a'))         // /path/to/package-a
console.log(resolvePackagePath('@scoped/package-a')) // /path/to/@scoped/package-a
```

## resolvePackageJSONPath(packageName, options = {})

Same as `resolvePackagePath` but returns the path to the `package.json` instead.

Example:

```js
const { resolvePackageJSONPath } = require("resolve-package-path");

console.log(resolvePackageJSONPath('package-a'))         // /path/to/package-a/package.json
console.log(resolvePackageJSONPath('@scoped/package-a')) // /path/to/@scoped/package-a/package.json
```

# License

MIT