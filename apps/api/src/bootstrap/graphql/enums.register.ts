import * as enums from '@okampus/shared/enums';
import { registerEnumType } from '@nestjs/graphql';

for (const [key, value] of Object.entries(enums)) {
  registerEnumType(value, { name: key, description: `The ${key} enum` });
}
