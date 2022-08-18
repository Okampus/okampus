import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateTenantDto {
  @Field()
  @IsOptional()
  @IsString()
  id: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  logo?: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  logoDark?: string | null;

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
