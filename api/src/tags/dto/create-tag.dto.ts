import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

const opaqueHexColor = /^(?:[\da-f]{3}|[\da-f]{6})$/i;

export class CreateTagDto {
  @IsNotEmpty()
  @MaxLength(50)
  @IsString()
  name: string;

  @IsNotEmpty()
  @Matches(opaqueHexColor)
  @Transform(({ value }: { value: string }) => (value.startsWith('#') ? value.slice(1) : value))
  color: string;

  @IsOptional()
  @IsString()
  description?: string;
}
