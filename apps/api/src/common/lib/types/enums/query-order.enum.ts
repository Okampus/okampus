import { QueryOrder } from '@mikro-orm/core';
import { registerEnumType } from '@nestjs/graphql';

registerEnumType(QueryOrder, { name: 'QueryOrder' });
