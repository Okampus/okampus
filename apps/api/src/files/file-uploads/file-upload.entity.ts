import path from 'node:path';
import {
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import {
 Field, GraphQLISODateTime, Int, ObjectType,
} from '@nestjs/graphql';
import mime from 'mime-types';
import { nanoid } from 'nanoid';
import type { Tenant } from '../../org/tenants/tenants/tenant.entity';
import { config } from '../../shared/configs/config';
import { BaseTenantEntity } from '../../shared/lib/entities/base-tenant-entity';
import { FileKind } from '../../shared/lib/types/enums/file-kind.enum';
import { User } from '../../uua/users/user.entity';

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

  @Field(() => FileKind)
  @Enum(() => FileKind)
  fileKind!: FileKind;

  @Field(() => Int, { nullable: true })
  @Property()
  width: number | null = null;

  @Field(() => Int, { nullable: true })
  @Property()
  height: number | null = null;

  @Field(() => Boolean)
  @Property()
  visible = false;

  constructor(options: {
    tenant: Tenant;
    user: User;
    name: string;
    fileSize: number;
    mimeType: string;
    fileLastModifiedAt: Date;
    url: string;
    fileKind: FileKind;
    width?: number;
    height?: number;
  }) {
    super();
    this.assign(options);
  }

  public getPath(): string {
    return path.join(
      config.upload.path,
      this.fileKind,
      `${this.id.toString()}.${mime.extension(this.mimeType)}`,
    );
  }
}
