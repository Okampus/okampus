import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { nanoid } from 'nanoid';
import { BaseFileEntity } from '../../shared/lib/entities/base-file-entity';
import { Team } from '../../teams/teams/team.entity';
import { Tenant } from '../../tenants/tenants/tenant.entity';
import { User } from '../../users/user.entity';
import type { FileUpload } from '../file-uploads/file-upload.entity';

@ObjectType()
@Entity()
export class ProfileImage extends BaseFileEntity {
  @Field()
  @PrimaryKey()
  id: string = nanoid(32);

  @Field(() => User, { nullable: true })
  @ManyToOne({ onDelete: 'CASCADE' })
  user: User | null = null;

  @Field(() => Team, { nullable: true })
  @ManyToOne({ onDelete: 'CASCADE' })
  team: Team | null = null;

  @Field(() => Tenant, { nullable: true })
  @ManyToOne({ onDelete: 'CASCADE' })
  tenant: Tenant | null = null;

  @Field()
  @Property()
  type: string;

  constructor(options: {
    file: FileUpload;
    user?: User | null;
    team?: Team | null;
    tenant?: Tenant | null;
    active?: boolean;
    type: string;
  }) {
    super();
    this.assign(options);
  }

  public isAvailableFor(type: 'team' | 'tenant' | 'user', id?: number | string): boolean {
    const isAvailable = !this.team && !this.user;
    if (type === 'team' && id)
      return isAvailable || this.team?.id === id;

    if (type === 'user' && id)
      return isAvailable || this.user?.id === id;

    if (type === 'tenant' && id)
      return isAvailable || this.tenant?.id === id;

    return isAvailable;
  }
}
