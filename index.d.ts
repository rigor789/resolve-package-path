type RequireResolveParams = Parameters<typeof require.resolve>;

/**
 * Resolve the path where "packageName" is installed
 * @param packageName
 * @param options
 */
function resolvePackagePath(
  packageName: string,
  options?: RequireResolveParams[1]
): string | false;

/**
 * Resolve the path of the package.json belonging to "packageName"
 * @param packageName
 * @param options
 */
function resolvePackageJSONPath(
  packageName: string,
  options?: RequireResolveParams[1]
): string | false;

export default resolvePackagePath;
export { resolvePackagePath, resolvePackageJSONPath };
