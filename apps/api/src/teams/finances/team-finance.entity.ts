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
import { TeamFile } from '../../files/team-files/team-file.entity';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { TeamFinanceCategory } from '../../shared/lib/types/enums/team-finance-category.enum';
import { TeamFinanceMean } from '../../shared/lib/types/enums/team-finance-mean.enum';
import { TeamFinanceType } from '../../shared/lib/types/enums/team-finance-type.enum';
import { User } from '../../users/user.entity';
import { TeamEvent } from '../events/team-event.entity';
import { Team } from '../teams/team.entity';

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
  @ManyToOne()
  dueTo: User | null = null;

  @Field(() => Number)
  @Property()
  amount!: number;

  @Field(() => TeamFinanceMean)
  @Enum(() => TeamFinanceMean)
  mean!: TeamFinanceMean;

  @Field(() => TeamFinanceType)
  @Enum(() => TeamFinanceType)
  type!: TeamFinanceType;

  @Field(() => TeamFinanceCategory)
  @Enum(() => TeamFinanceCategory)
  category!: TeamFinanceCategory;

  @Field(() => TeamEvent, { nullable: true })
  @ManyToOne()
  event: TeamEvent | null = null;

  @Field(() => TeamFile, { nullable: true })
  @OneToOne('TeamFile')
  receipt: TeamFile | null = null;

  constructor(options: {
    title: string;
    createdBy: User;
    team: Team;
    amount: number;
    mean: TeamFinanceMean;
    type: TeamFinanceType;
    category: TeamFinanceCategory;
    description?: string | null;
    dueTo?: User | null;
    event?: TeamEvent | null;
    receipt?: TeamFile | null;
  }) {
    super();
    this.assign(options);
  }
}
