import { Field, Float, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import {
  Address,
  IEventApproval,
  IEventApprovalStep,
  IEventJoin,
  IForm,
  IFormSubmission,
  IImageUpload,
  ITenantEvent,
  IUser,
} from '@okampus/shared/dtos';
import { ContentMasterKind, EventState } from '@okampus/shared/enums';
import { JSONObject } from '@okampus/shared/types';
import { GraphQLJSON } from 'graphql-scalars';
import { Paginated } from '../../../shards/types/paginated.type';
// eslint-disable-next-line import/no-cycle
import { ContentMasterModel } from '../abstract/content-master.model';
import { FormSubmissionModel } from '../forms/form-submission.model';
import { FormModel } from '../forms/form.model';
import { ImageUploadModel } from '../images/image-upload.model';
import { UserModel } from '../users/user.model';
import { EventApprovalStepModel } from './event-approval-step.model';
// eslint-disable-next-line import/no-cycle
import { EventApprovalModel } from './event-approval.model';
// eslint-disable-next-line import/no-cycle
import { EventJoinModel } from './event-join.model';

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
