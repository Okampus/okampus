import { Field, InputType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { RegistrationStatus } from '@okampus/shared/enums';

@InputType()
export class EventJoinProps {
  @Field(() => RegistrationStatus, { nullable: true })
  @IsEnum(RegistrationStatus)
  presenceStatus!: RegistrationStatus;
}
