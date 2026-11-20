// Shudhu nijer site er path allow kori ("/services/1"), onno site e pathano jabe na
export function getSafeRedirect(path) {
  if (!path) return null;
  if (!path.startsWith("/") || path.startsWith("//")) return null;
  return path;
}