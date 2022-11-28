/* eslint-disable import/no-cycle */
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
import { config } from '@common/configs/config';
import { BaseTenantEntity } from '@common/lib/entities/base-tenant.entity';
import { FileKind } from '@common/lib/types/enums/file-kind.enum';
import type { Tenant } from '@modules/org/tenants/tenant.entity';
import { User } from '@modules/uua/users/user.entity';

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
  size!: number;

  @Field(() => String)
  @Property({ type: 'text' })
  mimeType!: string;

  @Field(() => FileKind)
  @Enum(() => FileKind)
  kind!: FileKind;

  @Field(() => GraphQLISODateTime)
  @Property()
  fileLastModifiedAt!: Date;

  // TODO: implement antivirus and NSFW scanning
  // @Field(() => Boolean)
  // @Property()
  // validated = false;

  // @Field(() => Boolean)
  // @Property()
  // visible = false;

  @Field(() => String)
  @Property({ type: 'text' })
  url!: string;

  @Field(() => Int, { nullable: true })
  @Property()
  width: number | null = null;

  @Field(() => Int, { nullable: true })
  @Property()
  height: number | null = null;

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
      this.kind,
      `${this.id.toString()}.${mime.extension(this.mimeType)}`,
    );
  }
}
