import { Field, InputType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { CanteenPermissions } from '@okampus/shared/enums';

@InputType()
export class CanteenRoleProps {
  @Field(() => [CanteenPermissions])
  @IsEnum(CanteenPermissions, { each: true })
  permissions!: CanteenPermissions[];
}
