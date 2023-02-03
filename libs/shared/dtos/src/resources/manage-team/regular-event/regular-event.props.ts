import { Field, InputType } from '@nestjs/graphql';
import { ClassGroupType } from '@okampus/shared/enums';
import { IsEnum, IsOptional, IsString } from 'class-validator';

@InputType()
export class RegularEventProps {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => ClassGroupType)
  @IsEnum(() => ClassGroupType)
  type!: ClassGroupType;
}
