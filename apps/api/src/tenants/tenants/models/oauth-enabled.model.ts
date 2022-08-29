import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OIDCEnabled {
  @Field(() => String)
  id: string;

  @Field(() => Boolean)
  isEnabled: boolean;

  @Field(() => String, { nullable: true })
  tenantOidcName: string | null;
}
