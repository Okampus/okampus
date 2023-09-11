import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsString, Length } from 'class-validator';
import { Colors } from '@okampus/shared/enums';

@InputType()
export class TenantRoleProps {
  @Field(() => String)
  @Length(1, 100)
  @IsString()
  name!: string;

  @Field(() => Colors)
  @IsEnum(Colors)
  color!: Colors;
}
