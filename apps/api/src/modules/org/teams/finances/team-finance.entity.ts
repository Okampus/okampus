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
import { Paginated } from '@common/modules/pagination';
import { BaseEntity } from '@lib/entities/base.entity';
import { PaymentMethod } from '@lib/types/enums/payment-method.enum';
import { TeamFinanceCategory } from '@lib/types/enums/team-finance-category.enum';
import { TeamFinanceState } from '@lib/types/enums/team-finance-type.enum';
import { FileUpload } from '@modules/upload/file-uploads/file-upload.entity';
import { Event } from '@plan/events/event.entity';
import { Team } from '@teams/team.entity';
import { User } from '@uaa/users/user.entity';

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

  @Field(() => Number, { nullable: true })
  @Property()
  amountPayed: number | null = null;

  @Field(() => PaymentMethod)
  @Enum(() => PaymentMethod)
  method!: PaymentMethod;

  @Field(() => TeamFinanceState)
  @Enum(() => TeamFinanceState)
  state!: TeamFinanceState;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  location?: string | null = null;

  @Field(() => TeamFinanceCategory)
  @Enum(() => TeamFinanceCategory)
  category!: TeamFinanceCategory;

  @Field(() => Event, { nullable: true })
  @ManyToOne({ type: Event, nullable: true })
  event: Event | null = null;

  // TODO: OneToMany relationship
  @Field(() => FileUpload, { nullable: true })
  @OneToOne('FileUpload')
  receipt: FileUpload | null = null;

  constructor(options: {
    title: string;
    createdBy: User;
    team: Team;
    amount: number;
    method: PaymentMethod;
    type: TeamFinanceState;
    category: TeamFinanceCategory;
    description?: string | null;
    dueTo?: User | null;
    event?: Event | null;
    receipt?: FileUpload | null;
  }) {
    super();
    this.assign(options);
  }
}

@ObjectType()
export class PaginatedTeamFinance extends Paginated(TeamFinance) {}
