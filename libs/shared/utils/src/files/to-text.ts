export function toText(file: File) {
  return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
    const blob = file.slice(0, file.size, file.type);
    return blob.text().then(resolve).catch(reject);
  });
}
