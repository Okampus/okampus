import { InputType, PartialType } from '@nestjs/graphql';
import { CreateSchoolYearDto } from './create-school-year.dto';

@InputType()
export class UpdateSchoolYearDto extends PartialType(CreateSchoolYearDto) {}
