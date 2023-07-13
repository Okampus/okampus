export function toBase64(file: File): Promise<string | ArrayBuffer | null> {
  return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('load', () => resolve(reader.result));
    reader.addEventListener('onerror', (error) => reject(error));
  });
}
