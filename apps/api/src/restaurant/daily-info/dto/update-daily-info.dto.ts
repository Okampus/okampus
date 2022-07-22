import { PartialType } from '@nestjs/mapped-types';
import { CreateDailyInfoDto } from './create-daily-info.dto';

export class UpdateDailyInfoDto extends PartialType(CreateDailyInfoDto) {}
