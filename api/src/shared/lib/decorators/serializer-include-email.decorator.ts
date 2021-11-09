import { applyDecorators, SerializeOptions } from '@nestjs/common';
import { EMAIL_INCLUDED } from '../constants';

// eslint-disable-next-line @typescript-eslint/naming-convention
export function SerializerIncludeEmail(): ClassDecorator {
  return applyDecorators(SerializeOptions({ groups: [EMAIL_INCLUDED] }));
}
