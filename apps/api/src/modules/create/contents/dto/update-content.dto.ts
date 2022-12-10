import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateOrphanContentDto } from '@create/contents/dto/create-orphan-content.dto';

@InputType()
export class UpdateContentDto extends PartialType(CreateOrphanContentDto) {
  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  hidden: boolean;
}
