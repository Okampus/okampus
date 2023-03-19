/* eslint-disable import/no-cycle */
import { EventApprovalStepModel } from '../../index';
import { EventApprovalModel } from '../../index';
import { EventJoinModel } from '../../index';
import { ContentMasterModel } from '../../index';
import { FormSubmissionModel } from '../../index';
import { FormModel } from '../../index';
import { ImageUploadModel } from '../../index';
import { UserModel } from '../../index';
import { Paginated } from '../../../../shards/types/paginated.type';

import { Field, Float, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-scalars';

import { Address } from '@okampus/shared/dtos';
import { ContentMasterKind, EventState } from '@okampus/shared/enums';

import type { JSONObject } from '@okampus/shared/types';
import type {
  IEventApproval,
  IEventApprovalStep,
  IEventJoin,
  IForm,
  IFormSubmission,
  IImageUpload,
  ITenantEvent,
  IUser,
} from '@okampus/shared/dtos';
// eslint-disable-next-line import/no-cycle
// eslint-disable-next-line import/no-cycle

@ObjectType({ implements: () => [ContentMasterModel] })
export class TenantEventModel extends ContentMasterModel implements ITenantEvent {
  @Field(() => GraphQLISODateTime)
  start!: Date;

  @Field(() => GraphQLISODateTime)
  end!: Date;

  @Field(() => Address)
  location!: Address;

  @Field(() => Float)
  price!: number;

  @Field(() => String, { nullable: true })
  regularEventInterval!: string | null;

  @Field(() => ImageUploadModel, { nullable: true })
  image?: IImageUpload | null;

  @Field(() => UserModel, { nullable: true })
  supervisor?: IUser;

  @Field(() => FormModel, { nullable: true })
  joinForm?: IForm;

  @Field(() => TenantEventModel, { nullable: true })
  regularEvent?: ITenantEvent | null;

  @Field(() => FormSubmissionModel, { nullable: true })
  approvalSubmission?: IFormSubmission | null;

  @Field(() => EventApprovalStepModel, { nullable: true })
  lastEventApprovalStep?: IEventApprovalStep | null;

  @Field(() => [EventApprovalModel])
  eventApprovals!: IEventApproval[];

  @Field(() => [EventJoinModel])
  registrations!: IEventJoin[];

  @Field(() => EventState)
  state!: EventState;

  @Field(() => GraphQLJSON)
  meta!: JSONObject;

  @Field(() => Boolean)
  private!: boolean;

  constructor(event: ITenantEvent) {
    super(event);
    this.assign(event);

    this.contentMasterKind = ContentMasterKind.TenantEvent;
  }
}

@ObjectType()
export class PaginatedTenantEventModel extends Paginated(TenantEventModel) {}
