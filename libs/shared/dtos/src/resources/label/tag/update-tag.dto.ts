import { InputType, PartialType } from '@nestjs/graphql';
import { CreateTagDto } from './create-tag.dto';

@InputType()
export class UpdateTagDto extends PartialType(CreateTagDto) {}
