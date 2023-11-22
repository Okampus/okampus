interface ParsedFormData {
  [key: string]: ParsedFormData | FormDataEntryValue | FormDataEntryValue[] | ParsedFormData[];
}

export function parseFormData(formData: FormData): ParsedFormData {
  const result: ParsedFormData = {};
  for (const [key, value] of formData.entries()) setObjectValue(result, key, value);
  return result;
}

function setObjectValue(obj: ParsedFormData, key: string, value: string | File) {
  key = key.replaceAll(/\.(\d+)\./g, '[$1].');
  key = key.replaceAll(/\.(\d+)$/g, '[$1]');

  const keys = key.split('.');
  let currentObject = obj;

  for (const [index, keyPart] of keys.entries()) {
    const match = new RegExp(/\[(\d+)]/).exec(keyPart);

    if (match?.[1]) {
      const arrayKey = keyPart.slice(0, Math.max(0, keyPart.indexOf('[')));
      const arrayIndex = Number.parseInt(match[1]);

      const data = currentObject[arrayKey];
      const arr = Array.isArray(data) ? data : [];
      currentObject[arrayKey] = arr;

      const atIndex = arr[arrayIndex];
      if (index === keys.length - 1) {
        arr[arrayIndex] = value;
      } else if (typeof atIndex === 'object') {
        currentObject = atIndex;
      } else {
        const obj = {};
        arr[arrayIndex] = obj;
        currentObject = obj;
      }
    } else if (index === keys.length - 1) {
      currentObject[keyPart] = value;
    } else if (typeof currentObject[keyPart] !== 'object') {
      const obj = {};
      currentObject[keyPart] = obj;
      currentObject = obj;
    }
  }
}
