import { Field, InputType, IntersectionType } from '@nestjs/graphql';
import { IsFormKitSchema } from '../../../../validators/formkit-schema.validator';
import { JSONObject } from '@okampus/shared/types';
import { IsOptional } from 'class-validator';
import { GraphQLJSON } from 'graphql-scalars';
import { ActorProps } from '../../../actor/actor.props';
import { TenantCoreProps } from '../tenant-core/tenant-core.props';
import { TenantProps } from './tenant.props';

@InputType()
export class CreateTenantDto extends IntersectionType(TenantProps, ActorProps) {
  @Field(() => TenantCoreProps)
  tenant!: TenantCoreProps;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  @IsFormKitSchema()
  eventValidationForm?: JSONObject | null;
}
