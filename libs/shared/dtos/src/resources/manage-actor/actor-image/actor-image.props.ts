import { Field, InputType } from '@nestjs/graphql';
import { ActorImageType } from '@okampus/shared/enums';
import { IsEnum } from 'class-validator';

@InputType()
export class ActorImageProps {
  @Field(() => ActorImageType)
  @IsEnum(ActorImageType)
  type!: ActorImageType;
}
