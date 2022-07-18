import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsBoolean, IsInt } from 'class-validator';
import { ListOptionsDto } from '../../../shared/lib/dto/list-options.dto';

export class ListTeamFormsDto extends PartialType(ListOptionsDto) {
  @IsInt()
  id: number;

  @Transform(({ obj }) => obj.isTemplate === 'true')
  @IsBoolean()
  isTemplate: boolean;
}
