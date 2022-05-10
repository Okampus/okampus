import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsInt, IsOptional } from 'class-validator';
import { CreateThreadDto } from './create-thread.dto';

export class UpdateThreadDto extends PartialType(CreateThreadDto) {
  @IsBoolean()
  @IsOptional()
  locked?: boolean;

  @IsInt()
  @IsOptional()
  opValidatedWith?: number;

  @IsInt()
  @IsOptional()
  adminValidatedWith?: number;
}
