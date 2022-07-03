import { PartialType } from '@nestjs/mapped-types';
import { IsInt } from 'class-validator';
import { ListOptionsDto } from '../../../shared/lib/dto/list-options.dto';

export class ListTeamFormTemplatesDto extends PartialType(ListOptionsDto) {
  @IsInt()
  teamId: number;
}
