import { InputType, PartialType } from '@nestjs/graphql';
import { CreateSchoolGroupDto } from './create-school-group.dto';

@InputType()
export class UpdateSchoolGroupDto extends PartialType(CreateSchoolGroupDto) {}
