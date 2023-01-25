import { Field, InputType } from '@nestjs/graphql';
import { ShortcutType } from '@okampus/shared/enums';
import { IsEnum, IsOptional, IsString } from 'class-validator';

@InputType()
export class ShortcutProps {
  @Field(() => String)
  @IsString()
  name!: string;

  @Field(() => String)
  @IsString()
  subroute!: string;

  @Field(() => ShortcutType)
  @IsEnum(ShortcutType)
  type!: ShortcutType;

  @Field(() => String, { nullable: true })
  @IsOptional()
  resourceId?: string;
}
