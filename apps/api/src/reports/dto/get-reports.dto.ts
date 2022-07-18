import { IsInt, IsOptional, IsString } from 'class-validator';

export class GetReportsDto {
  @IsOptional()
  @IsString()
  byid?: string;

  @IsOptional()
  @IsString()
  forid?: string;

  @IsOptional()
  @IsInt()
  throughid?: number;
}
