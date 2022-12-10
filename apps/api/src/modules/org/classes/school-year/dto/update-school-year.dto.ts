import { InputType, PartialType } from '@nestjs/graphql';
import { CreateSchoolYearDto } from '@classes/school-year/dto/create-school-year.dto';

@InputType()
export class UpdateSchoolYearDto extends PartialType(CreateSchoolYearDto) {}
