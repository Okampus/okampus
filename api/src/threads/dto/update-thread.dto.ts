import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateThreadDto } from './create-thread.dto';

export class UpdateThreadDto extends PartialType(CreateThreadDto) {
  @IsBoolean()
  @IsOptional()
  locked?: boolean;

  @IsBoolean()
  @IsOptional()
  archived?: boolean;
}
