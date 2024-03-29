type RequireResolveParams = Parameters<typeof require.resolve>;

/**
 * Resolve the path where "packageName" is installed
 * @param packageName
 * @param options
 */
export function resolvePackagePath(
  packageName: string,
  options?: RequireResolveParams[1]
): string | undefined;

/**
 * Resolve the path of the package.json belonging to "packageName"
 * @param packageName
 * @param options
 */
export function resolvePackageJSONPath(
  packageName: string,
  options?: RequireResolveParams[1]
): string | undefined;

export default resolvePackagePath;
