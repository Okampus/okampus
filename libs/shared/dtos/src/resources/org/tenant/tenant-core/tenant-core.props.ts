import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsObject, IsOptional, IsString } from 'class-validator';
import { OidcInfo } from '../../../../embeds/oidc.embed';

@InputType()
export class TenantCoreProps {
  @Field(() => String)
  @IsString()
  name!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  domain?: string;

  @Field(() => OidcInfo, { nullable: true })
  @IsOptional()
  @IsObject()
  @Type(() => OidcInfo)
  oidcInfo?: OidcInfo;
}
