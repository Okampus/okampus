import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateBadgeDto } from './create-badge.dto';

export class UpdateBadgeDto extends PartialType(OmitType(CreateBadgeDto, ['name', 'slug'])) {}
