import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ReportReason } from '@okampus/shared/enums';

@InputType()
export class ReportProps {
  @Field(() => ReportReason)
  @IsEnum(ReportReason)
  type!: ReportReason;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  reason?: string;
}
