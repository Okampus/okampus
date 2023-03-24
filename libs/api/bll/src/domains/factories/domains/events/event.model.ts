/* eslint-disable import/no-cycle */
import {
  ContentMasterModel,
  EventApprovalModel,
  EventApprovalStepModel,
  EventJoinModel,
  EventRoleModel,
  FormModel,
  FormSubmissionModel,
  ImageUploadModel,
  OrgModel,
  ProjectModel,
  UserModel,
} from '../../index';
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
  IOrg,
  IEventRole,
  IProject,
} from '@okampus/shared/dtos';

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

  @Field(() => [OrgModel])
  orgs!: IOrg[];

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

  @Field(() => ProjectModel, { nullable: true })
  linkedProject?: IProject | null;

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

  @Field(() => Boolean)
  autoAcceptJoins!: boolean;

  @Field(() => [EventRoleModel])
  roles!: IEventRole[];

  constructor(event: ITenantEvent) {
    super(event);
    this.assign(event);

    this.contentMasterKind = ContentMasterKind.TenantEvent;
  }
}

@ObjectType()
export class PaginatedTenantEventModel extends Paginated(TenantEventModel) {}

// const rootContentField = 'rootContent';
// const teamField = 'team';

// export function getEventPopulate(populate: string[]): { team: never[]; joiner: never[] } {
//   const teamPopulate = (populate
//     ?.filter((str: string) => str.startsWith(`${rootContentField}.${teamField}.`))
//     ?.map((str: string) => str.replace(`${rootContentField}.${teamField}.`, '')) ?? ['events']) as never[];

//   const joinerPopulate = (populate
//     ?.filter((str: string) => str.startsWith(`${joinerField}.`))
//     ?.map((str: string) => str.replace(`${joinerField}.`, '')) ?? ['teamJoins']) as never[];

//   return { team: teamPopulate, joiner: joinerPopulate };
// }
