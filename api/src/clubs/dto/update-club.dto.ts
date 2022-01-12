import { PartialType } from '@nestjs/swagger';
import { CreateClubDto } from './create-club.dto';

export class UpdateClubDto extends PartialType(CreateClubDto) {}
