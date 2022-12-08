import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '@common/lib/entities/base.entity';
import { PaymentMethod } from '@common/lib/types/enums/payment-method.enum';
import { TeamFinanceCategory } from '@common/lib/types/enums/team-finance-category.enum';
import { TeamFinanceType } from '@common/lib/types/enums/team-finance-type.enum';
import { Paginated } from '@common/modules/pagination';
import { Team } from '@modules/org/teams/team.entity';
import { Event } from '@modules/plan/events/event.entity';
import { User } from '@modules/uaa/users/user.entity';
import { TeamFile } from '@modules/upload/team-files/team-file.entity';

@ObjectType()
@Entity()
export class TeamFinance extends BaseEntity {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field()
  @Property()
  title!: string;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  description: string | null = null;

  @Field(() => User)
  @ManyToOne()
  createdBy!: User;

  @Field(() => Team)
  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  team!: Team;

  @Field(() => User, { nullable: true })
  @ManyToOne({ type: User, nullable: true })
  dueTo: User | null = null;

  @Field(() => Number)
  @Property()
  amount!: number;

  @Field(() => PaymentMethod)
  @Enum(() => PaymentMethod)
  method!: PaymentMethod;

  @Field(() => TeamFinanceType)
  @Enum(() => TeamFinanceType)
  type!: TeamFinanceType;

  @Field(() => TeamFinanceCategory)
  @Enum(() => TeamFinanceCategory)
  category!: TeamFinanceCategory;

  @Field(() => Event, { nullable: true })
  @ManyToOne({ type: Event, nullable: true })
  event: Event | null = null;

  @Field(() => TeamFile, { nullable: true })
  @OneToOne('TeamFile')
  receipt: TeamFile | null = null;

  constructor(options: {
    title: string;
    createdBy: User;
    team: Team;
    amount: number;
    method: PaymentMethod;
    type: TeamFinanceType;
    category: TeamFinanceCategory;
    description?: string | null;
    dueTo?: User | null;
    event?: Event | null;
    receipt?: TeamFile | null;
  }) {
    super();
    this.assign(options);
  }
}


@ObjectType()
export class PaginatedTeamFinance extends Paginated(TeamFinance) {}
