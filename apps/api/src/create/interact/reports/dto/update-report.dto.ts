import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateReportDto } from './create-report.dto';

export class UpdateReportDto extends PartialType(PickType(CreateReportDto, ['reason'])) {}
