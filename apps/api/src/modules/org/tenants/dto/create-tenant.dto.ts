import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { GraphQLJSON } from 'graphql-scalars';
import { IsFormKitSchema } from '@common/lib/validators/formkit-schema.validator';

@InputType()
export class CreateTenantDto {
  @Field()
  @IsOptional()
  @IsString()
  slug?: string;

  @Field()
  @IsString()
  name: string;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  @IsFormKitSchema()
  eventValidationForm?: object[] | object;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  logo?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  logoDark?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  tenantOidcName?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  oidcEnabled?: boolean;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  oidcClientId?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  oidcClientSecret?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  oidcDiscoveryUrl?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  oidcScopes?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  oidcCallbackUri?: string;
}
