export function replaceExtension(path: string, newExtension: string) {
  const pathParts = path.split('.');
  pathParts.pop();
  pathParts.push(newExtension);
  return pathParts.join('.');
}
