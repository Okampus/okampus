import { Field, InputType } from '@nestjs/graphql';
import { ShortcutType } from '@okampus/shared/enums';
import { IsEnum } from 'class-validator';

@InputType()
export class ShortcutProps {
  @Field(() => ShortcutType)
  @IsEnum(ShortcutType)
  type!: ShortcutType;
}
