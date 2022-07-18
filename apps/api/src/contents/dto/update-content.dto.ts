import { IsBoolean, IsOptional } from 'class-validator';
import { CreateOrphanContentDto } from './create-orphan-content.dto';

export class UpdateContentDto extends CreateOrphanContentDto {
  @IsBoolean()
  @IsOptional()
  hidden: boolean;
}
