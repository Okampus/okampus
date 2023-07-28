import { TenantProps } from './tenant.props';
import { ActorProps } from '../actor/actor.props';
import { Field, InputType, IntersectionType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { GraphQLJSON } from 'graphql-scalars';

import type { JSONObject } from '@okampus/shared/types';

@InputType()
export class CreateTenantDto extends IntersectionType(TenantProps, ActorProps) {
  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional() // TODO: add custom validator for dynamic form schema
  eventValidationForm?: JSONObject | null;
}
