import { PartialType } from '@nestjs/mapped-types';
import { CreateDailyMenuDto } from './create-daily-menu.dto';

export class UpdateDailyMenuDto extends PartialType(CreateDailyMenuDto) {}
