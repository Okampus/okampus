import { InputType, PartialType } from '@nestjs/graphql';
import { CreateClassDto } from '@classes/dto/create-class.dto';

@InputType()
export class UpdateClassDto extends PartialType(CreateClassDto) {}
