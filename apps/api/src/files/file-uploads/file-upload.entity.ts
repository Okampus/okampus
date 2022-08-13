import path from 'node:path';
import {
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { nanoid } from 'nanoid';
import { config } from '../../shared/configs/config';
import { BaseTenantEntity } from '../../shared/lib/entities/base-tenant-entity';
import { FileKind } from '../../shared/lib/types/enums/file-kind.enum';
import type { Tenant } from '../../tenants/tenants/tenant.entity';
import { User } from '../../users/user.entity';

@ObjectType()
@Entity()
export class FileUpload extends BaseTenantEntity {
  @Field(() => String)
  @PrimaryKey()
  id: string = nanoid(64);

  @Field(() => User)
  @ManyToOne()
  user!: User;

  @Field(() => String)
  @Property({ type: 'text' })
  name!: string;

  @Field(() => Number)
  @Property()
  fileSize!: number;

  @Field(() => String)
  @Property({ type: 'text' })
  mimeType!: string;

  @Field(() => GraphQLISODateTime)
  @Property()
  fileLastModifiedAt!: Date;

  @Field(() => Boolean)
  @Property()
  validated = false;

  @Field(() => String)
  @Property({ type: 'text' })
  url!: string;

  @Field(() => Boolean)
  @Property()
  visible = false;

  @Field(() => FileKind)
  @Enum(() => FileKind)
  fileKind!: FileKind;

  constructor(options: {
    tenant: Tenant;
    user: User;
    name: string;
    fileSize: number;
    mimeType: string;
    fileLastModifiedAt: Date;
    fileKind: FileKind;
    url: string;
  }) {
    super();
    this.assign(options);
  }

  public getPath(): string {
    return path.join(
      config.get('upload.path'),
      this.fileKind,
      `${this.id.toString()}${path.extname(this.name)}`,
    );
  }
}
