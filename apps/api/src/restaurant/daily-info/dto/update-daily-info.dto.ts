import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateDailyInfoDto } from './create-daily-info.dto';

// TODO: Make it possible to update the date.
export class UpdateDailyInfoDto extends PartialType(OmitType(CreateDailyInfoDto, ['date'])) {}
