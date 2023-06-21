import { OidcInfo } from '../../embeds/oidc.embed';
import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsString, IsOptional, IsObject } from 'class-validator';

@InputType()
export class TenantProps {
  @Field(() => String)
  @IsString()
  name!: string;

  @Field(() => String)
  @IsString()
  pointName!: string;

  @Field(() => String)
  @IsString()
  domain!: string;

  @Field(() => OidcInfo, { nullable: true })
  @IsOptional()
  @IsObject()
  @Type(() => OidcInfo)
  oidcInfo?: OidcInfo;
}
