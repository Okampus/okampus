import {
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import {
 Field, Float, GraphQLISODateTime, ObjectType,
} from '@nestjs/graphql';
import { nanoid } from 'nanoid';
import { Team } from '../../org/teams/teams/team.entity';
import { BaseFileEntity } from '../../shared/lib/entities/base-file-entity';
import { PaymentMethod } from '../../shared/lib/types/enums/payment-method.enum';
import { User } from '../../uua/users/user.entity';
import type { FileUpload } from '../file-uploads/file-upload.entity';

@ObjectType()
@Entity()
export class TeamReceipt extends BaseFileEntity {
  @Field(() => String)
  @PrimaryKey()
  id: string = nanoid(32);

  @Field(() => Team)
  @ManyToOne()
  team!: Team;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  description: string | null = null;

  @Field(() => GraphQLISODateTime)
  @Property({ type: 'date' })
  payedAt: Date;

  @Field(() => User, { nullable: true })
  @ManyToOne()
  payedBy?: User | null = null;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  paymentLocation?: string | null = null;

  @Field(() => String, { nullable: true })
  @Enum(() => PaymentMethod)
  paymentMethod?: PaymentMethod | null = null;

  @Field(() => Float)
  @Property()
  amount: number;

  @Field(() => Float)
  @Property()
  amountPayed: number;

  constructor(options: {
    team: Team;
    file: FileUpload;
    active?: boolean;
    description?: string | null;
    payedAt?: Date;
    payedBy?: User | null;
    paymentLocation?: string | null;
    paymentMethod?: PaymentMethod | null;
    amount?: number;
    amountPayed?: number;
  }) {
    super();
    if (!this.amountPayed)
      this.amountPayed = this.amount;

    this.assign(options);
  }
}
