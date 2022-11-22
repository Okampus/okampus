import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { GraphQLJSON } from 'graphql-scalars';
import { IsFormKitSchema } from '@meta/shared/lib/validators/formkit-schema.validator';

@InputType()
export class CreateTenantDto {
  @Field()
  @IsOptional()
  @IsString()
  id: string;

  @Field(() => GraphQLJSON)
  @IsFormKitSchema()
  eventValidationForm: object[] | object | null = null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  logo?: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  logoDark?: string | null;

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
  oidcClientId?: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  oidcClientSecret?: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  oidcDiscoveryUrl?: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  oidcScopes?: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  oidcCallbackUri?: string | null;
}
