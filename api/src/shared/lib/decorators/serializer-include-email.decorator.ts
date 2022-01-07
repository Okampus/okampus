import { applyDecorators, SerializeOptions } from '@nestjs/common';
import { EMAIL_INCLUDED } from '../constants';

export function SerializerIncludeEmail(): ClassDecorator {
  return applyDecorators(SerializeOptions({ groups: [EMAIL_INCLUDED] }));
}
