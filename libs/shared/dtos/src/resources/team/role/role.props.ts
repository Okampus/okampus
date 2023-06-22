import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsInt, IsOptional, IsString, Length } from 'class-validator';
import { Colors, RoleCategory } from '@okampus/shared/enums';

@InputType()
export class RoleProps {
  @Field(() => String)
  @Length(1, 100)
  @IsString()
  name!: string;

  @Field(() => Colors)
  @IsEnum(Colors)
  color!: Colors;

  @Field(() => [Int], { nullable: true })
  @IsOptional()
  @IsInt({ each: true })
  permissions: number[] = [];

  @Field(() => RoleCategory)
  @IsEnum(RoleCategory)
  category!: RoleCategory;
}
