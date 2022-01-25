import { IsInt, IsOptional, IsString } from 'class-validator';

export class GetReportsDto {
  @IsOptional()
  @IsString()
  byUserId?: string;

  @IsOptional()
  @IsString()
  forUserId?: string;

  @IsOptional()
  @IsInt()
  throughContentId?: number;
}
