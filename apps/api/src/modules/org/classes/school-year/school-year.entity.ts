import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { Paginated } from '@common/modules/pagination';
import { BaseEntity } from '@lib/entities/base.entity';

@ObjectType()
@Entity()
export class SchoolYear extends BaseEntity {
  @Field()
  @PrimaryKey()
  id!: string;

  @Field()
  @Property()
  name!: string;

  @Field(() => Boolean)
  @Property()
  active = true;

  constructor(options: {
    id: string;
    name: string;
  }) {
    super();
    this.assign(options);
  }
}

@ObjectType()
export class PaginatedSchoolYear extends Paginated(SchoolYear) {}
