import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsBoolean } from 'class-validator';

@InputType()
export class TenantProps {
  @Field(() => String)
  @IsString()
  pointName!: string;

  @Field(() => String)
  @IsString()
  domain!: string;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  isOidcEnabled?: boolean = false;

  @Field(() => String, { nullable: true })
  @IsString()
  oidcName?: string = '';

  @Field(() => String, { nullable: true })
  @IsString()
  oidcClientId?: string = '';

  @Field(() => String, { nullable: true })
  @IsString()
  oidcClientSecret?: string = '';

  @Field(() => String, { nullable: true })
  @IsString()
  oidcDiscoveryUrl?: string = '';

  @Field(() => String, { nullable: true })
  @IsString()
  oidcScopes?: string = '';

  @Field(() => String, { nullable: true })
  @IsString()
  oidcCallbackUri?: string = '';
}
