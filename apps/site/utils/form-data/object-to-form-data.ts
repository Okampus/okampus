import { isNonNullObject } from '@okampus/shared/utils';

function toString(value: unknown) {
  if (typeof value === 'string') return value;
  if (typeof value === 'bigint') return value.toString();
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  return JSON.stringify(value);
}

export function objectToFormData(obj: Record<string, unknown>, form?: FormData | undefined, namespace = '') {
  const formData = form || new FormData();
  let formKey;

  for (const property in obj) {
    formKey = namespace ? namespace + '.' + property : property;

    const value = obj[property];
    if (isNonNullObject(value) && !(value instanceof File || value instanceof Date)) {
      objectToFormData(value, formData, formKey);
    } else {
      formData.append(formKey, toString(value));
    }
  }

  return formData;
}
