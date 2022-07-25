import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional } from 'class-validator';

@InputType()
export class InviteMemberDto {
  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  force?: boolean;
}
