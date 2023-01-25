import { QueryOrder } from '@mikro-orm/core';
import { registerEnumType } from '@nestjs/graphql';
import * as enums from '@okampus/shared/enums';

for (const [key, value] of Object.entries(enums)) {
  registerEnumType(value, { name: key, description: `The ${key} enum` });
}

registerEnumType(QueryOrder, { name: 'QueryOrder' });
