import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateReportDto } from '@modules/interact/reports/dto/create-report.dto';

export class UpdateReportDto extends PartialType(PickType(CreateReportDto, ['reason'])) {}
