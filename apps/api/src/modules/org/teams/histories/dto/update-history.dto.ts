import { PartialType } from '@nestjs/mapped-types';
import { CreateHistoryDto } from '@teams/histories/dto/create-history.dto';

export class UpdateHistoryDto extends PartialType(CreateHistoryDto) {}
