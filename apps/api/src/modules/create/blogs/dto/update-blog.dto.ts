import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateBlogDto } from '@create/blogs/dto/create-blog.dto';

export class UpdateBlogDto extends PartialType(CreateBlogDto) {
  @IsBoolean()
  @IsOptional()
  locked?: boolean;

  @IsBoolean()
  @IsOptional()
  opened?: boolean;
}
