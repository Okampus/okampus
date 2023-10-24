import type { FormSchema } from '@okampus/shared/types';
import type { JsonValue } from '@prisma/client/runtime/library';

// TODO
export function isFormSchema(formSchema: JsonValue): formSchema is FormSchema {
  return Array.isArray(formSchema);
}
