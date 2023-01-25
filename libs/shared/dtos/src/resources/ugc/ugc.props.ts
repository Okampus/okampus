import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UgcProps {
  @Field(() => Boolean, { nullable: true })
  isAnonymous?: boolean;
}
