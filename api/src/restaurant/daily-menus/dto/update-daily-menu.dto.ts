import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateDailyMenuDto } from './create-daily-menu.dto';

// TODO: Make it possible to update the date.
export class UpdateDailyMenuDto extends PartialType(OmitType(CreateDailyMenuDto, ['date'])) {}
