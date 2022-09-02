import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../shared/lib/entities/base.entity';
import { SocialAccountType } from '../shared/lib/types/enums/social-account-type.enum';
import { Team } from '../teams/teams/team.entity';
import { User } from '../users/user.entity';


@ObjectType()
@Entity()
export class Social extends BaseEntity {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(() => SocialAccountType)
  @Enum(() => SocialAccountType)
  socialType!: SocialAccountType;

  @Field()
  @Property({ type: 'text' })
  link!: string;

  @Field()
  @Property({ type: 'text' })
  pseudo!: string;

  @Field(() => User, { nullable: true })
  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  user: User | null = null;

  @Field(() => Team, { nullable: true })
  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  team: Team | null = null;

  constructor(options: {
    socialType: SocialAccountType;
    pseudo: string;
    user?: User | null;
    team?: Team | null;
    link: string;
  }) {
    super();
    this.assign(options);
  }
}
