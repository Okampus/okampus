import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TenantLogoUrls {
  @Field(() => String, { nullable: true })
  logoUrl: string | null;

  @Field(() => String, { nullable: true })
  logoDarkUrl: string | null;
}
