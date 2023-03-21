/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
  /** QueryOrderMap custom scalar type */
  QueryOrderMap: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type ActorImageModel = {
  __typename?: 'ActorImageModel';
  actor?: Maybe<ActorModel>;
  createdAt: Scalars['DateTime'];
  createdBy?: Maybe<IndividualModel>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['String'];
  image?: Maybe<ImageUploadModel>;
  lastActiveDate?: Maybe<Scalars['DateTime']>;
  lastHiddenAt?: Maybe<Scalars['DateTime']>;
  tenant?: Maybe<TenantCoreModel>;
  type: ActorImageType;
  updatedAt: Scalars['DateTime'];
};

export type ActorImageModelEdge = {
  __typename?: 'ActorImageModelEdge';
  cursor: Scalars['String'];
  node: ActorImageModel;
};

/** The ActorImageType enum */
export enum ActorImageType {
  Avatar = 'Avatar',
  AvatarDarkMode = 'AvatarDarkMode',
  Banner = 'Banner',
  Profile = 'Profile',
}

/** The ActorKind enum */
export enum ActorKind {
  Individual = 'Individual',
  Org = 'Org',
}

export type ActorModel = {
  __typename?: 'ActorModel';
  actorImages: Array<ActorImageModel>;
  actorKind: ActorKind;
  bio: Scalars['String'];
  createdAt: Scalars['DateTime'];
  createdBy?: Maybe<IndividualModel>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  ical: Scalars['String'];
  id: Scalars['String'];
  individual?: Maybe<IndividualModel>;
  lastHiddenAt?: Maybe<Scalars['DateTime']>;
  name: Scalars['String'];
  org?: Maybe<OrgModel>;
  primaryEmail?: Maybe<Scalars['String']>;
  slug: Scalars['String'];
  socials: Array<SocialModel>;
  tags: Array<TagModel>;
  tenant?: Maybe<TenantCoreModel>;
  updatedAt: Scalars['DateTime'];
};

export type Address = {
  __typename?: 'Address';
  city?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  latitude?: Maybe<Scalars['Float']>;
  longitude?: Maybe<Scalars['Float']>;
  name: Scalars['String'];
  state?: Maybe<Scalars['String']>;
  street?: Maybe<Scalars['String']>;
  zip?: Maybe<Scalars['Int']>;
};

export type AddressInput = {
  city?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  latitude?: InputMaybe<Scalars['Float']>;
  longitude?: InputMaybe<Scalars['Float']>;
  name: Scalars['String'];
  state?: InputMaybe<Scalars['String']>;
  street?: InputMaybe<Scalars['String']>;
  zip?: InputMaybe<Scalars['Int']>;
};

/** The ApprovalState enum */
export enum ApprovalState {
  Approved = 'Approved',
  Canceled = 'Canceled',
  Pending = 'Pending',
  Rejected = 'Rejected',
}

export type AuthContextModel = {
  __typename?: 'AuthContextModel';
  tenant: TenantModel;
  user: UserModel;
};

export type BotModel = IndividualModel & {
  __typename?: 'BotModel';
  actor?: Maybe<ActorModel>;
  botRole: BotRole;
  createdAt: Scalars['DateTime'];
  createdBy?: Maybe<IndividualModel>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['String'];
  individualKind: IndividualKind;
  lastHiddenAt?: Maybe<Scalars['DateTime']>;
  owner: ActorModel;
  status: Scalars['String'];
  tenant?: Maybe<TenantCoreModel>;
  updatedAt: Scalars['DateTime'];
};

export type BotModelEdge = {
  __typename?: 'BotModelEdge';
  cursor: Scalars['String'];
  node: BotModel;
};

/** The BotRole enum */
export enum BotRole {
  Admin = 'Admin',
  Moderator = 'Moderator',
  Official = 'Official',
  Team = 'Team',
  User = 'User',
}

/** The Colors enum */
export enum Colors {
  Black = 'Black',
  Blue = 'Blue',
  Brown = 'Brown',
  Cyan = 'Cyan',
  DarkBlue = 'DarkBlue',
  DarkGray = 'DarkGray',
  DarkGreen = 'DarkGreen',
  DarkOrange = 'DarkOrange',
  DarkPurple = 'DarkPurple',
  DarkRed = 'DarkRed',
  DeepBlue = 'DeepBlue',
  DeepGray = 'DeepGray',
  DeepGreen = 'DeepGreen',
  DeepOrange = 'DeepOrange',
  DeepPurple = 'DeepPurple',
  DeepRed = 'DeepRed',
  Gray = 'Gray',
  Green = 'Green',
  Indigo = 'Indigo',
  LightBlue = 'LightBlue',
  LightGreen = 'LightGreen',
  LightOrange = 'LightOrange',
  LightPurple = 'LightPurple',
  LightRed = 'LightRed',
  Lime = 'Lime',
  Orange = 'Orange',
  Pink = 'Pink',
  Purple = 'Purple',
  Red = 'Red',
  Teal = 'Teal',
  Turquoise = 'Turquoise',
}

/** The ContentMasterKind enum */
export enum ContentMasterKind {
  TenantEvent = 'TenantEvent',
}

export type ContentMasterModel = {
  contentMasterKind: ContentMasterKind;
  contributors: Array<IndividualModel>;
  createdAt: Scalars['DateTime'];
  createdBy?: Maybe<IndividualModel>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['String'];
  lastHiddenAt?: Maybe<Scalars['DateTime']>;
  rootContent?: Maybe<UgcModel>;
  slug: Scalars['String'];
  tags: Array<TagModel>;
  tenant?: Maybe<TenantCoreModel>;
  title: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type ContentModel = UgcModel & {
  __typename?: 'ContentModel';
  attachments: Array<FileUploadModel>;
  author?: Maybe<IndividualModel>;
  contentMaster?: Maybe<ContentMasterModel>;
  createdAt: Scalars['DateTime'];
  createdBy?: Maybe<IndividualModel>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  description: Scalars['String'];
  edits: Array<EditModel>;
  id: Scalars['String'];
  isAnonymous: Scalars['Boolean'];
  lastEdit?: Maybe<EditModel>;
  lastHiddenAt?: Maybe<Scalars['DateTime']>;
  parent?: Maybe<UgcModel>;
  representingOrgs: Array<OrgModel>;
  tenant?: Maybe<TenantCoreModel>;
  ugcKind: UgcKind;
  updatedAt: Scalars['DateTime'];
};

export type ContentModelEdge = {
  __typename?: 'ContentModelEdge';
  cursor: Scalars['String'];
  node: ContentModel;
};

export type CreateBotDto = {
  bio?: InputMaybe<Scalars['String']>;
  botRole: BotRole;
  name: Scalars['String'];
  ownerSlug: Scalars['String'];
  primaryEmail?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
  status: Scalars['String'];
};

export type CreateDocumentDto = {
  description?: Scalars['String'];
  isAnonymous?: InputMaybe<Scalars['Boolean']>;
  name: Scalars['String'];
  yearVersion?: InputMaybe<Scalars['Int']>;
};

export type CreateEventApprovalDto = {
  approved: Scalars['Boolean'];
  eventId: Scalars['String'];
  message?: InputMaybe<Scalars['String']>;
  stepId: Scalars['String'];
};

export type CreateEventApprovalStepDto = {
  name?: InputMaybe<Scalars['String']>;
  notifieesIds: Array<Scalars['String']>;
  stepOrder?: InputMaybe<Scalars['Int']>;
  validatorsIds: Array<Scalars['String']>;
};

export type CreateEventDto = {
  description: Scalars['String'];
  end: Scalars['DateTime'];
  location: AddressInput;
  meta?: InputMaybe<Scalars['JSON']>;
  orgIds: Array<Scalars['String']>;
  price?: InputMaybe<Scalars['Float']>;
  private?: InputMaybe<Scalars['Boolean']>;
  regularEventInterval?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
  start: Scalars['DateTime'];
  state: EventState;
  supervisorId: Scalars['String'];
  title: Scalars['String'];
};

export type CreateFinanceDto = {
  address?: InputMaybe<AddressInput>;
  amountDue: Scalars['Float'];
  amountPayed?: InputMaybe<Scalars['Float']>;
  category: FinanceCategory;
  description?: InputMaybe<Scalars['String']>;
  linkedEventId?: InputMaybe<Scalars['String']>;
  linkedProjectId?: InputMaybe<Scalars['String']>;
  paymentDate: Scalars['DateTime'];
  paymentMethod: PaymentMethod;
  state?: InputMaybe<FinanceState>;
  teamId: Scalars['String'];
  transaction: Scalars['String'];
};

export type CreateOrgDocumentDto = {
  description?: Scalars['String'];
  isAnonymous?: InputMaybe<Scalars['Boolean']>;
  name: Scalars['String'];
  type: OrgDocumentType;
  yearVersion?: InputMaybe<Scalars['Int']>;
};

export type CreateProjectDto = {
  actualBudget?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  expectedBudget: Scalars['Int'];
  linkedEventId?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  participantsIds?: InputMaybe<Array<Scalars['String']>>;
  supervisorId: Scalars['String'];
  teamId: Scalars['String'];
};

export type CreateTeamCategoryDto = {
  color?: InputMaybe<Colors>;
  description?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  slug?: InputMaybe<Scalars['String']>;
  teamsIds?: InputMaybe<Array<Scalars['String']>>;
};

export type CreateTeamDto = {
  bio?: InputMaybe<Scalars['String']>;
  categoriesIds?: InputMaybe<Array<Scalars['String']>>;
  currentFinance?: InputMaybe<Scalars['Float']>;
  directorsCategoryName?: InputMaybe<Scalars['String']>;
  managersCategoryName?: InputMaybe<Scalars['String']>;
  membersCategoryName?: InputMaybe<Scalars['String']>;
  membershipFees?: InputMaybe<Scalars['Int']>;
  name: Scalars['String'];
  ownerId?: InputMaybe<Scalars['String']>;
  primaryEmail?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
  tagline?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<TeamType>;
};

export type CreateTeamJoinDto = {
  askedRoleId: Scalars['String'];
  joinerId?: InputMaybe<Scalars['String']>;
  linkedFormEditId: Scalars['String'];
  submission: Scalars['JSON'];
  teamId: Scalars['String'];
};

export type CreateTenantDto = {
  bio?: InputMaybe<Scalars['String']>;
  eventValidationForm?: InputMaybe<Scalars['JSON']>;
  name: Scalars['String'];
  primaryEmail?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
  tenant: TenantCoreProps;
};

export type CreateUserDto = {
  bio?: InputMaybe<Scalars['String']>;
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  middleNames?: InputMaybe<Array<Scalars['String']>>;
  primaryEmail?: InputMaybe<Scalars['String']>;
  roles?: InputMaybe<Array<RoleType>>;
  scopeRole: ScopeRole;
  slug?: InputMaybe<Scalars['String']>;
  status: Scalars['String'];
};

export type DocumentEditModel = EditModel & {
  __typename?: 'DocumentEditModel';
  addedDiff: Scalars['JSON'];
  createdAt: Scalars['DateTime'];
  createdBy?: Maybe<IndividualModel>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  editKind: EditKind;
  id: Scalars['String'];
  lastHiddenAt?: Maybe<Scalars['DateTime']>;
  linkedUgc: UgcModel;
  newVersion: DocumentUploadModel;
  tenant?: Maybe<TenantCoreModel>;
  updatedAt: Scalars['DateTime'];
  yearVersion?: Maybe<Scalars['Int']>;
};

export type DocumentEditModelEdge = {
  __typename?: 'DocumentEditModelEdge';
  cursor: Scalars['String'];
  node: DocumentEditModel;
};

export type DocumentModel = {
  __typename?: 'DocumentModel';
  author?: Maybe<IndividualModel>;
  contentMaster?: Maybe<ContentMasterModel>;
  createdAt: Scalars['DateTime'];
  createdBy?: Maybe<IndividualModel>;
  current: DocumentUploadModel;
  deletedAt?: Maybe<Scalars['DateTime']>;
  description: Scalars['String'];
  edits: Array<EditModel>;
  id: Scalars['String'];
  isAnonymous: Scalars['Boolean'];
  lastEdit?: Maybe<EditModel>;
  lastHiddenAt?: Maybe<Scalars['DateTime']>;
  name: Scalars['String'];
  representingOrgs: Array<OrgModel>;
  tenant?: Maybe<TenantCoreModel>;
  ugcKind: UgcKind;
  updatedAt: Scalars['DateTime'];
  yearVersion?: Maybe<Scalars['Int']>;
};

export type DocumentModelEdge = {
  __typename?: 'DocumentModelEdge';
  cursor: Scalars['String'];
  node: DocumentModel;
};

export type DocumentUploadModel = FileUploadModel & {
  __typename?: 'DocumentUploadModel';
  createdAt: Scalars['DateTime'];
  createdBy?: Maybe<IndividualModel>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  documentType: DocumentUploadType;
  fileUploadKind: FileUploadKind;
  id: Scalars['String'];
  lastHiddenAt?: Maybe<Scalars['DateTime']>;
  lastModifiedAt: Scalars['DateTime'];
  mime: Scalars['String'];
  name: Scalars['String'];
  numberOfPages?: Maybe<Scalars['Int']>;
  numberOfWords?: Maybe<Scalars['Int']>;
  size: Scalars['Int'];
  tenant?: Maybe<TenantCoreModel>;
  updatedAt: Scalars['DateTime'];
  url: Scalars['String'];
};

export type DocumentUploadModelEdge = {
  __typename?: 'DocumentUploadModelEdge';
  cursor: Scalars['String'];
  node: DocumentUploadModel;
};

/** The DocumentUploadType enum */
export enum DocumentUploadType {
  CsvLike = 'CSVLike',
  Code = 'Code',
  Document = 'Document',
  Markdown = 'Markdown',
  Slideshow = 'Slideshow',
  Spreadsheet = 'Spreadsheet',
  Text = 'Text',
}

/** The EditKind enum */
export enum EditKind {
  ContentEdit = 'ContentEdit',
  DocumentEdit = 'DocumentEdit',
  FormEdit = 'FormEdit',
  FormSubmissionEdit = 'FormSubmissionEdit',
}

export type EditModel = {
  addedDiff: Scalars['JSON'];
  createdAt: Scalars['DateTime'];
  createdBy?: Maybe<IndividualModel>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  editKind: EditKind;
  id: Scalars['String'];
  lastHiddenAt?: Maybe<Scalars['DateTime']>;
  linkedUgc: UgcModel;
  tenant?: Maybe<TenantCoreModel>;
  updatedAt: Scalars['DateTime'];
};

export type EditModelEdge = {
  __typename?: 'EditModelEdge';
  cursor: Scalars['String'];
  node: EditModel;
};

export type EventApprovalModel = {
  __typename?: 'EventApprovalModel';
  approved: Scalars['Boolean'];
  createdAt: Scalars['DateTime'];
  createdBy?: Maybe<IndividualModel>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  event?: Maybe<TenantEventModel>;
  id: Scalars['String'];
  lastHiddenAt?: Maybe<Scalars['DateTime']>;
  message?: Maybe<Scalars['String']>;
  step?: Maybe<EventApprovalStepModel>;
  tenant?: Maybe<TenantCoreModel>;
  updatedAt: Scalars['DateTime'];
};

export type EventApprovalModelEdge = {
  __typename?: 'EventApprovalModelEdge';
  cursor: Scalars['String'];
  node: EventApprovalModel;
};

export type EventApprovalStepModel = {
  __typename?: 'EventApprovalStepModel';
  createdAt: Scalars['DateTime'];
  createdBy?: Maybe<IndividualModel>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['String'];
  lastHiddenAt?: Maybe<Scalars['DateTime']>;
  linkedTenant?: Maybe<TenantModel>;
  name: Scalars['String'];
  notifiees: Array<UserModel>;
  stepOrder: Scalars['Int'];
  tenant?: Maybe<TenantCoreModel>;
  updatedAt: Scalars['DateTime'];
  validators: Array<IndividualModel>;
};

export type EventApprovalStepModelEdge = {
  __typename?: 'EventApprovalStepModelEdge';
  cursor: Scalars['String'];
  node: EventApprovalStepModel;
};

export type EventJoinModel = {
  __typename?: 'EventJoinModel';
  createdAt: Scalars['DateTime'];
  createdBy?: Maybe<IndividualModel>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  event?: Maybe<TenantEventModel>;
  formSubmission: FormSubmissionModel;
  id: Scalars['String'];
  joinKind: JoinKind;
  joiner: UserModel;
  lastHiddenAt?: Maybe<Scalars['DateTime']>;
  participated?: Maybe<Scalars['Boolean']>;
  presenceStatus: RegistrationStatus;
  settledAt?: Maybe<Scalars['DateTime']>;
  settledBy?: Maybe<IndividualModel>;
  settledMessage?: Maybe<Scalars['String']>;
  state: ApprovalState;
  teamAction?: Maybe<TeamActionModel>;
  tenant?: Maybe<TenantCoreModel>;
  updatedAt: Scalars['DateTime'];
};

export type EventJoinModelEdge = {
  __typename?: 'EventJoinModelEdge';
  cursor: Scalars['String'];
  node: EventJoinModel;
};

/** The EventState enum */
export enum EventState {
  Approved = 'Approved',
  Draft = 'Draft',
  Published = 'Published',
  Rejected = 'Rejected',
  Submitted = 'Submitted',
  Template = 'Template',
}

/** The FileUploadKind enum */
export enum FileUploadKind {
  DocumentUpload = 'DocumentUpload',
  FileUpload = 'FileUpload',
  ImageUpload = 'ImageUpload',
  VideoUpload = 'VideoUpload',
}

export type FileUploadModel = {
  createdAt: Scalars['DateTime'];
  createdBy?: Maybe<IndividualModel>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  fileUploadKind: FileUploadKind;
  id: Scalars['String'];
  lastHiddenAt?: Maybe<Scalars['DateTime']>;
  lastModifiedAt: Scalars['DateTime'];
  mime: Scalars['String'];
  name: Scalars['String'];
  size: Scalars['Int'];
  tenant?: Maybe<TenantCoreModel>;
  updatedAt: Scalars['DateTime'];
  url: Scalars['String'];
};

/** The FinanceCategory enum */
export enum FinanceCategory {
  Entertainment = 'Entertainment',
  Equipement = 'Equipement',
  Errands = 'Errands',
  Fees = 'Fees',
  Insurance = 'Insurance',
  Logistics = 'Logistics',
  Marketing = 'Marketing',
  MembershipFees = 'MembershipFees',
  Other = 'Other',
  Provider = 'Provider',
  Subscriptions = 'Subscriptions',
  Transportation = 'Transportation',
}

export type FinanceModel = {
  __typename?: 'FinanceModel';
  address?: Maybe<Address>;
  amountDue: Scalars['Float'];
  amountPayed: Scalars['Float'];
  category: FinanceCategory;
  createdAt: Scalars['DateTime'];
  createdBy?: Maybe<IndividualModel>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  lastHiddenAt?: Maybe<Scalars['DateTime']>;
  linkedEvent?: Maybe<TenantEventModel>;
  linkedProject?: Maybe<ProjectModel>;
  paymentDate: Scalars['DateTime'];
  paymentMethod: PaymentMethod;
  receipts: Array<FileUploadModel>;
  state: FinanceState;
  team: TeamModel;
  tenant?: Maybe<TenantCoreModel>;
  transaction: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type FinanceModelEdge = {
  __typename?: 'FinanceModelEdge';
  cursor: Scalars['String'];
  node: FinanceModel;
};

/** The FinanceState enum */
export enum FinanceState {
  Canceled = 'Canceled',
  Completed = 'Completed',
  Ongoing = 'Ongoing',
}

export type FormEditModel = EditModel & {
  __typename?: 'FormEditModel';
  addedDiff: Scalars['JSON'];
  createdAt: Scalars['DateTime'];
  createdBy?: Maybe<IndividualModel>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  editKind: EditKind;
  id: Scalars['String'];
  lastHiddenAt?: Maybe<Scalars['DateTime']>;
  linkedForm: FormModel;
  linkedUgc: UgcModel;
  newVersion: Scalars['JSON'];
  tenant?: Maybe<TenantCoreModel>;
  updatedAt: Scalars['DateTime'];
};

export type FormEditModelEdge = {
  __typename?: 'FormEditModelEdge';
  cursor: Scalars['String'];
  node: FormEditModel;
};

export type FormModel = UgcModel & {
  __typename?: 'FormModel';
  author?: Maybe<IndividualModel>;
  contentMaster?: Maybe<ContentMasterModel>;
  createdAt: Scalars['DateTime'];
  createdBy?: Maybe<IndividualModel>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  description: Scalars['String'];
  edits: Array<EditModel>;
  id: Scalars['String'];
  isAnonymous: Scalars['Boolean'];
  isTemplate: Scalars['Boolean'];
  lastEdit?: Maybe<EditModel>;
  lastHiddenAt?: Maybe<Scalars['DateTime']>;
  name: Scalars['String'];
  representingOrgs: Array<OrgModel>;
  schema: Scalars['JSON'];
  tenant?: Maybe<TenantCoreModel>;
  type: FormType;
  ugcKind: UgcKind;
  undeletable: Scalars['Boolean'];
  updatedAt: Scalars['DateTime'];
};

export type FormModelEdge = {
  __typename?: 'FormModelEdge';
  cursor: Scalars['String'];
  node: FormModel;
};

export type FormSubmissionModel = UgcModel & {
  __typename?: 'FormSubmissionModel';
  author?: Maybe<IndividualModel>;
  contentMaster?: Maybe<ContentMasterModel>;
  createdAt: Scalars['DateTime'];
  createdBy?: Maybe<IndividualModel>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  description: Scalars['String'];
  edits: Array<EditModel>;
  id: Scalars['String'];
  isAnonymous: Scalars['Boolean'];
  lastEdit?: Maybe<EditModel>;
  lastHiddenAt?: Maybe<Scalars['DateTime']>;
  linkedFormEdit?: Maybe<FormEditModel>;
  representingOrgs: Array<OrgModel>;
  submission: Scalars['JSON'];
  tenant?: Maybe<TenantCoreModel>;
  ugcKind: UgcKind;
  updatedAt: Scalars['DateTime'];
};

export type FormSubmissionModelEdge = {
  __typename?: 'FormSubmissionModelEdge';
  cursor: Scalars['String'];
  node: FormSubmissionModel;
};

/** The FormType enum */
export enum FormType {
  EventJoin = 'EventJoin',
  Internal = 'Internal',
  Survey = 'Survey',
  TeamJoin = 'TeamJoin',
}

export type ImageUploadModel = FileUploadModel & {
  __typename?: 'ImageUploadModel';
  createdAt: Scalars['DateTime'];
  createdBy?: Maybe<IndividualModel>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  fileUploadKind: FileUploadKind;
  height?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  lastHiddenAt?: Maybe<Scalars['DateTime']>;
  lastModifiedAt: Scalars['DateTime'];
  mime: Scalars['String'];
  name: Scalars['String'];
  size: Scalars['Int'];
  tenant?: Maybe<TenantCoreModel>;
  updatedAt: Scalars['DateTime'];
  url: Scalars['String'];
  width?: Maybe<Scalars['Int']>;
};

export type ImageUploadModelEdge = {
  __typename?: 'ImageUploadModelEdge';
  cursor: Scalars['String'];
  node: ImageUploadModel;
};

/** The IndividualKind enum */
export enum IndividualKind {
  Bot = 'Bot',
  User = 'User',
}

export type IndividualModel = {
  actor?: Maybe<ActorModel>;
  createdAt: Scalars['DateTime'];
  createdBy?: Maybe<IndividualModel>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['String'];
  individualKind: IndividualKind;
  lastHiddenAt?: Maybe<Scalars['DateTime']>;
  status: Scalars['String'];
  tenant?: Maybe<TenantCoreModel>;
  updatedAt: Scalars['DateTime'];
};

/** The JoinKind enum */
export enum JoinKind {
  EventJoin = 'EventJoin',
  TeamJoin = 'TeamJoin',
}

/** The MembershipKind enum */
export enum MembershipKind {
  CanteenMember = 'CanteenMember',
  ClassGroupMember = 'ClassGroupMember',
  CohortMember = 'CohortMember',
  TeamMember = 'TeamMember',
  TenantMember = 'TenantMember',
}

export type MembershipModel = {
  __typename?: 'MembershipModel';
  createdAt: Scalars['DateTime'];
  createdBy?: Maybe<IndividualModel>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  endDate?: Maybe<Scalars['DateTime']>;
  id: Scalars['String'];
  lastHiddenAt?: Maybe<Scalars['DateTime']>;
  membershipKind: MembershipKind;
  startDate: Scalars['DateTime'];
  tenant?: Maybe<TenantCoreModel>;
  updatedAt: Scalars['DateTime'];
  user: UserModel;
};

export type MembershipModelEdge = {
  __typename?: 'MembershipModelEdge';
  cursor: Scalars['String'];
  node: MembershipModel;
};

export type Mutation = {
  __typename?: 'Mutation';
  createBot: BotModel;
  createEvent: TenantEventModel;
  createEventApproval: EventApprovalModel;
  createEventApprovalStep: EventApprovalStepModel;
  createFinance: FinanceModel;
  createOrgDocument: OrgDocumentModel;
  createProject: ProjectModel;
  createTeam: TeamModel;
  createTeamCategory: TeamCategoryModel;
  createTeamJoin: TeamJoinModel;
  createTenant: TenantModel;
  createUser: UserModel;
  deactivateActorImage: ActorImageModel;
  deactivateTeamImage: ActorImageModel;
  deactivateUserImage: ActorImageModel;
  deleteBot: Scalars['Boolean'];
  deleteEvent: Scalars['Boolean'];
  deleteEventApproval: Scalars['Boolean'];
  deleteEventApprovalStep: Scalars['Boolean'];
  deleteFinance: Scalars['Boolean'];
  deleteProject: Scalars['Boolean'];
  deleteTeam: Scalars['Boolean'];
  deleteTeamCategory: Scalars['Boolean'];
  deleteTeamJoin: Scalars['Boolean'];
  deleteTenant: Scalars['Boolean'];
  deleteUser: Scalars['Boolean'];
  login: AuthContextModel;
  logout: Scalars['Boolean'];
  teamAddDocument: OrgDocumentModel;
  tenantAddDocument: OrgDocumentModel;
  updateBot: BotModel;
  updateEvent: TenantEventModel;
  updateEventApproval: EventApprovalModel;
  updateEventApprovalStep: EventApprovalStepModel;
  updateFinance: FinanceModel;
  updateProject: ProjectModel;
  updateTeam: TeamModel;
  updateTeamCategory: TeamCategoryModel;
  updateTeamJoin: TeamJoinModel;
  updateTenant: TenantModel;
  updateUser: UserModel;
  wsToken: Scalars['Boolean'];
};

export type MutationCreateBotArgs = {
  bot: CreateBotDto;
};

export type MutationCreateEventArgs = {
  event: CreateEventDto;
};

export type MutationCreateEventApprovalArgs = {
  eventApproval: CreateEventApprovalDto;
};

export type MutationCreateEventApprovalStepArgs = {
  eventApprovalStep: CreateEventApprovalStepDto;
};

export type MutationCreateFinanceArgs = {
  finance: CreateFinanceDto;
  receipts?: InputMaybe<Array<Scalars['Upload']>>;
};

export type MutationCreateOrgDocumentArgs = {
  createOrgDocument: CreateOrgDocumentDto;
  documentFile: Scalars['Upload'];
  orgId: Scalars['String'];
};

export type MutationCreateProjectArgs = {
  project: CreateProjectDto;
};

export type MutationCreateTeamArgs = {
  avatar?: InputMaybe<Scalars['Upload']>;
  avatarDark?: InputMaybe<Scalars['Upload']>;
  banner?: InputMaybe<Scalars['Upload']>;
  team: CreateTeamDto;
};

export type MutationCreateTeamCategoryArgs = {
  iconImage?: InputMaybe<Scalars['Upload']>;
  teamCategory: CreateTeamCategoryDto;
};

export type MutationCreateTeamJoinArgs = {
  teamJoin: CreateTeamJoinDto;
};

export type MutationCreateTenantArgs = {
  tenant: CreateTenantDto;
};

export type MutationCreateUserArgs = {
  avatar?: InputMaybe<Scalars['Upload']>;
  avatarDark?: InputMaybe<Scalars['Upload']>;
  banner?: InputMaybe<Scalars['Upload']>;
  user: CreateUserDto;
};

export type MutationDeactivateActorImageArgs = {
  actorId: Scalars['String'];
  actorImageType: ActorImageType;
};

export type MutationDeactivateTeamImageArgs = {
  actorImageType: ActorImageType;
  id: Scalars['String'];
};

export type MutationDeactivateUserImageArgs = {
  actorImageType: ActorImageType;
  id: Scalars['String'];
};

export type MutationDeleteBotArgs = {
  id: Scalars['String'];
};

export type MutationDeleteEventArgs = {
  id: Scalars['String'];
};

export type MutationDeleteEventApprovalArgs = {
  id: Scalars['String'];
};

export type MutationDeleteEventApprovalStepArgs = {
  id: Scalars['String'];
};

export type MutationDeleteFinanceArgs = {
  id: Scalars['String'];
};

export type MutationDeleteProjectArgs = {
  id: Scalars['String'];
};

export type MutationDeleteTeamArgs = {
  id: Scalars['String'];
};

export type MutationDeleteTeamCategoryArgs = {
  id: Scalars['String'];
};

export type MutationDeleteTeamJoinArgs = {
  id: Scalars['String'];
};

export type MutationDeleteTenantArgs = {
  id: Scalars['String'];
};

export type MutationDeleteUserArgs = {
  id: Scalars['String'];
};

export type MutationLoginArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};

export type MutationTeamAddDocumentArgs = {
  createOrgDocument: CreateOrgDocumentDto;
  documentFile: Scalars['Upload'];
  teamId: Scalars['String'];
};

export type MutationTenantAddDocumentArgs = {
  createDocument: CreateDocumentDto;
  documentFile: Scalars['Upload'];
  tenantId: Scalars['String'];
};

export type MutationUpdateBotArgs = {
  updateBot: UpdateDocumentDto;
};

export type MutationUpdateEventArgs = {
  updateEvent: UpdateEventDto;
};

export type MutationUpdateEventApprovalArgs = {
  updateEventApproval: UpdateEventApprovalDto;
};

export type MutationUpdateEventApprovalStepArgs = {
  updateEventApprovalStep: UpdateEventApprovalStepDto;
};

export type MutationUpdateFinanceArgs = {
  updateFinance: UpdateFinanceDto;
};

export type MutationUpdateProjectArgs = {
  updateProject: UpdateProjectDto;
};

export type MutationUpdateTeamArgs = {
  avatar?: InputMaybe<Scalars['Upload']>;
  avatarDark?: InputMaybe<Scalars['Upload']>;
  banner?: InputMaybe<Scalars['Upload']>;
  updateTeam: UpdateTeamDto;
};

export type MutationUpdateTeamCategoryArgs = {
  updateTeamCategory: UpdateTeamCategoryDto;
};

export type MutationUpdateTeamJoinArgs = {
  updateTeamJoin: UpdateTeamJoinDto;
};

export type MutationUpdateTenantArgs = {
  updateTenant: UpdateTenantDto;
};

export type MutationUpdateUserArgs = {
  avatar?: InputMaybe<Scalars['Upload']>;
  avatarDark?: InputMaybe<Scalars['Upload']>;
  banner?: InputMaybe<Scalars['Upload']>;
  updateUser: UpdateUserDto;
};

export type OidcInfo = {
  __typename?: 'OidcInfo';
  oidcCallbackUri?: Maybe<Scalars['String']>;
  oidcClientId?: Maybe<Scalars['String']>;
  oidcDiscoveryUrl?: Maybe<Scalars['String']>;
  oidcEnabled: Scalars['Boolean'];
  oidcName?: Maybe<Scalars['String']>;
  oidcScopes?: Maybe<Scalars['String']>;
};

export type OidcInfoInput = {
  oidcCallbackUri?: InputMaybe<Scalars['String']>;
  oidcClientId?: InputMaybe<Scalars['String']>;
  oidcDiscoveryUrl?: InputMaybe<Scalars['String']>;
  oidcEnabled?: Scalars['Boolean'];
  oidcName?: InputMaybe<Scalars['String']>;
  oidcScopes?: InputMaybe<Scalars['String']>;
};

export type OrgDocumentModel = {
  __typename?: 'OrgDocumentModel';
  createdAt: Scalars['DateTime'];
  createdBy?: Maybe<IndividualModel>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  document: DocumentModel;
  id: Scalars['String'];
  lastHiddenAt?: Maybe<Scalars['DateTime']>;
  org: OrgModel;
  tenant?: Maybe<TenantCoreModel>;
  type: OrgDocumentType;
  updatedAt: Scalars['DateTime'];
};

export type OrgDocumentModelEdge = {
  __typename?: 'OrgDocumentModelEdge';
  cursor: Scalars['String'];
  node: OrgDocumentModel;
};

/** The OrgDocumentType enum */
export enum OrgDocumentType {
  AssociationConstitution = 'AssociationConstitution',
  AssociationDeclaration = 'AssociationDeclaration',
  ClubCharter = 'ClubCharter',
  ClubHandover = 'ClubHandover',
  OrgGraphicCharter = 'OrgGraphicCharter',
  OrgMeetingTranscript = 'OrgMeetingTranscript',
  TenantGuide = 'TenantGuide',
}

/** The OrgKind enum */
export enum OrgKind {
  Canteen = 'Canteen',
  ClassGroup = 'ClassGroup',
  Cohort = 'Cohort',
  Team = 'Team',
  Tenant = 'Tenant',
}

export type OrgModel = {
  actor: ActorModel;
  createdAt: Scalars['DateTime'];
  createdBy?: Maybe<IndividualModel>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  documents: Array<OrgDocumentModel>;
  events: Array<TenantEventModel>;
  id: Scalars['String'];
  lastHiddenAt?: Maybe<Scalars['DateTime']>;
  orgKind: OrgKind;
  parent?: Maybe<OrgModel>;
  tenant?: Maybe<TenantCoreModel>;
  updatedAt: Scalars['DateTime'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  countAfter: Scalars['Float'];
  countBefore: Scalars['Float'];
  countCurrent: Scalars['Float'];
  countTotal: Scalars['Float'];
  currentPage: Scalars['Float'];
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['String']>;
};

export type PaginatedBotModel = {
  __typename?: 'PaginatedBotModel';
  edges?: Maybe<Array<BotModelEdge>>;
  pageInfo?: Maybe<PageInfo>;
};

export type PaginatedEventApprovalModel = {
  __typename?: 'PaginatedEventApprovalModel';
  edges?: Maybe<Array<EventApprovalModelEdge>>;
  pageInfo?: Maybe<PageInfo>;
};

export type PaginatedEventApprovalStepModel = {
  __typename?: 'PaginatedEventApprovalStepModel';
  edges?: Maybe<Array<EventApprovalStepModelEdge>>;
  pageInfo?: Maybe<PageInfo>;
};

export type PaginatedFinanceModel = {
  __typename?: 'PaginatedFinanceModel';
  edges?: Maybe<Array<FinanceModelEdge>>;
  pageInfo?: Maybe<PageInfo>;
};

export type PaginatedProjectModel = {
  __typename?: 'PaginatedProjectModel';
  edges?: Maybe<Array<ProjectModelEdge>>;
  pageInfo?: Maybe<PageInfo>;
};

export type PaginatedTeamCategoryModel = {
  __typename?: 'PaginatedTeamCategoryModel';
  edges?: Maybe<Array<TeamCategoryModelEdge>>;
  pageInfo?: Maybe<PageInfo>;
};

export type PaginatedTeamJoinModel = {
  __typename?: 'PaginatedTeamJoinModel';
  edges?: Maybe<Array<TeamJoinModelEdge>>;
  pageInfo?: Maybe<PageInfo>;
};

export type PaginatedTeamModel = {
  __typename?: 'PaginatedTeamModel';
  edges?: Maybe<Array<TeamModelEdge>>;
  pageInfo?: Maybe<PageInfo>;
};

export type PaginatedTenantEventModel = {
  __typename?: 'PaginatedTenantEventModel';
  edges?: Maybe<Array<TenantEventModelEdge>>;
  pageInfo?: Maybe<PageInfo>;
};

export type PaginatedTenantModel = {
  __typename?: 'PaginatedTenantModel';
  edges?: Maybe<Array<TenantModelEdge>>;
  pageInfo?: Maybe<PageInfo>;
};

export type PaginatedUserModel = {
  __typename?: 'PaginatedUserModel';
  edges?: Maybe<Array<UserModelEdge>>;
  pageInfo?: Maybe<PageInfo>;
};

export type PaginationOptions = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Scalars['QueryOrderMap']>;
};

/** The PaymentMethod enum */
export enum PaymentMethod {
  Cash = 'Cash',
  Check = 'Check',
  CreditCard = 'CreditCard',
  MobilePayment = 'MobilePayment',
  Other = 'Other',
  RegularTransfer = 'RegularTransfer',
  Transfer = 'Transfer',
}

export type ProjectModel = {
  __typename?: 'ProjectModel';
  actualBudget: Scalars['Float'];
  createdAt: Scalars['DateTime'];
  createdBy?: Maybe<IndividualModel>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  expectedBudget: Scalars['Float'];
  id: Scalars['String'];
  lastHiddenAt?: Maybe<Scalars['DateTime']>;
  linkedEvent?: Maybe<TenantEventModel>;
  name: Scalars['String'];
  participants?: Maybe<Array<UserModel>>;
  supervisor: UserModel;
  team: TeamModel;
  tenant?: Maybe<TenantCoreModel>;
  updatedAt: Scalars['DateTime'];
};

export type ProjectModelEdge = {
  __typename?: 'ProjectModelEdge';
  cursor: Scalars['String'];
  node: ProjectModel;
};

export type Query = {
  __typename?: 'Query';
  botById: BotModel;
  botBySlug: BotModel;
  bots: PaginatedBotModel;
  eventApprovalById: EventApprovalModel;
  eventApprovalStepById: EventApprovalStepModel;
  eventApprovalSteps: PaginatedEventApprovalStepModel;
  eventApprovals: PaginatedEventApprovalModel;
  eventById: TenantEventModel;
  events: PaginatedTenantEventModel;
  financeById: FinanceModel;
  finances: PaginatedFinanceModel;
  financesByTeam: PaginatedFinanceModel;
  me: AuthContextModel;
  projectById: ProjectModel;
  projects: PaginatedProjectModel;
  projectsByTeam: PaginatedProjectModel;
  teamById: TeamModel;
  teamBySlug: TeamModel;
  teamCategories: PaginatedTeamCategoryModel;
  teamCategoryById: TeamCategoryModel;
  teamCategoryBySlug: TeamCategoryModel;
  teamJoinById: TeamJoinModel;
  teamJoins: PaginatedTeamJoinModel;
  teams: PaginatedTeamModel;
  tenantById: TenantModel;
  tenantBySlug: TenantModel;
  tenants: PaginatedTenantModel;
  userById: UserModel;
  userBySlug: UserModel;
  users: PaginatedUserModel;
};

export type QueryBotByIdArgs = {
  id: Scalars['String'];
};

export type QueryBotBySlugArgs = {
  slug: Scalars['String'];
};

export type QueryBotsArgs = {
  options?: InputMaybe<PaginationOptions>;
};

export type QueryEventApprovalByIdArgs = {
  id: Scalars['String'];
};

export type QueryEventApprovalStepByIdArgs = {
  id: Scalars['String'];
};

export type QueryEventApprovalStepsArgs = {
  options?: InputMaybe<PaginationOptions>;
};

export type QueryEventApprovalsArgs = {
  options?: InputMaybe<PaginationOptions>;
};

export type QueryEventByIdArgs = {
  id: Scalars['String'];
};

export type QueryEventsArgs = {
  options?: InputMaybe<PaginationOptions>;
};

export type QueryFinanceByIdArgs = {
  id: Scalars['String'];
};

export type QueryFinancesArgs = {
  options?: InputMaybe<PaginationOptions>;
};

export type QueryFinancesByTeamArgs = {
  options?: InputMaybe<PaginationOptions>;
  teamId: Scalars['String'];
};

export type QueryProjectByIdArgs = {
  id: Scalars['String'];
};

export type QueryProjectsArgs = {
  options?: InputMaybe<PaginationOptions>;
};

export type QueryProjectsByTeamArgs = {
  options?: InputMaybe<PaginationOptions>;
  teamId: Scalars['String'];
};

export type QueryTeamByIdArgs = {
  id: Scalars['String'];
};

export type QueryTeamBySlugArgs = {
  slug: Scalars['String'];
};

export type QueryTeamCategoriesArgs = {
  options?: InputMaybe<PaginationOptions>;
};

export type QueryTeamCategoryByIdArgs = {
  id: Scalars['String'];
};

export type QueryTeamCategoryBySlugArgs = {
  slug: Scalars['String'];
};

export type QueryTeamJoinByIdArgs = {
  id: Scalars['String'];
};

export type QueryTeamJoinsArgs = {
  options?: InputMaybe<PaginationOptions>;
};

export type QueryTeamsArgs = {
  filter?: InputMaybe<TeamFilterQuery>;
  options?: InputMaybe<PaginationOptions>;
};

export type QueryTenantByIdArgs = {
  id: Scalars['String'];
};

export type QueryTenantBySlugArgs = {
  slug: Scalars['String'];
};

export type QueryTenantsArgs = {
  options?: InputMaybe<PaginationOptions>;
};

export type QueryUserByIdArgs = {
  id: Scalars['String'];
};

export type QueryUserBySlugArgs = {
  slug: Scalars['String'];
};

export type QueryUsersArgs = {
  filter?: InputMaybe<UserFilterQuery>;
  options?: InputMaybe<PaginationOptions>;
};

/** The RegistrationStatus enum */
export enum RegistrationStatus {
  Absent = 'Absent',
  Maybe = 'Maybe',
  Sure = 'Sure',
}

/** The RoleKind enum */
export enum RoleKind {
  CanteenRole = 'CanteenRole',
  TeamRole = 'TeamRole',
}

/** The RoleType enum */
export enum RoleType {
  CafeteriaManager = 'CafeteriaManager',
  ClubManager = 'ClubManager',
  Moderator = 'Moderator',
  TenantAdmin = 'TenantAdmin',
  User = 'User',
}

/** The ScopeRole enum */
export enum ScopeRole {
  Admin = 'Admin',
  Student = 'Student',
  Teacher = 'Teacher',
}

export type ShortcutModel = {
  __typename?: 'ShortcutModel';
  createdAt: Scalars['DateTime'];
  createdBy?: Maybe<IndividualModel>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['String'];
  lastHiddenAt?: Maybe<Scalars['DateTime']>;
  targetActor?: Maybe<ActorModel>;
  tenant?: Maybe<TenantCoreModel>;
  type: ShortcutType;
  updatedAt: Scalars['DateTime'];
  user?: Maybe<UserModel>;
};

/** The ShortcutType enum */
export enum ShortcutType {
  Event = 'Event',
  Project = 'Project',
  Team = 'Team',
  User = 'User',
}

export type SocialModel = {
  __typename?: 'SocialModel';
  actor?: Maybe<ActorModel>;
  createdAt: Scalars['DateTime'];
  createdBy?: Maybe<IndividualModel>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['String'];
  lastHiddenAt?: Maybe<Scalars['DateTime']>;
  pseudo: Scalars['String'];
  tenant?: Maybe<TenantCoreModel>;
  type: SocialType;
  updatedAt: Scalars['DateTime'];
  url: Scalars['String'];
};

export type SocialModelEdge = {
  __typename?: 'SocialModelEdge';
  cursor: Scalars['String'];
  node: SocialModel;
};

/** The SocialType enum */
export enum SocialType {
  Discord = 'Discord',
  Instagram = 'Instagram',
  LinkedIn = 'LinkedIn',
  TikTok = 'TikTok',
  Twitch = 'Twitch',
  YouTube = 'YouTube',
}

/** The TagKind enum */
export enum TagKind {
  Tag = 'Tag',
  TeamCategory = 'TeamCategory',
}

export type TagModel = {
  __typename?: 'TagModel';
  color: Colors;
  createdAt: Scalars['DateTime'];
  createdBy?: Maybe<IndividualModel>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  iconImage?: Maybe<ImageUploadModel>;
  id: Scalars['String'];
  lastHiddenAt?: Maybe<Scalars['DateTime']>;
  name: Scalars['String'];
  slug: Scalars['String'];
  tagKind: TagKind;
  tenant?: Maybe<TenantCoreModel>;
  updatedAt: Scalars['DateTime'];
};

export type TagModelEdge = {
  __typename?: 'TagModelEdge';
  cursor: Scalars['String'];
  node: TagModel;
};

export type TeamActionModel = {
  __typename?: 'TeamActionModel';
  createdAt: Scalars['DateTime'];
  createdBy?: Maybe<IndividualModel>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  lastHiddenAt?: Maybe<Scalars['DateTime']>;
  linkedEvent?: Maybe<TenantEventModel>;
  linkedProject?: Maybe<ProjectModel>;
  name: Scalars['String'];
  score: Scalars['Int'];
  state: ApprovalState;
  team?: Maybe<TeamModel>;
  teamMember?: Maybe<TeamMemberModel>;
  tenant?: Maybe<TenantCoreModel>;
  updatedAt: Scalars['DateTime'];
  user?: Maybe<UserModel>;
  validatedBy?: Maybe<TeamMemberModel>;
};

export type TeamActionModelEdge = {
  __typename?: 'TeamActionModelEdge';
  cursor: Scalars['String'];
  node: TeamActionModel;
};

export type TeamCategoryModel = {
  __typename?: 'TeamCategoryModel';
  color: Colors;
  createdAt: Scalars['DateTime'];
  createdBy?: Maybe<IndividualModel>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  iconImage?: Maybe<ImageUploadModel>;
  id: Scalars['String'];
  lastHiddenAt?: Maybe<Scalars['DateTime']>;
  name: Scalars['String'];
  slug: Scalars['String'];
  tagKind: TagKind;
  teams: Array<TeamModel>;
  tenant?: Maybe<TenantCoreModel>;
  updatedAt: Scalars['DateTime'];
};

export type TeamCategoryModelEdge = {
  __typename?: 'TeamCategoryModelEdge';
  cursor: Scalars['String'];
  node: TeamCategoryModel;
};

export type TeamFilterQuery = {
  categories?: InputMaybe<Array<Scalars['String']>>;
  ids?: InputMaybe<Array<Scalars['String']>>;
  slugs?: InputMaybe<Array<Scalars['String']>>;
  types?: InputMaybe<Array<TeamType>>;
};

export type TeamJoinModel = {
  __typename?: 'TeamJoinModel';
  askedRole: TeamRoleModel;
  createdAt: Scalars['DateTime'];
  createdBy?: Maybe<IndividualModel>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  formSubmission: FormSubmissionModel;
  id: Scalars['String'];
  joinKind: JoinKind;
  joiner: UserModel;
  lastHiddenAt?: Maybe<Scalars['DateTime']>;
  receivedRole?: Maybe<TeamRoleModel>;
  settledAt?: Maybe<Scalars['DateTime']>;
  settledBy?: Maybe<IndividualModel>;
  settledMessage?: Maybe<Scalars['String']>;
  state: ApprovalState;
  team: TeamModel;
  tenant?: Maybe<TenantCoreModel>;
  updatedAt: Scalars['DateTime'];
};

export type TeamJoinModelEdge = {
  __typename?: 'TeamJoinModelEdge';
  cursor: Scalars['String'];
  node: TeamJoinModel;
};

export type TeamMemberModel = {
  __typename?: 'TeamMemberModel';
  activities: Array<TeamActionModel>;
  createdAt: Scalars['DateTime'];
  createdBy?: Maybe<IndividualModel>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  endDate?: Maybe<Scalars['DateTime']>;
  id: Scalars['String'];
  lastHiddenAt?: Maybe<Scalars['DateTime']>;
  membershipKind: MembershipKind;
  roles: Array<TeamRoleModel>;
  startDate: Scalars['DateTime'];
  team?: Maybe<TeamModel>;
  tenant?: Maybe<TenantCoreModel>;
  updatedAt: Scalars['DateTime'];
  user: UserModel;
};

export type TeamMemberModelEdge = {
  __typename?: 'TeamMemberModelEdge';
  cursor: Scalars['String'];
  node: TeamMemberModel;
};

export type TeamModel = OrgModel & {
  __typename?: 'TeamModel';
  actor: ActorModel;
  categories: Array<TeamCategoryModel>;
  createdAt: Scalars['DateTime'];
  createdBy?: Maybe<IndividualModel>;
  currentFinance: Scalars['Float'];
  deletedAt?: Maybe<Scalars['DateTime']>;
  directorsCategoryName: Scalars['String'];
  documents: Array<OrgDocumentModel>;
  events: Array<TenantEventModel>;
  finances: Array<FinanceModel>;
  id: Scalars['String'];
  joinForm: FormModel;
  joins: Array<TeamJoinModel>;
  lastHiddenAt?: Maybe<Scalars['DateTime']>;
  managersCategoryName: Scalars['String'];
  memberCount: Scalars['Int'];
  members: Array<TeamMemberModel>;
  membersCategoryName: Scalars['String'];
  membershipFees: Scalars['Float'];
  orgKind: OrgKind;
  parent?: Maybe<OrgModel>;
  roles: Array<TeamRoleModel>;
  tagline?: Maybe<Scalars['String']>;
  tenant?: Maybe<TenantCoreModel>;
  type: TeamType;
  updatedAt: Scalars['DateTime'];
};

export type TeamModelEdge = {
  __typename?: 'TeamModelEdge';
  cursor: Scalars['String'];
  node: TeamModel;
};

/** The TeamPermissions enum */
export enum TeamPermissions {
  Admin = 'Admin',
  ManageEvents = 'ManageEvents',
  ManageMembers = 'ManageMembers',
  ManageRequests = 'ManageRequests',
  ManageRoles = 'ManageRoles',
  ManageTeam = 'ManageTeam',
  ManageTreasury = 'ManageTreasury',
  ViewDraftEvents = 'ViewDraftEvents',
  ViewRequests = 'ViewRequests',
  ViewTreasury = 'ViewTreasury',
}

/** The TeamRoleCategory enum */
export enum TeamRoleCategory {
  Directors = 'Directors',
  Managers = 'Managers',
  Members = 'Members',
}

export type TeamRoleFilterQuery = {
  categories?: InputMaybe<Array<TeamRoleCategory>>;
  ids?: InputMaybe<Array<Scalars['String']>>;
  keys?: InputMaybe<Array<TeamRoleKey>>;
  permissionsAll?: InputMaybe<Array<TeamPermissions>>;
  permissionsSome?: InputMaybe<Array<TeamPermissions>>;
  teams?: InputMaybe<TeamFilterQuery>;
};

/** The TeamRoleKey enum */
export enum TeamRoleKey {
  Director = 'Director',
  Secretary = 'Secretary',
  Treasurer = 'Treasurer',
}

export type TeamRoleModel = {
  __typename?: 'TeamRoleModel';
  category: TeamRoleCategory;
  color: Colors;
  createdAt: Scalars['DateTime'];
  createdBy?: Maybe<IndividualModel>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['String'];
  key?: Maybe<TeamRoleKey>;
  lastHiddenAt?: Maybe<Scalars['DateTime']>;
  name: Scalars['String'];
  permissions: Array<TeamPermissions>;
  required: Scalars['Boolean'];
  roleKind: RoleKind;
  team: TeamModel;
  tenant?: Maybe<TenantCoreModel>;
  updatedAt: Scalars['DateTime'];
};

/** The TeamType enum */
export enum TeamType {
  Association = 'Association',
  Club = 'Club',
  Department = 'Department',
  Project = 'Project',
}

export type TenantCoreModel = {
  __typename?: 'TenantCoreModel';
  createdAt: Scalars['DateTime'];
  deletedAt?: Maybe<Scalars['DateTime']>;
  domain: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
  oidcInfo: OidcInfo;
  updatedAt: Scalars['DateTime'];
};

export type TenantCoreProps = {
  domain?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  oidcInfo?: InputMaybe<OidcInfoInput>;
};

export type TenantEventModel = ContentMasterModel & {
  __typename?: 'TenantEventModel';
  approvalSubmission?: Maybe<FormSubmissionModel>;
  contentMasterKind: ContentMasterKind;
  contributors: Array<IndividualModel>;
  createdAt: Scalars['DateTime'];
  createdBy?: Maybe<IndividualModel>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  end: Scalars['DateTime'];
  eventApprovals: Array<EventApprovalModel>;
  id: Scalars['String'];
  image?: Maybe<ImageUploadModel>;
  joinForm?: Maybe<FormModel>;
  lastEventApprovalStep?: Maybe<EventApprovalStepModel>;
  lastHiddenAt?: Maybe<Scalars['DateTime']>;
  location: Address;
  meta: Scalars['JSON'];
  orgs: Array<OrgModel>;
  price: Scalars['Float'];
  private: Scalars['Boolean'];
  registrations: Array<EventJoinModel>;
  regularEvent?: Maybe<TenantEventModel>;
  regularEventInterval?: Maybe<Scalars['String']>;
  rootContent?: Maybe<UgcModel>;
  slug: Scalars['String'];
  start: Scalars['DateTime'];
  state: EventState;
  supervisor?: Maybe<UserModel>;
  tags: Array<TagModel>;
  tenant?: Maybe<TenantCoreModel>;
  title: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type TenantEventModelEdge = {
  __typename?: 'TenantEventModelEdge';
  cursor: Scalars['String'];
  node: TenantEventModel;
};

export type TenantModel = OrgModel & {
  __typename?: 'TenantModel';
  actor: ActorModel;
  createdAt: Scalars['DateTime'];
  createdBy?: Maybe<IndividualModel>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  documents: Array<OrgDocumentModel>;
  eventApprovalSteps: Array<EventApprovalStepModel>;
  eventValidationForm?: Maybe<FormModel>;
  events: Array<TenantEventModel>;
  id: Scalars['String'];
  lastHiddenAt?: Maybe<Scalars['DateTime']>;
  orgKind: OrgKind;
  parent?: Maybe<OrgModel>;
  tenant?: Maybe<TenantCoreModel>;
  updatedAt: Scalars['DateTime'];
};

export type TenantModelEdge = {
  __typename?: 'TenantModelEdge';
  cursor: Scalars['String'];
  node: TenantModel;
};

/** The UgcKind enum */
export enum UgcKind {
  Content = 'Content',
  Form = 'Form',
  FormSubmission = 'FormSubmission',
  TenantDocument = 'TenantDocument',
}

export type UgcModel = {
  author?: Maybe<IndividualModel>;
  contentMaster?: Maybe<ContentMasterModel>;
  createdAt: Scalars['DateTime'];
  createdBy?: Maybe<IndividualModel>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  description: Scalars['String'];
  edits: Array<EditModel>;
  id: Scalars['String'];
  isAnonymous: Scalars['Boolean'];
  lastEdit?: Maybe<EditModel>;
  lastHiddenAt?: Maybe<Scalars['DateTime']>;
  representingOrgs: Array<OrgModel>;
  tenant?: Maybe<TenantCoreModel>;
  ugcKind: UgcKind;
  updatedAt: Scalars['DateTime'];
};

export type UpdateDocumentDto = {
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  isAnonymous?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  yearVersion?: InputMaybe<Scalars['Int']>;
};

export type UpdateEventApprovalDto = {
  approved?: InputMaybe<Scalars['Boolean']>;
  eventId?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  message?: InputMaybe<Scalars['String']>;
};

export type UpdateEventApprovalStepDto = {
  id: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
  notifieesIds?: InputMaybe<Array<Scalars['String']>>;
  stepOrder?: InputMaybe<Scalars['Int']>;
  validatorsIds?: InputMaybe<Array<Scalars['String']>>;
};

export type UpdateEventDto = {
  description?: InputMaybe<Scalars['String']>;
  end?: InputMaybe<Scalars['DateTime']>;
  id: Scalars['String'];
  location?: InputMaybe<AddressInput>;
  meta?: InputMaybe<Scalars['JSON']>;
  orgIds?: InputMaybe<Array<Scalars['String']>>;
  price?: InputMaybe<Scalars['Float']>;
  private?: InputMaybe<Scalars['Boolean']>;
  regularEventInterval?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
  start?: InputMaybe<Scalars['DateTime']>;
  state?: InputMaybe<EventState>;
  supervisorId?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

export type UpdateFinanceDto = {
  address?: InputMaybe<AddressInput>;
  amountDue?: InputMaybe<Scalars['Float']>;
  amountPayed?: InputMaybe<Scalars['Float']>;
  category?: InputMaybe<FinanceCategory>;
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  linkedEventId?: InputMaybe<Scalars['String']>;
  linkedProjectId?: InputMaybe<Scalars['String']>;
  paymentDate?: InputMaybe<Scalars['DateTime']>;
  paymentMethod?: InputMaybe<PaymentMethod>;
  state?: InputMaybe<FinanceState>;
  teamId?: InputMaybe<Scalars['String']>;
  transaction?: InputMaybe<Scalars['String']>;
};

export type UpdateProjectDto = {
  actualBudget?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  expectedBudget?: InputMaybe<Scalars['Int']>;
  id: Scalars['String'];
  linkedEventId?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  participantsIds?: InputMaybe<Array<Scalars['String']>>;
  supervisorId?: InputMaybe<Scalars['String']>;
  teamId?: InputMaybe<Scalars['String']>;
};

export type UpdateTeamCategoryDto = {
  color?: InputMaybe<Colors>;
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
  teamsIds?: InputMaybe<Array<Scalars['String']>>;
};

export type UpdateTeamDto = {
  bio?: InputMaybe<Scalars['String']>;
  categoriesIds?: InputMaybe<Array<Scalars['String']>>;
  currentFinance?: InputMaybe<Scalars['Float']>;
  directorsCategoryName?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  managersCategoryName?: InputMaybe<Scalars['String']>;
  membersCategoryName?: InputMaybe<Scalars['String']>;
  membershipFees?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  ownerId?: InputMaybe<Scalars['String']>;
  primaryEmail?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
  tagline?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<TeamType>;
};

export type UpdateTeamJoinDto = {
  askedRoleId?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  linkedFormEditId?: InputMaybe<Scalars['String']>;
  receivedRoleId?: InputMaybe<Scalars['String']>;
  settledMessage?: InputMaybe<Scalars['String']>;
  state?: InputMaybe<ApprovalState>;
  submission?: InputMaybe<Scalars['JSON']>;
};

export type UpdateTenantDto = {
  bio?: InputMaybe<Scalars['String']>;
  eventValidationForm?: InputMaybe<Scalars['JSON']>;
  id: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
  primaryEmail?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
  tenant?: InputMaybe<TenantCoreProps>;
};

export type UpdateUserDto = {
  bio?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  lastName?: InputMaybe<Scalars['String']>;
  middleNames?: InputMaybe<Array<Scalars['String']>>;
  primaryEmail?: InputMaybe<Scalars['String']>;
  roles?: InputMaybe<Array<RoleType>>;
  scopeRole?: InputMaybe<ScopeRole>;
  slug?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
};

export type UserCustomization = {
  __typename?: 'UserCustomization';
  color?: Maybe<Colors>;
  signature?: Maybe<Scalars['String']>;
};

export type UserFilterQuery = {
  ids?: InputMaybe<Array<Scalars['String']>>;
  scopeRoles?: InputMaybe<Array<ScopeRole>>;
  slugs?: InputMaybe<Array<Scalars['String']>>;
  teamMemberships?: InputMaybe<TeamFilterQuery>;
  teamRoles?: InputMaybe<TeamRoleFilterQuery>;
};

export type UserModel = IndividualModel & {
  __typename?: 'UserModel';
  actor?: Maybe<ActorModel>;
  createdAt: Scalars['DateTime'];
  createdBy?: Maybe<IndividualModel>;
  customization: UserCustomization;
  deletedAt?: Maybe<Scalars['DateTime']>;
  finishedIntroduction: Scalars['Boolean'];
  finishedOnboarding: Scalars['Boolean'];
  firstName: Scalars['String'];
  id: Scalars['String'];
  individualKind: IndividualKind;
  lastHiddenAt?: Maybe<Scalars['DateTime']>;
  lastName: Scalars['String'];
  middleNames: Array<Scalars['String']>;
  notificationSettings: UserNotificationSettings;
  roles: Array<RoleType>;
  scopeRole: ScopeRole;
  settings: UserSettings;
  shortcuts: Array<ShortcutModel>;
  stats: UserStats;
  status: Scalars['String'];
  teamJoins: Array<TeamJoinModel>;
  teamMemberships: Array<TeamMemberModel>;
  tenant?: Maybe<TenantCoreModel>;
  updatedAt: Scalars['DateTime'];
};

export type UserModelEdge = {
  __typename?: 'UserModelEdge';
  cursor: Scalars['String'];
  node: UserModel;
};

export type UserNotificationSettings = {
  __typename?: 'UserNotificationSettings';
  notificationAdminEventValidationApproved: Scalars['Int'];
  notificationAdminEventValidationRejected: Scalars['Int'];
  notificationAdminEventValidationStarted: Scalars['Int'];
  notificationAdminEventValidationStep: Scalars['Int'];
  notificationAdminReportCreated: Scalars['Int'];
  notificationAdminRoleUpdated: Scalars['Int'];
  notificationAdminTeamLegalFileUpdated: Scalars['Int'];
  notificationAdminTeamSocialUpdated: Scalars['Int'];
  notificationAdminThreadAssigned: Scalars['Int'];
  notificationAdminThreadAssignedStale: Scalars['Int'];
  notificationAdminThreadAssignedStaleThreshold: Scalars['Int'];
  notificationAdminThreadStale: Scalars['Int'];
  notificationAdminThreadStaleThreshold: Scalars['Int'];
  notificationBadgeUnlocked: Scalars['Int'];
  notificationBlogSubscribedUpdated: Scalars['Int'];
  notificationContentRemoved: Scalars['Int'];
  notificationEventCreated: Scalars['Int'];
  notificationEventManagedApproved: Scalars['Int'];
  notificationEventManagedRegistrationCreated: Scalars['Int'];
  notificationEventManagedRejected: Scalars['Int'];
  notificationEventSubscribedUpdated: Scalars['Int'];
  notificationMentionned: Scalars['Int'];
  notificationRoleUpdated: Scalars['Int'];
  notificationTeamManagedEventUpdated: Scalars['Int'];
  notificationTeamManagedFormUpdated: Scalars['Int'];
  notificationTeamManagedMemberRoleUpdated: Scalars['Int'];
  notificationTeamManagedMembershipRequestUpdated: Scalars['Int'];
  notificationTeamSubscribedEventCreated: Scalars['Int'];
  notificationThreadSubscribedAnswered: Scalars['Int'];
  notificationThreadSubscribedUpdated: Scalars['Int'];
};

export type UserSettings = {
  __typename?: 'UserSettings';
  darkModeActivated: Scalars['Boolean'];
  gdprEndOfLifeAnonymize: Scalars['Boolean'];
  gdprEndOfLifeExport: Scalars['Boolean'];
};

export type UserStats = {
  __typename?: 'UserStats';
  actionStreak: Scalars['Int'];
  commentCount: Scalars['Int'];
  lastActionAt?: Maybe<Scalars['DateTime']>;
  lastComment?: Maybe<Scalars['DateTime']>;
  lastPostAt?: Maybe<Scalars['DateTime']>;
  lastReplyAt?: Maybe<Scalars['DateTime']>;
  points: Scalars['Int'];
  postCount: Scalars['Int'];
  postStreak: Scalars['Int'];
  replyCount: Scalars['Int'];
  replyStreak: Scalars['Int'];
  uploadCount: Scalars['Int'];
};

export type ActorImageBareInfoFragment = {
  __typename: 'ActorImageModel';
  id: string;
  type: ActorImageType;
  image?: { __typename: 'ImageUploadModel'; id: string; url: string } | null;
} & { ' $fragmentName'?: 'ActorImageBareInfoFragment' };

export type DocumentInfoFragment = {
  __typename: 'DocumentModel';
  id: string;
  createdAt: any;
  updatedAt: any;
  description: string;
  name: string;
  yearVersion?: number | null;
  current: { __typename?: 'DocumentUploadModel' } & {
    ' $fragmentRefs'?: { DocumentUploadInfoFragment: DocumentUploadInfoFragment };
  };
  edits: Array<
    | {
        __typename: 'DocumentEditModel';
        yearVersion?: number | null;
        id: string;
        createdAt: any;
        newVersion: { __typename?: 'DocumentUploadModel' } & {
          ' $fragmentRefs'?: { DocumentUploadInfoFragment: DocumentUploadInfoFragment };
        };
      }
    | { __typename: 'FormEditModel'; id: string; createdAt: any }
  >;
} & { ' $fragmentName'?: 'DocumentInfoFragment' };

export type DocumentUploadInfoFragment = {
  __typename: 'DocumentUploadModel';
  id: string;
  createdAt: any;
  url: string;
  name: string;
  mime: string;
  size: number;
  numberOfPages?: number | null;
  numberOfWords?: number | null;
  documentType: DocumentUploadType;
} & { ' $fragmentName'?: 'DocumentUploadInfoFragment' };

export type EventInfoFragment = {
  __typename: 'TenantEventModel';
  id: string;
  createdAt: any;
  updatedAt: any;
  slug: string;
  title: string;
  start: any;
  end: any;
  state: EventState;
  orgs: Array<
    | {
        __typename?: 'TeamModel';
        id: string;
        createdAt: any;
        updatedAt: any;
        orgKind: OrgKind;
        actor: {
          __typename?: 'ActorModel';
          id: string;
          name: string;
          slug: string;
          actorImages: Array<
            { __typename?: 'ActorImageModel' } & {
              ' $fragmentRefs'?: { ActorImageBareInfoFragment: ActorImageBareInfoFragment };
            }
          >;
        };
      }
    | {
        __typename?: 'TenantModel';
        id: string;
        createdAt: any;
        updatedAt: any;
        orgKind: OrgKind;
        actor: {
          __typename?: 'ActorModel';
          id: string;
          name: string;
          slug: string;
          actorImages: Array<
            { __typename?: 'ActorImageModel' } & {
              ' $fragmentRefs'?: { ActorImageBareInfoFragment: ActorImageBareInfoFragment };
            }
          >;
        };
      }
  >;
  supervisor?: { __typename: 'UserModel'; id: string } | null;
  location: {
    __typename: 'Address';
    name: string;
    street?: string | null;
    city?: string | null;
    state?: string | null;
    zip?: number | null;
  };
  lastEventApprovalStep?: { __typename: 'EventApprovalStepModel'; id: string; name: string; stepOrder: number } | null;
  rootContent?:
    | {
        __typename: 'ContentModel';
        createdAt: any;
        description: string;
        ugcKind: UgcKind;
        isAnonymous: boolean;
        author?:
          | { __typename?: 'BotModel' }
          | ({ __typename?: 'UserModel' } & { ' $fragmentRefs'?: { UserInfoFragment: UserInfoFragment } })
          | null;
      }
    | {
        __typename: 'FormModel';
        createdAt: any;
        description: string;
        ugcKind: UgcKind;
        isAnonymous: boolean;
        author?:
          | { __typename?: 'BotModel' }
          | ({ __typename?: 'UserModel' } & { ' $fragmentRefs'?: { UserInfoFragment: UserInfoFragment } })
          | null;
      }
    | {
        __typename: 'FormSubmissionModel';
        createdAt: any;
        description: string;
        ugcKind: UgcKind;
        isAnonymous: boolean;
        author?:
          | { __typename?: 'BotModel' }
          | ({ __typename?: 'UserModel' } & { ' $fragmentRefs'?: { UserInfoFragment: UserInfoFragment } })
          | null;
      }
    | null;
} & { ' $fragmentName'?: 'EventInfoFragment' };

type FileInfo_DocumentUploadModel_Fragment = {
  __typename: 'DocumentUploadModel';
  id: string;
  createdAt: any;
  url: string;
  name: string;
  mime: string;
  size: number;
} & { ' $fragmentName'?: 'FileInfo_DocumentUploadModel_Fragment' };

type FileInfo_ImageUploadModel_Fragment = {
  __typename: 'ImageUploadModel';
  id: string;
  createdAt: any;
  url: string;
  name: string;
  mime: string;
  size: number;
} & { ' $fragmentName'?: 'FileInfo_ImageUploadModel_Fragment' };

export type FileInfoFragment = FileInfo_DocumentUploadModel_Fragment | FileInfo_ImageUploadModel_Fragment;

export type FinanceInfoFragment = {
  __typename: 'FinanceModel';
  id: string;
  createdAt: any;
  updatedAt: any;
  transaction: string;
  paymentDate: any;
  paymentMethod: PaymentMethod;
  amountDue: number;
  amountPayed: number;
  state: FinanceState;
  category: FinanceCategory;
  createdBy?:
    | { __typename?: 'BotModel' }
    | ({ __typename?: 'UserModel' } & { ' $fragmentRefs'?: { UserInfoFragment: UserInfoFragment } })
    | null;
  receipts: Array<
    | ({ __typename?: 'DocumentUploadModel' } & {
        ' $fragmentRefs'?: { DocumentUploadInfoFragment: DocumentUploadInfoFragment };
      })
    | { __typename?: 'ImageUploadModel' }
  >;
  linkedEvent?:
    | ({ __typename?: 'TenantEventModel' } & { ' $fragmentRefs'?: { EventInfoFragment: EventInfoFragment } })
    | null;
  linkedProject?:
    | ({ __typename?: 'ProjectModel' } & { ' $fragmentRefs'?: { ProjectInfoFragment: ProjectInfoFragment } })
    | null;
} & { ' $fragmentName'?: 'FinanceInfoFragment' };

export type FormInfoFragment = {
  __typename: 'FormModel';
  id: string;
  createdAt: any;
  updatedAt: any;
  name: string;
  description: string;
  schema: any;
  type: FormType;
  isTemplate: boolean;
  edits: Array<
    | {
        __typename: 'DocumentEditModel';
        yearVersion?: number | null;
        id: string;
        createdAt: any;
        newVersion: { __typename?: 'DocumentUploadModel' } & {
          ' $fragmentRefs'?: { DocumentUploadInfoFragment: DocumentUploadInfoFragment };
        };
      }
    | { __typename: 'FormEditModel'; id: string; createdAt: any }
  >;
} & { ' $fragmentName'?: 'FormInfoFragment' };

export type FormSubmissionInfoFragment = {
  __typename: 'FormSubmissionModel';
  id: string;
  createdAt: any;
  updatedAt: any;
  submission: any;
  description: string;
  linkedFormEdit?: { __typename: 'FormEditModel'; id: string; createdAt: any; updatedAt: any; newVersion: any } | null;
} & { ' $fragmentName'?: 'FormSubmissionInfoFragment' };

export type MyInfoFragment = {
  __typename: 'UserModel';
  id: string;
  createdAt: any;
  updatedAt: any;
  firstName: string;
  lastName: string;
  status: string;
  roles: Array<RoleType>;
  scopeRole: ScopeRole;
  actor?: {
    __typename?: 'ActorModel';
    id: string;
    slug: string;
    name: string;
    bio: string;
    primaryEmail?: string | null;
    ical: string;
    actorImages: Array<
      { __typename?: 'ActorImageModel' } & {
        ' $fragmentRefs'?: { ActorImageBareInfoFragment: ActorImageBareInfoFragment };
      }
    >;
  } | null;
  shortcuts: Array<{
    __typename: 'ShortcutModel';
    id: string;
    type: ShortcutType;
    targetActor?: {
      __typename: 'ActorModel';
      id: string;
      actorKind: ActorKind;
      name: string;
      slug: string;
      actorImages: Array<
        { __typename?: 'ActorImageModel' } & {
          ' $fragmentRefs'?: { ActorImageBareInfoFragment: ActorImageBareInfoFragment };
        }
      >;
      individual?:
        | { __typename?: 'BotModel' }
        | ({ __typename?: 'UserModel' } & { ' $fragmentRefs'?: { UserInfoFragment: UserInfoFragment } })
        | null;
      org?:
        | ({ __typename?: 'TeamModel' } & { ' $fragmentRefs'?: { TeamInfoFragment: TeamInfoFragment } })
        | { __typename?: 'TenantModel' }
        | null;
    } | null;
  }>;
  teamJoins: Array<
    { __typename?: 'TeamJoinModel' } & { ' $fragmentRefs'?: { TeamJoinInfoFragment: TeamJoinInfoFragment } }
  >;
  teamMemberships: Array<{
    __typename: 'TeamMemberModel';
    id: string;
    roles: Array<{
      __typename: 'TeamRoleModel';
      id: string;
      name: string;
      color: Colors;
      required: boolean;
      permissions: Array<TeamPermissions>;
      category: TeamRoleCategory;
      key?: TeamRoleKey | null;
    }>;
    team?: { __typename: 'TeamModel'; id: string } | null;
  }>;
} & { ' $fragmentName'?: 'MyInfoFragment' };

type OrgInfo_TeamModel_Fragment = {
  __typename: 'TeamModel';
  id: string;
  createdAt: any;
  updatedAt: any;
  orgKind: OrgKind;
  actor: {
    __typename: 'ActorModel';
    id: string;
    name: string;
    slug: string;
    actorImages: Array<
      { __typename?: 'ActorImageModel' } & {
        ' $fragmentRefs'?: { ActorImageBareInfoFragment: ActorImageBareInfoFragment };
      }
    >;
  };
} & { ' $fragmentName'?: 'OrgInfo_TeamModel_Fragment' };

type OrgInfo_TenantModel_Fragment = {
  __typename: 'TenantModel';
  id: string;
  createdAt: any;
  updatedAt: any;
  orgKind: OrgKind;
  actor: {
    __typename: 'ActorModel';
    id: string;
    name: string;
    slug: string;
    actorImages: Array<
      { __typename?: 'ActorImageModel' } & {
        ' $fragmentRefs'?: { ActorImageBareInfoFragment: ActorImageBareInfoFragment };
      }
    >;
  };
} & { ' $fragmentName'?: 'OrgInfo_TenantModel_Fragment' };

export type OrgInfoFragment = OrgInfo_TeamModel_Fragment | OrgInfo_TenantModel_Fragment;

export type ProjectInfoFragment = {
  __typename: 'ProjectModel';
  id: string;
  createdAt: any;
  updatedAt: any;
  name: string;
  expectedBudget: number;
  actualBudget: number;
  team: { __typename?: 'TeamModel' } & { ' $fragmentRefs'?: { TeamInfoFragment: TeamInfoFragment } };
  createdBy?:
    | { __typename?: 'BotModel' }
    | ({ __typename?: 'UserModel' } & { ' $fragmentRefs'?: { UserInfoFragment: UserInfoFragment } })
    | null;
  supervisor: { __typename?: 'UserModel' } & { ' $fragmentRefs'?: { UserInfoFragment: UserInfoFragment } };
  participants?: Array<
    { __typename?: 'UserModel' } & { ' $fragmentRefs'?: { UserInfoFragment: UserInfoFragment } }
  > | null;
} & { ' $fragmentName'?: 'ProjectInfoFragment' };

export type TeamCategoryInfoFragment = {
  __typename: 'TeamCategoryModel';
  id: string;
  createdAt: any;
  updatedAt: any;
  name: string;
  description?: string | null;
  color: Colors;
  slug: string;
  iconImage?: { __typename: 'ImageUploadModel'; id: string; createdAt: any; updatedAt: any; url: string } | null;
} & { ' $fragmentName'?: 'TeamCategoryInfoFragment' };

export type TeamInfoFragment = {
  __typename: 'TeamModel';
  id: string;
  createdAt: any;
  updatedAt: any;
  tagline?: string | null;
  type: TeamType;
  currentFinance: number;
  directorsCategoryName: string;
  managersCategoryName: string;
  membersCategoryName: string;
  memberCount: number;
  actor: {
    __typename: 'ActorModel';
    id: string;
    bio: string;
    name: string;
    slug: string;
    actorImages: Array<
      { __typename?: 'ActorImageModel' } & {
        ' $fragmentRefs'?: { ActorImageBareInfoFragment: ActorImageBareInfoFragment };
      }
    >;
    tags: Array<{ __typename: 'TagModel'; id: string; name: string; slug: string; color: Colors }>;
  };
  categories: Array<
    { __typename?: 'TeamCategoryModel' } & { ' $fragmentRefs'?: { TeamCategoryInfoFragment: TeamCategoryInfoFragment } }
  >;
  joinForm: { __typename?: 'FormModel' } & { ' $fragmentRefs'?: { FormInfoFragment: FormInfoFragment } };
  documents: Array<{
    __typename: 'OrgDocumentModel';
    id: string;
    type: OrgDocumentType;
    document: { __typename?: 'DocumentModel' } & { ' $fragmentRefs'?: { DocumentInfoFragment: DocumentInfoFragment } };
  }>;
} & { ' $fragmentName'?: 'TeamInfoFragment' };

export type TeamJoinInfoFragment = {
  __typename: 'TeamJoinModel';
  id: string;
  createdAt: any;
  updatedAt: any;
  settledAt?: any | null;
  settledMessage?: string | null;
  state: ApprovalState;
  team: { __typename: 'TeamModel'; id: string };
  askedRole: {
    __typename: 'TeamRoleModel';
    id: string;
    name: string;
    color: Colors;
    permissions: Array<TeamPermissions>;
    category: TeamRoleCategory;
    key?: TeamRoleKey | null;
  };
  formSubmission: { __typename?: 'FormSubmissionModel' } & {
    ' $fragmentRefs'?: { FormSubmissionInfoFragment: FormSubmissionInfoFragment };
  };
  receivedRole?: {
    __typename: 'TeamRoleModel';
    id: string;
    name: string;
    color: Colors;
    permissions: Array<TeamPermissions>;
    category: TeamRoleCategory;
    key?: TeamRoleKey | null;
  } | null;
  joiner: { __typename?: 'UserModel' } & { ' $fragmentRefs'?: { UserInfoFragment: UserInfoFragment } };
  createdBy?:
    | { __typename?: 'BotModel' }
    | ({ __typename?: 'UserModel' } & { ' $fragmentRefs'?: { UserInfoFragment: UserInfoFragment } })
    | null;
  settledBy?:
    | { __typename?: 'BotModel' }
    | ({ __typename?: 'UserModel' } & { ' $fragmentRefs'?: { UserInfoFragment: UserInfoFragment } })
    | null;
} & { ' $fragmentName'?: 'TeamJoinInfoFragment' };

export type TeamManageInfoFragment = {
  __typename: 'TeamModel';
  id: string;
  createdAt: any;
  updatedAt: any;
  tagline?: string | null;
  type: TeamType;
  currentFinance: number;
  directorsCategoryName: string;
  managersCategoryName: string;
  membersCategoryName: string;
  actor: {
    __typename: 'ActorModel';
    id: string;
    bio: string;
    name: string;
    slug: string;
    actorImages: Array<
      { __typename?: 'ActorImageModel' } & {
        ' $fragmentRefs'?: { ActorImageBareInfoFragment: ActorImageBareInfoFragment };
      }
    >;
    tags: Array<{ __typename: 'TagModel'; id: string; name: string; slug: string; color: Colors }>;
  };
  categories: Array<
    { __typename?: 'TeamCategoryModel' } & { ' $fragmentRefs'?: { TeamCategoryInfoFragment: TeamCategoryInfoFragment } }
  >;
  joinForm: { __typename?: 'FormModel' } & { ' $fragmentRefs'?: { FormInfoFragment: FormInfoFragment } };
  documents: Array<{
    __typename: 'OrgDocumentModel';
    id: string;
    type: OrgDocumentType;
    document: { __typename?: 'DocumentModel' } & { ' $fragmentRefs'?: { DocumentInfoFragment: DocumentInfoFragment } };
  }>;
  joins: Array<
    { __typename?: 'TeamJoinModel' } & { ' $fragmentRefs'?: { TeamJoinInfoFragment: TeamJoinInfoFragment } }
  >;
  roles: Array<{
    __typename: 'TeamRoleModel';
    id: string;
    name: string;
    color: Colors;
    required: boolean;
    permissions: Array<TeamPermissions>;
    category: TeamRoleCategory;
    key?: TeamRoleKey | null;
  }>;
  members: Array<{
    __typename: 'TeamMemberModel';
    id: string;
    user: {
      __typename: 'UserModel';
      id: string;
      firstName: string;
      actor?: {
        __typename: 'ActorModel';
        id: string;
        name: string;
        actorImages: Array<
          { __typename?: 'ActorImageModel' } & {
            ' $fragmentRefs'?: { ActorImageBareInfoFragment: ActorImageBareInfoFragment };
          }
        >;
      } | null;
    };
    roles: Array<{
      __typename: 'TeamRoleModel';
      id: string;
      name: string;
      color: Colors;
      required: boolean;
      permissions: Array<TeamPermissions>;
      category: TeamRoleCategory;
      key?: TeamRoleKey | null;
    }>;
  }>;
  finances: Array<
    { __typename?: 'FinanceModel' } & { ' $fragmentRefs'?: { FinanceInfoFragment: FinanceInfoFragment } }
  >;
} & { ' $fragmentName'?: 'TeamManageInfoFragment' };

export type TeamMembersInfoFragment = ({
  __typename?: 'TeamModel';
  roles: Array<{
    __typename: 'TeamRoleModel';
    id: string;
    name: string;
    color: Colors;
    required: boolean;
    permissions: Array<TeamPermissions>;
    category: TeamRoleCategory;
    key?: TeamRoleKey | null;
  }>;
  members: Array<{
    __typename: 'TeamMemberModel';
    id: string;
    user: {
      __typename: 'UserModel';
      id: string;
      firstName: string;
      actor?: {
        __typename: 'ActorModel';
        id: string;
        name: string;
        actorImages: Array<
          { __typename?: 'ActorImageModel' } & {
            ' $fragmentRefs'?: { ActorImageBareInfoFragment: ActorImageBareInfoFragment };
          }
        >;
      } | null;
    };
    roles: Array<{
      __typename: 'TeamRoleModel';
      id: string;
      name: string;
      color: Colors;
      required: boolean;
      permissions: Array<TeamPermissions>;
      category: TeamRoleCategory;
      key?: TeamRoleKey | null;
    }>;
  }>;
} & { ' $fragmentRefs'?: { TeamInfoFragment: TeamInfoFragment } }) & { ' $fragmentName'?: 'TeamMembersInfoFragment' };

export type TenantInfoFragment = {
  __typename: 'TenantModel';
  id: string;
  createdAt: any;
  updatedAt: any;
  actor: {
    __typename: 'ActorModel';
    id: string;
    name: string;
    slug: string;
    actorImages: Array<
      { __typename?: 'ActorImageModel' } & {
        ' $fragmentRefs'?: { ActorImageBareInfoFragment: ActorImageBareInfoFragment };
      }
    >;
  };
  eventValidationForm?: { __typename: 'FormModel'; id: string; schema: any } | null;
  documents: Array<{
    __typename: 'OrgDocumentModel';
    id: string;
    type: OrgDocumentType;
    document: { __typename?: 'DocumentModel' } & { ' $fragmentRefs'?: { DocumentInfoFragment: DocumentInfoFragment } };
  }>;
} & { ' $fragmentName'?: 'TenantInfoFragment' };

export type UserInfoFragment = {
  __typename: 'UserModel';
  id: string;
  createdAt: any;
  updatedAt: any;
  firstName: string;
  lastName: string;
  status: string;
  roles: Array<RoleType>;
  scopeRole: ScopeRole;
  actor?: {
    __typename: 'ActorModel';
    id: string;
    slug: string;
    name: string;
    bio: string;
    primaryEmail?: string | null;
    ical: string;
    actorImages: Array<
      { __typename?: 'ActorImageModel' } & {
        ' $fragmentRefs'?: { ActorImageBareInfoFragment: ActorImageBareInfoFragment };
      }
    >;
  } | null;
} & { ' $fragmentName'?: 'UserInfoFragment' };

export type UserMembershipsInfoFragment = {
  __typename: 'UserModel';
  id: string;
  createdAt: any;
  updatedAt: any;
  firstName: string;
  lastName: string;
  roles: Array<RoleType>;
  scopeRole: ScopeRole;
  actor?: {
    __typename: 'ActorModel';
    id: string;
    slug: string;
    name: string;
    bio: string;
    primaryEmail?: string | null;
    ical: string;
    actorImages: Array<
      { __typename?: 'ActorImageModel' } & {
        ' $fragmentRefs'?: { ActorImageBareInfoFragment: ActorImageBareInfoFragment };
      }
    >;
  } | null;
  teamMemberships: Array<{
    __typename: 'TeamMemberModel';
    id: string;
    createdAt: any;
    updatedAt: any;
    team?: ({ __typename?: 'TeamModel' } & { ' $fragmentRefs'?: { TeamInfoFragment: TeamInfoFragment } }) | null;
    roles: Array<{
      __typename: 'TeamRoleModel';
      id: string;
      createdAt: any;
      updatedAt: any;
      name: string;
      permissions: Array<TeamPermissions>;
      category: TeamRoleCategory;
      key?: TeamRoleKey | null;
    }>;
  }>;
} & { ' $fragmentName'?: 'UserMembershipsInfoFragment' };

export type LoginMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;

export type LoginMutation = {
  __typename?: 'Mutation';
  login: {
    __typename: 'AuthContextModel';
    user: { __typename?: 'UserModel' } & { ' $fragmentRefs'?: { MyInfoFragment: MyInfoFragment } };
    tenant: { __typename?: 'TenantModel' } & { ' $fragmentRefs'?: { TenantInfoFragment: TenantInfoFragment } };
  };
};

export type LogoutMutationVariables = Exact<{ [key: string]: never }>;

export type LogoutMutation = { __typename?: 'Mutation'; logout: boolean };

export type CreateEventApprovalMutationVariables = Exact<{
  eventApproval: CreateEventApprovalDto;
}>;

export type CreateEventApprovalMutation = {
  __typename?: 'Mutation';
  createEventApproval: {
    __typename: 'EventApprovalModel';
    id: string;
    createdAt: any;
    updatedAt: any;
    deletedAt?: any | null;
    message?: string | null;
    approved: boolean;
    step?: { __typename: 'EventApprovalStepModel'; id: string; name: string } | null;
    createdBy?:
      | { __typename?: 'BotModel' }
      | ({ __typename?: 'UserModel' } & { ' $fragmentRefs'?: { UserInfoFragment: UserInfoFragment } })
      | null;
    event?:
      | ({ __typename?: 'TenantEventModel' } & { ' $fragmentRefs'?: { EventInfoFragment: EventInfoFragment } })
      | null;
  };
};

export type CreateEventMutationVariables = Exact<{
  event: CreateEventDto;
}>;

export type CreateEventMutation = {
  __typename?: 'Mutation';
  createEvent: { __typename?: 'TenantEventModel' } & { ' $fragmentRefs'?: { EventInfoFragment: EventInfoFragment } };
};

export type UpdateEventMutationVariables = Exact<{
  updateEvent: UpdateEventDto;
}>;

export type UpdateEventMutation = {
  __typename?: 'Mutation';
  updateEvent: { __typename?: 'TenantEventModel' } & { ' $fragmentRefs'?: { EventInfoFragment: EventInfoFragment } };
};

export type CreateFinanceMutationVariables = Exact<{
  finance: CreateFinanceDto;
}>;

export type CreateFinanceMutation = {
  __typename?: 'Mutation';
  createFinance: {
    __typename?: 'FinanceModel';
    team: {
      __typename: 'TeamModel';
      id: string;
      currentFinance: number;
      finances: Array<
        { __typename?: 'FinanceModel' } & { ' $fragmentRefs'?: { FinanceInfoFragment: FinanceInfoFragment } }
      >;
    };
  };
};

export type UpdateFinanceMutationVariables = Exact<{
  updateFinance: UpdateFinanceDto;
}>;

export type UpdateFinanceMutation = {
  __typename?: 'Mutation';
  updateFinance: { __typename?: 'FinanceModel' } & { ' $fragmentRefs'?: { FinanceInfoFragment: FinanceInfoFragment } };
};

export type CreateProjectMutationVariables = Exact<{
  project: CreateProjectDto;
}>;

export type CreateProjectMutation = {
  __typename?: 'Mutation';
  createProject: { __typename?: 'ProjectModel' } & { ' $fragmentRefs'?: { ProjectInfoFragment: ProjectInfoFragment } };
};

export type UpdateProjectMutationVariables = Exact<{
  updateProject: UpdateProjectDto;
}>;

export type UpdateProjectMutation = {
  __typename?: 'Mutation';
  updateProject: { __typename?: 'ProjectModel' } & { ' $fragmentRefs'?: { ProjectInfoFragment: ProjectInfoFragment } };
};

export type CreateTeamJoinMutationVariables = Exact<{
  teamJoin: CreateTeamJoinDto;
}>;

export type CreateTeamJoinMutation = {
  __typename?: 'Mutation';
  createTeamJoin: {
    __typename?: 'TeamJoinModel';
    team: {
      __typename: 'TeamModel';
      id: string;
      joins: Array<
        { __typename?: 'TeamJoinModel' } & { ' $fragmentRefs'?: { TeamJoinInfoFragment: TeamJoinInfoFragment } }
      >;
    };
    joiner: {
      __typename: 'UserModel';
      id: string;
      teamJoins: Array<
        { __typename?: 'TeamJoinModel' } & { ' $fragmentRefs'?: { TeamJoinInfoFragment: TeamJoinInfoFragment } }
      >;
    };
  };
};

export type UpdateTeamJoinMutationVariables = Exact<{
  updateTeamJoin: UpdateTeamJoinDto;
}>;

export type UpdateTeamJoinMutation = {
  __typename?: 'Mutation';
  updateTeamJoin: {
    __typename?: 'TeamJoinModel';
    team: {
      __typename: 'TeamModel';
      id: string;
      joins: Array<
        { __typename?: 'TeamJoinModel' } & { ' $fragmentRefs'?: { TeamJoinInfoFragment: TeamJoinInfoFragment } }
      >;
      members: Array<{
        __typename: 'TeamMemberModel';
        id: string;
        user: {
          __typename: 'UserModel';
          id: string;
          firstName: string;
          actor?: {
            __typename: 'ActorModel';
            id: string;
            name: string;
            actorImages: Array<
              { __typename?: 'ActorImageModel' } & {
                ' $fragmentRefs'?: { ActorImageBareInfoFragment: ActorImageBareInfoFragment };
              }
            >;
          } | null;
        };
        roles: Array<{
          __typename: 'TeamRoleModel';
          id: string;
          name: string;
          color: Colors;
          required: boolean;
          permissions: Array<TeamPermissions>;
          category: TeamRoleCategory;
          key?: TeamRoleKey | null;
        }>;
      }>;
    };
    joiner: {
      __typename: 'UserModel';
      id: string;
      teamJoins: Array<
        { __typename?: 'TeamJoinModel' } & { ' $fragmentRefs'?: { TeamJoinInfoFragment: TeamJoinInfoFragment } }
      >;
    };
  };
};

export type DeactivateTeamImageMutationVariables = Exact<{
  id: Scalars['String'];
  actorImageType: ActorImageType;
}>;

export type DeactivateTeamImageMutation = {
  __typename?: 'Mutation';
  deactivateTeamImage: {
    __typename: 'ActorImageModel';
    actor?: {
      __typename: 'ActorModel';
      id: string;
      name: string;
      slug: string;
      actorImages: Array<
        { __typename?: 'ActorImageModel' } & {
          ' $fragmentRefs'?: { ActorImageBareInfoFragment: ActorImageBareInfoFragment };
        }
      >;
    } | null;
  };
};

export type TeamAddDocumentMutationVariables = Exact<{
  teamId: Scalars['String'];
  createOrgDocument: CreateOrgDocumentDto;
  documentFile: Scalars['Upload'];
}>;

export type TeamAddDocumentMutation = {
  __typename?: 'Mutation';
  teamAddDocument: {
    __typename: 'OrgDocumentModel';
    id: string;
    org:
      | {
          __typename: 'TeamModel';
          id: string;
          documents: Array<{
            __typename: 'OrgDocumentModel';
            id: string;
            createdAt: any;
            type: OrgDocumentType;
            document: { __typename?: 'DocumentModel' } & {
              ' $fragmentRefs'?: { DocumentInfoFragment: DocumentInfoFragment };
            };
          }>;
        }
      | {
          __typename: 'TenantModel';
          id: string;
          documents: Array<{
            __typename: 'OrgDocumentModel';
            id: string;
            createdAt: any;
            type: OrgDocumentType;
            document: { __typename?: 'DocumentModel' } & {
              ' $fragmentRefs'?: { DocumentInfoFragment: DocumentInfoFragment };
            };
          }>;
        };
  };
};

export type UpdateTeamMutationVariables = Exact<{
  updateTeam: UpdateTeamDto;
  avatar?: InputMaybe<Scalars['Upload']>;
  banner?: InputMaybe<Scalars['Upload']>;
}>;

export type UpdateTeamMutation = {
  __typename?: 'Mutation';
  updateTeam: { __typename?: 'TeamModel' } & { ' $fragmentRefs'?: { TeamManageInfoFragment: TeamManageInfoFragment } };
};

export type TenantAddDocumentMutationVariables = Exact<{
  tenantId: Scalars['String'];
  createDocument: CreateDocumentDto;
  documentFile: Scalars['Upload'];
}>;

export type TenantAddDocumentMutation = {
  __typename?: 'Mutation';
  tenantAddDocument: {
    __typename: 'OrgDocumentModel';
    id: string;
    org:
      | {
          __typename?: 'TeamModel';
          id: string;
          documents: Array<{
            __typename?: 'OrgDocumentModel';
            id: string;
            type: OrgDocumentType;
            document: { __typename?: 'DocumentModel' } & {
              ' $fragmentRefs'?: { DocumentInfoFragment: DocumentInfoFragment };
            };
          }>;
        }
      | {
          __typename?: 'TenantModel';
          id: string;
          documents: Array<{
            __typename?: 'OrgDocumentModel';
            id: string;
            type: OrgDocumentType;
            document: { __typename?: 'DocumentModel' } & {
              ' $fragmentRefs'?: { DocumentInfoFragment: DocumentInfoFragment };
            };
          }>;
        };
  };
};

export type DeactivateUserImageMutationVariables = Exact<{
  id: Scalars['String'];
  actorImageType: ActorImageType;
}>;

export type DeactivateUserImageMutation = {
  __typename?: 'Mutation';
  deactivateUserImage: {
    __typename: 'ActorImageModel';
    actor?: {
      __typename: 'ActorModel';
      id: string;
      name: string;
      slug: string;
      actorImages: Array<
        { __typename?: 'ActorImageModel' } & {
          ' $fragmentRefs'?: { ActorImageBareInfoFragment: ActorImageBareInfoFragment };
        }
      >;
    } | null;
  };
};

export type UpdateUserMutationVariables = Exact<{
  updateUser: UpdateUserDto;
  avatar?: InputMaybe<Scalars['Upload']>;
  banner?: InputMaybe<Scalars['Upload']>;
}>;

export type UpdateUserMutation = {
  __typename?: 'Mutation';
  updateUser: { __typename?: 'UserModel' } & { ' $fragmentRefs'?: { UserInfoFragment: UserInfoFragment } };
};

export type GetEventsQueryVariables = Exact<{ [key: string]: never }>;

export type GetEventsQuery = {
  __typename?: 'Query';
  events: {
    __typename?: 'PaginatedTenantEventModel';
    edges?: Array<{
      __typename?: 'TenantEventModelEdge';
      node: { __typename?: 'TenantEventModel' } & { ' $fragmentRefs'?: { EventInfoFragment: EventInfoFragment } };
    }> | null;
  };
};

export type GetFinancesQueryVariables = Exact<{
  teamId: Scalars['String'];
}>;

export type GetFinancesQuery = {
  __typename?: 'Query';
  financesByTeam: {
    __typename?: 'PaginatedFinanceModel';
    edges?: Array<{
      __typename?: 'FinanceModelEdge';
      node: { __typename?: 'FinanceModel' } & { ' $fragmentRefs'?: { FinanceInfoFragment: FinanceInfoFragment } };
    }> | null;
  };
};

export type MeQueryVariables = Exact<{ [key: string]: never }>;

export type MeQuery = {
  __typename?: 'Query';
  me: {
    __typename?: 'AuthContextModel';
    user: { __typename?: 'UserModel' } & { ' $fragmentRefs'?: { MyInfoFragment: MyInfoFragment } };
    tenant: { __typename?: 'TenantModel' } & { ' $fragmentRefs'?: { TenantInfoFragment: TenantInfoFragment } };
  };
};

export type GetTeamByIdQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type GetTeamByIdQuery = {
  __typename?: 'Query';
  teamById: { __typename?: 'TeamModel' } & { ' $fragmentRefs'?: { TeamInfoFragment: TeamInfoFragment } };
};

export type GetTeamCategoriesQueryVariables = Exact<{ [key: string]: never }>;

export type GetTeamCategoriesQuery = {
  __typename?: 'Query';
  teamCategories: {
    __typename?: 'PaginatedTeamCategoryModel';
    edges?: Array<{
      __typename?: 'TeamCategoryModelEdge';
      node: { __typename?: 'TeamCategoryModel' } & {
        ' $fragmentRefs'?: { TeamCategoryInfoFragment: TeamCategoryInfoFragment };
      };
    }> | null;
  };
};

export type GetTeamCategoryBySlugQueryVariables = Exact<{
  slug: Scalars['String'];
}>;

export type GetTeamCategoryBySlugQuery = {
  __typename?: 'Query';
  teamCategoryBySlug: { __typename?: 'TeamCategoryModel' } & {
    ' $fragmentRefs'?: { TeamCategoryInfoFragment: TeamCategoryInfoFragment };
  };
};

export type GetTeamDetailsQueryVariables = Exact<{
  slug: Scalars['String'];
}>;

export type GetTeamDetailsQuery = {
  __typename?: 'Query';
  teamBySlug: { __typename?: 'TeamModel' } & {
    ' $fragmentRefs'?: { TeamMembersInfoFragment: TeamMembersInfoFragment };
  };
};

export type GetTeamManageQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type GetTeamManageQuery = {
  __typename?: 'Query';
  teamById: {
    __typename?: 'TeamModel';
    finances: Array<
      { __typename?: 'FinanceModel' } & { ' $fragmentRefs'?: { FinanceInfoFragment: FinanceInfoFragment } }
    >;
  } & { ' $fragmentRefs'?: { TeamMembersInfoFragment: TeamMembersInfoFragment } };
};

export type GetTeamManageBySlugQueryVariables = Exact<{
  slug: Scalars['String'];
}>;

export type GetTeamManageBySlugQuery = {
  __typename?: 'Query';
  teamBySlug: { __typename?: 'TeamModel' } & { ' $fragmentRefs'?: { TeamManageInfoFragment: TeamManageInfoFragment } };
};

export type GetTeamWithMembersQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type GetTeamWithMembersQuery = {
  __typename?: 'Query';
  teamById: { __typename?: 'TeamModel' } & { ' $fragmentRefs'?: { TeamMembersInfoFragment: TeamMembersInfoFragment } };
};

export type GetTeamWithMembersBySlugQueryVariables = Exact<{
  slug: Scalars['String'];
}>;

export type GetTeamWithMembersBySlugQuery = {
  __typename?: 'Query';
  teamBySlug: { __typename?: 'TeamModel' } & {
    ' $fragmentRefs'?: { TeamMembersInfoFragment: TeamMembersInfoFragment };
  };
};

export type GetTeamsQueryVariables = Exact<{
  options?: InputMaybe<PaginationOptions>;
  filter?: InputMaybe<TeamFilterQuery>;
}>;

export type GetTeamsQuery = {
  __typename?: 'Query';
  teams: {
    __typename?: 'PaginatedTeamModel';
    edges?: Array<{
      __typename?: 'TeamModelEdge';
      node: { __typename?: 'TeamModel' } & { ' $fragmentRefs'?: { TeamInfoFragment: TeamInfoFragment } };
    }> | null;
  };
};

export type GetTeamsByCategoryQueryVariables = Exact<{
  categorySlug: Scalars['String'];
}>;

export type GetTeamsByCategoryQuery = {
  __typename?: 'Query';
  teams: {
    __typename?: 'PaginatedTeamModel';
    edges?: Array<{
      __typename?: 'TeamModelEdge';
      node: { __typename?: 'TeamModel' } & { ' $fragmentRefs'?: { TeamMembersInfoFragment: TeamMembersInfoFragment } };
    }> | null;
  };
};

export type GetTeamsWithMembersQueryVariables = Exact<{ [key: string]: never }>;

export type GetTeamsWithMembersQuery = {
  __typename?: 'Query';
  teams: {
    __typename?: 'PaginatedTeamModel';
    edges?: Array<{
      __typename?: 'TeamModelEdge';
      node: { __typename?: 'TeamModel' } & { ' $fragmentRefs'?: { TeamMembersInfoFragment: TeamMembersInfoFragment } };
    }> | null;
  };
};

export type GetTenantByIdQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type GetTenantByIdQuery = {
  __typename?: 'Query';
  tenantById: { __typename?: 'TenantModel' } & { ' $fragmentRefs'?: { TenantInfoFragment: TenantInfoFragment } };
};

export type GetTenantDocumentsQueryQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type GetTenantDocumentsQueryQuery = {
  __typename?: 'Query';
  tenantById: { __typename?: 'TenantModel' } & { ' $fragmentRefs'?: { TenantInfoFragment: TenantInfoFragment } };
};

export type GetUserByIdQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type GetUserByIdQuery = {
  __typename?: 'Query';
  userById: { __typename?: 'UserModel' } & { ' $fragmentRefs'?: { MyInfoFragment: MyInfoFragment } };
};

export type GetUserBySlugQueryVariables = Exact<{
  slug: Scalars['String'];
}>;

export type GetUserBySlugQuery = {
  __typename?: 'Query';
  userBySlug: { __typename?: 'UserModel' } & {
    ' $fragmentRefs'?: { UserMembershipsInfoFragment: UserMembershipsInfoFragment };
  };
};

export type GetUserMembershipsByIdQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type GetUserMembershipsByIdQuery = {
  __typename?: 'Query';
  userById: { __typename?: 'UserModel' } & {
    ' $fragmentRefs'?: { UserMembershipsInfoFragment: UserMembershipsInfoFragment };
  };
};

export type GetUsersQueryVariables = Exact<{
  options?: InputMaybe<PaginationOptions>;
  filter?: InputMaybe<UserFilterQuery>;
}>;

export type GetUsersQuery = {
  __typename?: 'Query';
  users: {
    __typename?: 'PaginatedUserModel';
    edges?: Array<{
      __typename?: 'UserModelEdge';
      node: { __typename?: 'UserModel' } & {
        ' $fragmentRefs'?: { UserMembershipsInfoFragment: UserMembershipsInfoFragment };
      };
    }> | null;
  };
};

export const FileInfoFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FileInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FileUploadModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mime' } },
          { kind: 'Field', name: { kind: 'Name', value: 'size' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<FileInfoFragment, unknown>;
export const ActorImageBareInfoFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ActorImageBareInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ActorImageModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ActorImageBareInfoFragment, unknown>;
export const UserInfoFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'UserInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'primaryEmail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ical' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roles' } },
          { kind: 'Field', name: { kind: 'Name', value: 'scopeRole' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ActorImageBareInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ActorImageModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UserInfoFragment, unknown>;
export const TeamCategoryInfoFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamCategoryInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamCategoryModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'color' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'iconImage' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<TeamCategoryInfoFragment, unknown>;
export const DocumentUploadInfoFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentUploadInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentUploadModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mime' } },
          { kind: 'Field', name: { kind: 'Name', value: 'size' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfPages' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfWords' } },
          { kind: 'Field', name: { kind: 'Name', value: 'documentType' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DocumentUploadInfoFragment, unknown>;
export const FormInfoFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FormInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FormModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'schema' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isTemplate' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentUploadInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentUploadModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mime' } },
          { kind: 'Field', name: { kind: 'Name', value: 'size' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfPages' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfWords' } },
          { kind: 'Field', name: { kind: 'Name', value: 'documentType' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<FormInfoFragment, unknown>;
export const DocumentInfoFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'current' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentUploadInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentUploadModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mime' } },
          { kind: 'Field', name: { kind: 'Name', value: 'size' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfPages' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfWords' } },
          { kind: 'Field', name: { kind: 'Name', value: 'documentType' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DocumentInfoFragment, unknown>;
export const TeamInfoFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tagline' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currentFinance' } },
          { kind: 'Field', name: { kind: 'Name', value: 'directorsCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'managersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'membersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberCount' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'tags' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'categories' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamCategoryInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'joinForm' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'FormInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'documents' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'document' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentUploadInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentUploadModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mime' } },
          { kind: 'Field', name: { kind: 'Name', value: 'size' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfPages' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfWords' } },
          { kind: 'Field', name: { kind: 'Name', value: 'documentType' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ActorImageBareInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ActorImageModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamCategoryInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamCategoryModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'color' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'iconImage' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FormInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FormModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'schema' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isTemplate' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'current' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<TeamInfoFragment, unknown>;
export const FormSubmissionInfoFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FormSubmissionInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FormSubmissionModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'submission' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'linkedFormEdit' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'newVersion' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<FormSubmissionInfoFragment, unknown>;
export const TeamJoinInfoFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamJoinInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamJoinModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'team' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'askedRole' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
                { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                { kind: 'Field', name: { kind: 'Name', value: 'key' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'formSubmission' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'FormSubmissionInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'receivedRole' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
                { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                { kind: 'Field', name: { kind: 'Name', value: 'key' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'joiner' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createdBy' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'settledBy' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'settledAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'settledMessage' } },
          { kind: 'Field', name: { kind: 'Name', value: 'state' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ActorImageBareInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ActorImageModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FormSubmissionInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FormSubmissionModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'submission' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'linkedFormEdit' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'newVersion' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'UserInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'primaryEmail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ical' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roles' } },
          { kind: 'Field', name: { kind: 'Name', value: 'scopeRole' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<TeamJoinInfoFragment, unknown>;
export const MyInfoFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'MyInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'primaryEmail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ical' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roles' } },
          { kind: 'Field', name: { kind: 'Name', value: 'scopeRole' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'shortcuts' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'targetActor' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'actorKind' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'actorImages' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'individual' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'InlineFragment',
                              typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'org' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'InlineFragment',
                              typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamModel' } },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamInfo' } }],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'teamJoins' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamJoinInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'teamMemberships' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'roles' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'required' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'key' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'team' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ActorImageBareInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ActorImageModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamCategoryInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamCategoryModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'color' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'iconImage' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentUploadInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentUploadModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mime' } },
          { kind: 'Field', name: { kind: 'Name', value: 'size' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfPages' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfWords' } },
          { kind: 'Field', name: { kind: 'Name', value: 'documentType' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FormInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FormModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'schema' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isTemplate' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'current' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FormSubmissionInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FormSubmissionModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'submission' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'linkedFormEdit' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'newVersion' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'UserInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'primaryEmail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ical' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roles' } },
          { kind: 'Field', name: { kind: 'Name', value: 'scopeRole' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tagline' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currentFinance' } },
          { kind: 'Field', name: { kind: 'Name', value: 'directorsCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'managersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'membersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberCount' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'tags' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'categories' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamCategoryInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'joinForm' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'FormInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'documents' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'document' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamJoinInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamJoinModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'team' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'askedRole' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
                { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                { kind: 'Field', name: { kind: 'Name', value: 'key' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'formSubmission' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'FormSubmissionInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'receivedRole' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
                { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                { kind: 'Field', name: { kind: 'Name', value: 'key' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'joiner' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createdBy' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'settledBy' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'settledAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'settledMessage' } },
          { kind: 'Field', name: { kind: 'Name', value: 'state' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<MyInfoFragment, unknown>;
export const OrgInfoFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OrgInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'OrgModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'orgKind' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ActorImageBareInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ActorImageModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<OrgInfoFragment, unknown>;
export const EventInfoFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'EventInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TenantEventModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          { kind: 'Field', name: { kind: 'Name', value: 'title' } },
          { kind: 'Field', name: { kind: 'Name', value: 'start' } },
          { kind: 'Field', name: { kind: 'Name', value: 'end' } },
          { kind: 'Field', name: { kind: 'Name', value: 'state' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'orgs' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'orgKind' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actor' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'actorImages' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'supervisor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'location' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'street' } },
                { kind: 'Field', name: { kind: 'Name', value: 'city' } },
                { kind: 'Field', name: { kind: 'Name', value: 'state' } },
                { kind: 'Field', name: { kind: 'Name', value: 'zip' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'lastEventApprovalStep' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'stepOrder' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'rootContent' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ugcKind' } },
                { kind: 'Field', name: { kind: 'Name', value: 'isAnonymous' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'author' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ActorImageBareInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ActorImageModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'UserInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'primaryEmail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ical' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roles' } },
          { kind: 'Field', name: { kind: 'Name', value: 'scopeRole' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<EventInfoFragment, unknown>;
export const ProjectInfoFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProjectInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ProjectModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'expectedBudget' } },
          { kind: 'Field', name: { kind: 'Name', value: 'actualBudget' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'team' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createdBy' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'supervisor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'participants' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ActorImageBareInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ActorImageModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamCategoryInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamCategoryModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'color' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'iconImage' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentUploadInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentUploadModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mime' } },
          { kind: 'Field', name: { kind: 'Name', value: 'size' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfPages' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfWords' } },
          { kind: 'Field', name: { kind: 'Name', value: 'documentType' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FormInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FormModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'schema' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isTemplate' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'current' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tagline' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currentFinance' } },
          { kind: 'Field', name: { kind: 'Name', value: 'directorsCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'managersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'membersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberCount' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'tags' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'categories' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamCategoryInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'joinForm' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'FormInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'documents' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'document' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'UserInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'primaryEmail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ical' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roles' } },
          { kind: 'Field', name: { kind: 'Name', value: 'scopeRole' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ProjectInfoFragment, unknown>;
export const FinanceInfoFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FinanceInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FinanceModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'transaction' } },
          { kind: 'Field', name: { kind: 'Name', value: 'paymentDate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'paymentMethod' } },
          { kind: 'Field', name: { kind: 'Name', value: 'amountDue' } },
          { kind: 'Field', name: { kind: 'Name', value: 'amountPayed' } },
          { kind: 'Field', name: { kind: 'Name', value: 'state' } },
          { kind: 'Field', name: { kind: 'Name', value: 'category' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createdBy' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'receipts' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'linkedEvent' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'EventInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'linkedProject' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ProjectInfo' } }],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ActorImageBareInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ActorImageModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'UserInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'primaryEmail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ical' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roles' } },
          { kind: 'Field', name: { kind: 'Name', value: 'scopeRole' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamCategoryInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamCategoryModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'color' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'iconImage' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentUploadInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentUploadModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mime' } },
          { kind: 'Field', name: { kind: 'Name', value: 'size' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfPages' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfWords' } },
          { kind: 'Field', name: { kind: 'Name', value: 'documentType' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FormInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FormModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'schema' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isTemplate' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'current' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tagline' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currentFinance' } },
          { kind: 'Field', name: { kind: 'Name', value: 'directorsCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'managersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'membersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberCount' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'tags' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'categories' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamCategoryInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'joinForm' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'FormInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'documents' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'document' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'EventInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TenantEventModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          { kind: 'Field', name: { kind: 'Name', value: 'title' } },
          { kind: 'Field', name: { kind: 'Name', value: 'start' } },
          { kind: 'Field', name: { kind: 'Name', value: 'end' } },
          { kind: 'Field', name: { kind: 'Name', value: 'state' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'orgs' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'orgKind' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actor' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'actorImages' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'supervisor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'location' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'street' } },
                { kind: 'Field', name: { kind: 'Name', value: 'city' } },
                { kind: 'Field', name: { kind: 'Name', value: 'state' } },
                { kind: 'Field', name: { kind: 'Name', value: 'zip' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'lastEventApprovalStep' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'stepOrder' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'rootContent' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ugcKind' } },
                { kind: 'Field', name: { kind: 'Name', value: 'isAnonymous' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'author' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProjectInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ProjectModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'expectedBudget' } },
          { kind: 'Field', name: { kind: 'Name', value: 'actualBudget' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'team' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createdBy' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'supervisor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'participants' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<FinanceInfoFragment, unknown>;
export const TeamManageInfoFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamManageInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tagline' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currentFinance' } },
          { kind: 'Field', name: { kind: 'Name', value: 'directorsCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'managersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'membersCategoryName' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'tags' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'categories' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamCategoryInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'joinForm' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'FormInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'documents' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'document' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentInfo' } }],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'joins' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamJoinInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'roles' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                { kind: 'Field', name: { kind: 'Name', value: 'required' } },
                { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
                { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                { kind: 'Field', name: { kind: 'Name', value: 'key' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'members' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'user' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'actor' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'actorImages' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'roles' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'required' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'key' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'finances' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'FinanceInfo' } }],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentUploadInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentUploadModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mime' } },
          { kind: 'Field', name: { kind: 'Name', value: 'size' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfPages' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfWords' } },
          { kind: 'Field', name: { kind: 'Name', value: 'documentType' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FormSubmissionInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FormSubmissionModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'submission' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'linkedFormEdit' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'newVersion' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ActorImageBareInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ActorImageModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'UserInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'primaryEmail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ical' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roles' } },
          { kind: 'Field', name: { kind: 'Name', value: 'scopeRole' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'EventInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TenantEventModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          { kind: 'Field', name: { kind: 'Name', value: 'title' } },
          { kind: 'Field', name: { kind: 'Name', value: 'start' } },
          { kind: 'Field', name: { kind: 'Name', value: 'end' } },
          { kind: 'Field', name: { kind: 'Name', value: 'state' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'orgs' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'orgKind' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actor' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'actorImages' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'supervisor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'location' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'street' } },
                { kind: 'Field', name: { kind: 'Name', value: 'city' } },
                { kind: 'Field', name: { kind: 'Name', value: 'state' } },
                { kind: 'Field', name: { kind: 'Name', value: 'zip' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'lastEventApprovalStep' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'stepOrder' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'rootContent' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ugcKind' } },
                { kind: 'Field', name: { kind: 'Name', value: 'isAnonymous' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'author' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamCategoryInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamCategoryModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'color' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'iconImage' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FormInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FormModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'schema' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isTemplate' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'current' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tagline' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currentFinance' } },
          { kind: 'Field', name: { kind: 'Name', value: 'directorsCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'managersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'membersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberCount' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'tags' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'categories' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamCategoryInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'joinForm' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'FormInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'documents' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'document' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProjectInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ProjectModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'expectedBudget' } },
          { kind: 'Field', name: { kind: 'Name', value: 'actualBudget' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'team' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createdBy' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'supervisor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'participants' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamJoinInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamJoinModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'team' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'askedRole' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
                { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                { kind: 'Field', name: { kind: 'Name', value: 'key' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'formSubmission' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'FormSubmissionInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'receivedRole' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
                { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                { kind: 'Field', name: { kind: 'Name', value: 'key' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'joiner' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createdBy' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'settledBy' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'settledAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'settledMessage' } },
          { kind: 'Field', name: { kind: 'Name', value: 'state' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FinanceInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FinanceModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'transaction' } },
          { kind: 'Field', name: { kind: 'Name', value: 'paymentDate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'paymentMethod' } },
          { kind: 'Field', name: { kind: 'Name', value: 'amountDue' } },
          { kind: 'Field', name: { kind: 'Name', value: 'amountPayed' } },
          { kind: 'Field', name: { kind: 'Name', value: 'state' } },
          { kind: 'Field', name: { kind: 'Name', value: 'category' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createdBy' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'receipts' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'linkedEvent' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'EventInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'linkedProject' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ProjectInfo' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<TeamManageInfoFragment, unknown>;
export const TeamMembersInfoFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamMembersInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamInfo' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'roles' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                { kind: 'Field', name: { kind: 'Name', value: 'required' } },
                { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
                { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                { kind: 'Field', name: { kind: 'Name', value: 'key' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'members' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'user' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'actor' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'actorImages' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'roles' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'required' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'key' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ActorImageBareInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ActorImageModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamCategoryInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamCategoryModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'color' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'iconImage' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentUploadInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentUploadModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mime' } },
          { kind: 'Field', name: { kind: 'Name', value: 'size' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfPages' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfWords' } },
          { kind: 'Field', name: { kind: 'Name', value: 'documentType' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FormInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FormModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'schema' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isTemplate' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'current' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tagline' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currentFinance' } },
          { kind: 'Field', name: { kind: 'Name', value: 'directorsCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'managersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'membersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberCount' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'tags' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'categories' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamCategoryInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'joinForm' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'FormInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'documents' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'document' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<TeamMembersInfoFragment, unknown>;
export const TenantInfoFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TenantInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TenantModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'eventValidationForm' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'schema' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'documents' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'document' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentUploadInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentUploadModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mime' } },
          { kind: 'Field', name: { kind: 'Name', value: 'size' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfPages' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfWords' } },
          { kind: 'Field', name: { kind: 'Name', value: 'documentType' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ActorImageBareInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ActorImageModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'current' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<TenantInfoFragment, unknown>;
export const UserMembershipsInfoFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'UserMembershipsInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'primaryEmail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ical' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roles' } },
          { kind: 'Field', name: { kind: 'Name', value: 'scopeRole' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'teamMemberships' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'team' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamInfo' } }],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'roles' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'key' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ActorImageBareInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ActorImageModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamCategoryInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamCategoryModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'color' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'iconImage' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentUploadInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentUploadModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mime' } },
          { kind: 'Field', name: { kind: 'Name', value: 'size' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfPages' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfWords' } },
          { kind: 'Field', name: { kind: 'Name', value: 'documentType' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FormInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FormModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'schema' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isTemplate' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'current' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tagline' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currentFinance' } },
          { kind: 'Field', name: { kind: 'Name', value: 'directorsCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'managersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'membersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberCount' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'tags' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'categories' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamCategoryInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'joinForm' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'FormInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'documents' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'document' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UserMembershipsInfoFragment, unknown>;
export const LoginDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'login' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'username' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'password' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'login' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'username' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'username' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'password' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'password' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'user' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'MyInfo' } }],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'tenant' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TenantInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ActorImageBareInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ActorImageModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'UserInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'primaryEmail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ical' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roles' } },
          { kind: 'Field', name: { kind: 'Name', value: 'scopeRole' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamCategoryInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamCategoryModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'color' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'iconImage' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentUploadInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentUploadModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mime' } },
          { kind: 'Field', name: { kind: 'Name', value: 'size' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfPages' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfWords' } },
          { kind: 'Field', name: { kind: 'Name', value: 'documentType' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FormInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FormModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'schema' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isTemplate' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'current' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tagline' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currentFinance' } },
          { kind: 'Field', name: { kind: 'Name', value: 'directorsCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'managersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'membersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberCount' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'tags' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'categories' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamCategoryInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'joinForm' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'FormInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'documents' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'document' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FormSubmissionInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FormSubmissionModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'submission' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'linkedFormEdit' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'newVersion' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamJoinInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamJoinModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'team' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'askedRole' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
                { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                { kind: 'Field', name: { kind: 'Name', value: 'key' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'formSubmission' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'FormSubmissionInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'receivedRole' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
                { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                { kind: 'Field', name: { kind: 'Name', value: 'key' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'joiner' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createdBy' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'settledBy' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'settledAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'settledMessage' } },
          { kind: 'Field', name: { kind: 'Name', value: 'state' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'MyInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'primaryEmail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ical' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roles' } },
          { kind: 'Field', name: { kind: 'Name', value: 'scopeRole' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'shortcuts' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'targetActor' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'actorKind' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'actorImages' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'individual' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'InlineFragment',
                              typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'org' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'InlineFragment',
                              typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamModel' } },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamInfo' } }],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'teamJoins' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamJoinInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'teamMemberships' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'roles' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'required' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'key' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'team' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TenantInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TenantModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'eventValidationForm' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'schema' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'documents' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'document' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'logout' },
      selectionSet: { kind: 'SelectionSet', selections: [{ kind: 'Field', name: { kind: 'Name', value: 'logout' } }] },
    },
  ],
} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const CreateEventApprovalDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'createEventApproval' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'eventApproval' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'CreateEventApprovalDto' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createEventApproval' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'eventApproval' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'eventApproval' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'deletedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                { kind: 'Field', name: { kind: 'Name', value: 'approved' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'step' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'createdBy' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'event' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'EventInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ActorImageBareInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ActorImageModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'UserInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'primaryEmail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ical' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roles' } },
          { kind: 'Field', name: { kind: 'Name', value: 'scopeRole' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'EventInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TenantEventModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          { kind: 'Field', name: { kind: 'Name', value: 'title' } },
          { kind: 'Field', name: { kind: 'Name', value: 'start' } },
          { kind: 'Field', name: { kind: 'Name', value: 'end' } },
          { kind: 'Field', name: { kind: 'Name', value: 'state' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'orgs' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'orgKind' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actor' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'actorImages' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'supervisor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'location' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'street' } },
                { kind: 'Field', name: { kind: 'Name', value: 'city' } },
                { kind: 'Field', name: { kind: 'Name', value: 'state' } },
                { kind: 'Field', name: { kind: 'Name', value: 'zip' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'lastEventApprovalStep' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'stepOrder' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'rootContent' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ugcKind' } },
                { kind: 'Field', name: { kind: 'Name', value: 'isAnonymous' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'author' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateEventApprovalMutation, CreateEventApprovalMutationVariables>;
export const CreateEventDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'createEvent' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'event' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'CreateEventDto' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createEvent' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'event' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'event' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'EventInfo' } }],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ActorImageBareInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ActorImageModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'UserInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'primaryEmail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ical' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roles' } },
          { kind: 'Field', name: { kind: 'Name', value: 'scopeRole' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'EventInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TenantEventModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          { kind: 'Field', name: { kind: 'Name', value: 'title' } },
          { kind: 'Field', name: { kind: 'Name', value: 'start' } },
          { kind: 'Field', name: { kind: 'Name', value: 'end' } },
          { kind: 'Field', name: { kind: 'Name', value: 'state' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'orgs' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'orgKind' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actor' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'actorImages' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'supervisor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'location' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'street' } },
                { kind: 'Field', name: { kind: 'Name', value: 'city' } },
                { kind: 'Field', name: { kind: 'Name', value: 'state' } },
                { kind: 'Field', name: { kind: 'Name', value: 'zip' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'lastEventApprovalStep' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'stepOrder' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'rootContent' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ugcKind' } },
                { kind: 'Field', name: { kind: 'Name', value: 'isAnonymous' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'author' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateEventMutation, CreateEventMutationVariables>;
export const UpdateEventDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'updateEvent' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'updateEvent' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'UpdateEventDto' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateEvent' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'updateEvent' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'updateEvent' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'EventInfo' } }],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ActorImageBareInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ActorImageModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'UserInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'primaryEmail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ical' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roles' } },
          { kind: 'Field', name: { kind: 'Name', value: 'scopeRole' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'EventInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TenantEventModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          { kind: 'Field', name: { kind: 'Name', value: 'title' } },
          { kind: 'Field', name: { kind: 'Name', value: 'start' } },
          { kind: 'Field', name: { kind: 'Name', value: 'end' } },
          { kind: 'Field', name: { kind: 'Name', value: 'state' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'orgs' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'orgKind' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actor' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'actorImages' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'supervisor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'location' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'street' } },
                { kind: 'Field', name: { kind: 'Name', value: 'city' } },
                { kind: 'Field', name: { kind: 'Name', value: 'state' } },
                { kind: 'Field', name: { kind: 'Name', value: 'zip' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'lastEventApprovalStep' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'stepOrder' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'rootContent' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ugcKind' } },
                { kind: 'Field', name: { kind: 'Name', value: 'isAnonymous' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'author' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateEventMutation, UpdateEventMutationVariables>;
export const CreateFinanceDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'createFinance' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'finance' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'CreateFinanceDto' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createFinance' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'finance' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'finance' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'team' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'currentFinance' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'finances' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'FinanceInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ActorImageBareInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ActorImageModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'UserInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'primaryEmail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ical' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roles' } },
          { kind: 'Field', name: { kind: 'Name', value: 'scopeRole' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentUploadInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentUploadModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mime' } },
          { kind: 'Field', name: { kind: 'Name', value: 'size' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfPages' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfWords' } },
          { kind: 'Field', name: { kind: 'Name', value: 'documentType' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'EventInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TenantEventModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          { kind: 'Field', name: { kind: 'Name', value: 'title' } },
          { kind: 'Field', name: { kind: 'Name', value: 'start' } },
          { kind: 'Field', name: { kind: 'Name', value: 'end' } },
          { kind: 'Field', name: { kind: 'Name', value: 'state' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'orgs' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'orgKind' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actor' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'actorImages' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'supervisor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'location' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'street' } },
                { kind: 'Field', name: { kind: 'Name', value: 'city' } },
                { kind: 'Field', name: { kind: 'Name', value: 'state' } },
                { kind: 'Field', name: { kind: 'Name', value: 'zip' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'lastEventApprovalStep' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'stepOrder' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'rootContent' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ugcKind' } },
                { kind: 'Field', name: { kind: 'Name', value: 'isAnonymous' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'author' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamCategoryInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamCategoryModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'color' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'iconImage' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FormInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FormModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'schema' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isTemplate' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'current' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tagline' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currentFinance' } },
          { kind: 'Field', name: { kind: 'Name', value: 'directorsCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'managersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'membersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberCount' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'tags' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'categories' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamCategoryInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'joinForm' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'FormInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'documents' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'document' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProjectInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ProjectModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'expectedBudget' } },
          { kind: 'Field', name: { kind: 'Name', value: 'actualBudget' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'team' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createdBy' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'supervisor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'participants' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FinanceInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FinanceModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'transaction' } },
          { kind: 'Field', name: { kind: 'Name', value: 'paymentDate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'paymentMethod' } },
          { kind: 'Field', name: { kind: 'Name', value: 'amountDue' } },
          { kind: 'Field', name: { kind: 'Name', value: 'amountPayed' } },
          { kind: 'Field', name: { kind: 'Name', value: 'state' } },
          { kind: 'Field', name: { kind: 'Name', value: 'category' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createdBy' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'receipts' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'linkedEvent' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'EventInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'linkedProject' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ProjectInfo' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateFinanceMutation, CreateFinanceMutationVariables>;
export const UpdateFinanceDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'updateFinance' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'updateFinance' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'UpdateFinanceDto' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateFinance' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'updateFinance' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'updateFinance' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'FinanceInfo' } }],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ActorImageBareInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ActorImageModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'UserInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'primaryEmail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ical' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roles' } },
          { kind: 'Field', name: { kind: 'Name', value: 'scopeRole' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentUploadInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentUploadModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mime' } },
          { kind: 'Field', name: { kind: 'Name', value: 'size' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfPages' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfWords' } },
          { kind: 'Field', name: { kind: 'Name', value: 'documentType' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'EventInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TenantEventModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          { kind: 'Field', name: { kind: 'Name', value: 'title' } },
          { kind: 'Field', name: { kind: 'Name', value: 'start' } },
          { kind: 'Field', name: { kind: 'Name', value: 'end' } },
          { kind: 'Field', name: { kind: 'Name', value: 'state' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'orgs' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'orgKind' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actor' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'actorImages' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'supervisor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'location' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'street' } },
                { kind: 'Field', name: { kind: 'Name', value: 'city' } },
                { kind: 'Field', name: { kind: 'Name', value: 'state' } },
                { kind: 'Field', name: { kind: 'Name', value: 'zip' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'lastEventApprovalStep' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'stepOrder' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'rootContent' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ugcKind' } },
                { kind: 'Field', name: { kind: 'Name', value: 'isAnonymous' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'author' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamCategoryInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamCategoryModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'color' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'iconImage' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FormInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FormModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'schema' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isTemplate' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'current' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tagline' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currentFinance' } },
          { kind: 'Field', name: { kind: 'Name', value: 'directorsCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'managersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'membersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberCount' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'tags' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'categories' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamCategoryInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'joinForm' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'FormInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'documents' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'document' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProjectInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ProjectModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'expectedBudget' } },
          { kind: 'Field', name: { kind: 'Name', value: 'actualBudget' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'team' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createdBy' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'supervisor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'participants' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FinanceInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FinanceModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'transaction' } },
          { kind: 'Field', name: { kind: 'Name', value: 'paymentDate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'paymentMethod' } },
          { kind: 'Field', name: { kind: 'Name', value: 'amountDue' } },
          { kind: 'Field', name: { kind: 'Name', value: 'amountPayed' } },
          { kind: 'Field', name: { kind: 'Name', value: 'state' } },
          { kind: 'Field', name: { kind: 'Name', value: 'category' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createdBy' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'receipts' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'linkedEvent' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'EventInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'linkedProject' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ProjectInfo' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateFinanceMutation, UpdateFinanceMutationVariables>;
export const CreateProjectDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'createProject' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'project' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'CreateProjectDto' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createProject' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'project' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'project' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ProjectInfo' } }],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ActorImageBareInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ActorImageModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamCategoryInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamCategoryModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'color' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'iconImage' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentUploadInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentUploadModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mime' } },
          { kind: 'Field', name: { kind: 'Name', value: 'size' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfPages' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfWords' } },
          { kind: 'Field', name: { kind: 'Name', value: 'documentType' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FormInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FormModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'schema' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isTemplate' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'current' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tagline' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currentFinance' } },
          { kind: 'Field', name: { kind: 'Name', value: 'directorsCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'managersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'membersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberCount' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'tags' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'categories' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamCategoryInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'joinForm' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'FormInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'documents' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'document' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'UserInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'primaryEmail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ical' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roles' } },
          { kind: 'Field', name: { kind: 'Name', value: 'scopeRole' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProjectInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ProjectModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'expectedBudget' } },
          { kind: 'Field', name: { kind: 'Name', value: 'actualBudget' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'team' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createdBy' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'supervisor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'participants' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateProjectMutation, CreateProjectMutationVariables>;
export const UpdateProjectDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'updateProject' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'updateProject' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'UpdateProjectDto' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateProject' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'updateProject' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'updateProject' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ProjectInfo' } }],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ActorImageBareInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ActorImageModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamCategoryInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamCategoryModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'color' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'iconImage' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentUploadInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentUploadModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mime' } },
          { kind: 'Field', name: { kind: 'Name', value: 'size' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfPages' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfWords' } },
          { kind: 'Field', name: { kind: 'Name', value: 'documentType' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FormInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FormModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'schema' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isTemplate' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'current' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tagline' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currentFinance' } },
          { kind: 'Field', name: { kind: 'Name', value: 'directorsCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'managersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'membersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberCount' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'tags' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'categories' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamCategoryInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'joinForm' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'FormInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'documents' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'document' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'UserInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'primaryEmail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ical' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roles' } },
          { kind: 'Field', name: { kind: 'Name', value: 'scopeRole' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProjectInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ProjectModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'expectedBudget' } },
          { kind: 'Field', name: { kind: 'Name', value: 'actualBudget' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'team' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createdBy' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'supervisor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'participants' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateProjectMutation, UpdateProjectMutationVariables>;
export const CreateTeamJoinDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'createTeamJoin' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'teamJoin' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'CreateTeamJoinDto' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createTeamJoin' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'teamJoin' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'teamJoin' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'team' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'joins' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamJoinInfo' } }],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'joiner' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'teamJoins' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamJoinInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FormSubmissionInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FormSubmissionModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'submission' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'linkedFormEdit' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'newVersion' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ActorImageBareInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ActorImageModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'UserInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'primaryEmail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ical' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roles' } },
          { kind: 'Field', name: { kind: 'Name', value: 'scopeRole' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamJoinInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamJoinModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'team' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'askedRole' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
                { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                { kind: 'Field', name: { kind: 'Name', value: 'key' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'formSubmission' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'FormSubmissionInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'receivedRole' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
                { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                { kind: 'Field', name: { kind: 'Name', value: 'key' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'joiner' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createdBy' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'settledBy' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'settledAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'settledMessage' } },
          { kind: 'Field', name: { kind: 'Name', value: 'state' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateTeamJoinMutation, CreateTeamJoinMutationVariables>;
export const UpdateTeamJoinDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'updateTeamJoin' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'updateTeamJoin' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'UpdateTeamJoinDto' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateTeamJoin' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'updateTeamJoin' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'updateTeamJoin' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'team' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'joins' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamJoinInfo' } }],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'members' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'user' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'actor' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'actorImages' },
                                          selectionSet: {
                                            kind: 'SelectionSet',
                                            selections: [
                                              {
                                                kind: 'FragmentSpread',
                                                name: { kind: 'Name', value: 'ActorImageBareInfo' },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'roles' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'required' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'key' } },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'joiner' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'teamJoins' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamJoinInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FormSubmissionInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FormSubmissionModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'submission' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'linkedFormEdit' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'newVersion' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ActorImageBareInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ActorImageModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'UserInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'primaryEmail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ical' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roles' } },
          { kind: 'Field', name: { kind: 'Name', value: 'scopeRole' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamJoinInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamJoinModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'team' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'askedRole' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
                { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                { kind: 'Field', name: { kind: 'Name', value: 'key' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'formSubmission' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'FormSubmissionInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'receivedRole' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
                { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                { kind: 'Field', name: { kind: 'Name', value: 'key' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'joiner' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createdBy' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'settledBy' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'settledAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'settledMessage' } },
          { kind: 'Field', name: { kind: 'Name', value: 'state' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateTeamJoinMutation, UpdateTeamJoinMutationVariables>;
export const DeactivateTeamImageDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'deactivateTeamImage' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'actorImageType' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ActorImageType' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deactivateTeamImage' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'actorImageType' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'actorImageType' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actor' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'actorImages' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ActorImageBareInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ActorImageModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DeactivateTeamImageMutation, DeactivateTeamImageMutationVariables>;
export const TeamAddDocumentDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'teamAddDocument' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'teamId' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'createOrgDocument' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'CreateOrgDocumentDto' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'documentFile' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Upload' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'teamAddDocument' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'teamId' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'teamId' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'createOrgDocument' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'createOrgDocument' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'documentFile' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'documentFile' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'org' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'documents' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'document' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentInfo' } }],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentUploadInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentUploadModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mime' } },
          { kind: 'Field', name: { kind: 'Name', value: 'size' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfPages' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfWords' } },
          { kind: 'Field', name: { kind: 'Name', value: 'documentType' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'current' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<TeamAddDocumentMutation, TeamAddDocumentMutationVariables>;
export const UpdateTeamDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'updateTeam' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'updateTeam' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'UpdateTeamDto' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'avatar' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Upload' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'banner' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Upload' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateTeam' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'updateTeam' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'updateTeam' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'avatar' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'avatar' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'banner' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'banner' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamManageInfo' } }],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ActorImageBareInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ActorImageModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamCategoryInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamCategoryModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'color' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'iconImage' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentUploadInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentUploadModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mime' } },
          { kind: 'Field', name: { kind: 'Name', value: 'size' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfPages' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfWords' } },
          { kind: 'Field', name: { kind: 'Name', value: 'documentType' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FormInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FormModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'schema' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isTemplate' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'current' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FormSubmissionInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FormSubmissionModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'submission' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'linkedFormEdit' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'newVersion' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'UserInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'primaryEmail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ical' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roles' } },
          { kind: 'Field', name: { kind: 'Name', value: 'scopeRole' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamJoinInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamJoinModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'team' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'askedRole' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
                { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                { kind: 'Field', name: { kind: 'Name', value: 'key' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'formSubmission' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'FormSubmissionInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'receivedRole' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
                { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                { kind: 'Field', name: { kind: 'Name', value: 'key' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'joiner' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createdBy' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'settledBy' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'settledAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'settledMessage' } },
          { kind: 'Field', name: { kind: 'Name', value: 'state' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'EventInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TenantEventModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          { kind: 'Field', name: { kind: 'Name', value: 'title' } },
          { kind: 'Field', name: { kind: 'Name', value: 'start' } },
          { kind: 'Field', name: { kind: 'Name', value: 'end' } },
          { kind: 'Field', name: { kind: 'Name', value: 'state' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'orgs' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'orgKind' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actor' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'actorImages' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'supervisor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'location' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'street' } },
                { kind: 'Field', name: { kind: 'Name', value: 'city' } },
                { kind: 'Field', name: { kind: 'Name', value: 'state' } },
                { kind: 'Field', name: { kind: 'Name', value: 'zip' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'lastEventApprovalStep' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'stepOrder' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'rootContent' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ugcKind' } },
                { kind: 'Field', name: { kind: 'Name', value: 'isAnonymous' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'author' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tagline' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currentFinance' } },
          { kind: 'Field', name: { kind: 'Name', value: 'directorsCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'managersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'membersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberCount' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'tags' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'categories' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamCategoryInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'joinForm' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'FormInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'documents' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'document' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProjectInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ProjectModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'expectedBudget' } },
          { kind: 'Field', name: { kind: 'Name', value: 'actualBudget' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'team' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createdBy' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'supervisor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'participants' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FinanceInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FinanceModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'transaction' } },
          { kind: 'Field', name: { kind: 'Name', value: 'paymentDate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'paymentMethod' } },
          { kind: 'Field', name: { kind: 'Name', value: 'amountDue' } },
          { kind: 'Field', name: { kind: 'Name', value: 'amountPayed' } },
          { kind: 'Field', name: { kind: 'Name', value: 'state' } },
          { kind: 'Field', name: { kind: 'Name', value: 'category' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createdBy' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'receipts' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'linkedEvent' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'EventInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'linkedProject' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ProjectInfo' } }],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamManageInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tagline' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currentFinance' } },
          { kind: 'Field', name: { kind: 'Name', value: 'directorsCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'managersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'membersCategoryName' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'tags' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'categories' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamCategoryInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'joinForm' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'FormInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'documents' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'document' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentInfo' } }],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'joins' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamJoinInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'roles' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                { kind: 'Field', name: { kind: 'Name', value: 'required' } },
                { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
                { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                { kind: 'Field', name: { kind: 'Name', value: 'key' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'members' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'user' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'actor' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'actorImages' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'roles' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'required' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'key' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'finances' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'FinanceInfo' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateTeamMutation, UpdateTeamMutationVariables>;
export const TenantAddDocumentDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'tenantAddDocument' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'tenantId' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'createDocument' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'CreateDocumentDto' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'documentFile' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Upload' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'tenantAddDocument' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'tenantId' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'tenantId' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'createDocument' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'createDocument' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'documentFile' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'documentFile' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'org' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'documents' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'document' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentInfo' } }],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentUploadInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentUploadModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mime' } },
          { kind: 'Field', name: { kind: 'Name', value: 'size' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfPages' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfWords' } },
          { kind: 'Field', name: { kind: 'Name', value: 'documentType' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'current' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<TenantAddDocumentMutation, TenantAddDocumentMutationVariables>;
export const DeactivateUserImageDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'deactivateUserImage' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'actorImageType' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ActorImageType' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deactivateUserImage' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'actorImageType' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'actorImageType' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actor' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'actorImages' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ActorImageBareInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ActorImageModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DeactivateUserImageMutation, DeactivateUserImageMutationVariables>;
export const UpdateUserDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'updateUser' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'updateUser' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'UpdateUserDto' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'avatar' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Upload' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'banner' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Upload' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateUser' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'updateUser' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'updateUser' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'avatar' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'avatar' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'banner' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'banner' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ActorImageBareInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ActorImageModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'UserInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'primaryEmail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ical' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roles' } },
          { kind: 'Field', name: { kind: 'Name', value: 'scopeRole' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateUserMutation, UpdateUserMutationVariables>;
export const GetEventsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getEvents' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'events' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'edges' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'EventInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ActorImageBareInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ActorImageModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'UserInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'primaryEmail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ical' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roles' } },
          { kind: 'Field', name: { kind: 'Name', value: 'scopeRole' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'EventInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TenantEventModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          { kind: 'Field', name: { kind: 'Name', value: 'title' } },
          { kind: 'Field', name: { kind: 'Name', value: 'start' } },
          { kind: 'Field', name: { kind: 'Name', value: 'end' } },
          { kind: 'Field', name: { kind: 'Name', value: 'state' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'orgs' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'orgKind' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actor' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'actorImages' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'supervisor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'location' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'street' } },
                { kind: 'Field', name: { kind: 'Name', value: 'city' } },
                { kind: 'Field', name: { kind: 'Name', value: 'state' } },
                { kind: 'Field', name: { kind: 'Name', value: 'zip' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'lastEventApprovalStep' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'stepOrder' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'rootContent' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ugcKind' } },
                { kind: 'Field', name: { kind: 'Name', value: 'isAnonymous' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'author' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetEventsQuery, GetEventsQueryVariables>;
export const GetFinancesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getFinances' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'teamId' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'financesByTeam' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'teamId' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'teamId' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'options' },
                value: { kind: 'ObjectValue', fields: [] },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'edges' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'FinanceInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ActorImageBareInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ActorImageModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'UserInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'primaryEmail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ical' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roles' } },
          { kind: 'Field', name: { kind: 'Name', value: 'scopeRole' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentUploadInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentUploadModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mime' } },
          { kind: 'Field', name: { kind: 'Name', value: 'size' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfPages' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfWords' } },
          { kind: 'Field', name: { kind: 'Name', value: 'documentType' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'EventInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TenantEventModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          { kind: 'Field', name: { kind: 'Name', value: 'title' } },
          { kind: 'Field', name: { kind: 'Name', value: 'start' } },
          { kind: 'Field', name: { kind: 'Name', value: 'end' } },
          { kind: 'Field', name: { kind: 'Name', value: 'state' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'orgs' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'orgKind' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actor' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'actorImages' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'supervisor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'location' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'street' } },
                { kind: 'Field', name: { kind: 'Name', value: 'city' } },
                { kind: 'Field', name: { kind: 'Name', value: 'state' } },
                { kind: 'Field', name: { kind: 'Name', value: 'zip' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'lastEventApprovalStep' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'stepOrder' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'rootContent' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ugcKind' } },
                { kind: 'Field', name: { kind: 'Name', value: 'isAnonymous' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'author' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamCategoryInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamCategoryModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'color' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'iconImage' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FormInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FormModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'schema' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isTemplate' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'current' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tagline' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currentFinance' } },
          { kind: 'Field', name: { kind: 'Name', value: 'directorsCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'managersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'membersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberCount' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'tags' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'categories' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamCategoryInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'joinForm' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'FormInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'documents' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'document' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProjectInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ProjectModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'expectedBudget' } },
          { kind: 'Field', name: { kind: 'Name', value: 'actualBudget' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'team' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createdBy' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'supervisor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'participants' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FinanceInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FinanceModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'transaction' } },
          { kind: 'Field', name: { kind: 'Name', value: 'paymentDate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'paymentMethod' } },
          { kind: 'Field', name: { kind: 'Name', value: 'amountDue' } },
          { kind: 'Field', name: { kind: 'Name', value: 'amountPayed' } },
          { kind: 'Field', name: { kind: 'Name', value: 'state' } },
          { kind: 'Field', name: { kind: 'Name', value: 'category' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createdBy' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'receipts' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'linkedEvent' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'EventInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'linkedProject' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ProjectInfo' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetFinancesQuery, GetFinancesQueryVariables>;
export const MeDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'me' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'me' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'user' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'MyInfo' } }],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'tenant' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TenantInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ActorImageBareInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ActorImageModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'UserInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'primaryEmail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ical' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roles' } },
          { kind: 'Field', name: { kind: 'Name', value: 'scopeRole' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamCategoryInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamCategoryModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'color' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'iconImage' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentUploadInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentUploadModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mime' } },
          { kind: 'Field', name: { kind: 'Name', value: 'size' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfPages' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfWords' } },
          { kind: 'Field', name: { kind: 'Name', value: 'documentType' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FormInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FormModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'schema' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isTemplate' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'current' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tagline' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currentFinance' } },
          { kind: 'Field', name: { kind: 'Name', value: 'directorsCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'managersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'membersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberCount' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'tags' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'categories' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamCategoryInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'joinForm' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'FormInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'documents' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'document' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FormSubmissionInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FormSubmissionModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'submission' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'linkedFormEdit' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'newVersion' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamJoinInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamJoinModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'team' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'askedRole' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
                { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                { kind: 'Field', name: { kind: 'Name', value: 'key' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'formSubmission' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'FormSubmissionInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'receivedRole' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
                { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                { kind: 'Field', name: { kind: 'Name', value: 'key' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'joiner' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createdBy' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'settledBy' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'settledAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'settledMessage' } },
          { kind: 'Field', name: { kind: 'Name', value: 'state' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'MyInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'primaryEmail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ical' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roles' } },
          { kind: 'Field', name: { kind: 'Name', value: 'scopeRole' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'shortcuts' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'targetActor' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'actorKind' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'actorImages' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'individual' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'InlineFragment',
                              typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'org' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'InlineFragment',
                              typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamModel' } },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamInfo' } }],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'teamJoins' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamJoinInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'teamMemberships' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'roles' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'required' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'key' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'team' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TenantInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TenantModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'eventValidationForm' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'schema' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'documents' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'document' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const GetTeamByIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getTeamById' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'teamById' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamInfo' } }],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ActorImageBareInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ActorImageModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamCategoryInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamCategoryModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'color' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'iconImage' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentUploadInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentUploadModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mime' } },
          { kind: 'Field', name: { kind: 'Name', value: 'size' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfPages' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfWords' } },
          { kind: 'Field', name: { kind: 'Name', value: 'documentType' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FormInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FormModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'schema' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isTemplate' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'current' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tagline' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currentFinance' } },
          { kind: 'Field', name: { kind: 'Name', value: 'directorsCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'managersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'membersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberCount' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'tags' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'categories' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamCategoryInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'joinForm' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'FormInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'documents' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'document' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetTeamByIdQuery, GetTeamByIdQueryVariables>;
export const GetTeamCategoriesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getTeamCategories' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'teamCategories' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'edges' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamCategoryInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamCategoryInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamCategoryModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'color' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'iconImage' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetTeamCategoriesQuery, GetTeamCategoriesQueryVariables>;
export const GetTeamCategoryBySlugDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getTeamCategoryBySlug' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'slug' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'teamCategoryBySlug' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'slug' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'slug' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamCategoryInfo' } }],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamCategoryInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamCategoryModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'color' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'iconImage' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetTeamCategoryBySlugQuery, GetTeamCategoryBySlugQueryVariables>;
export const GetTeamDetailsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getTeamDetails' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'slug' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'teamBySlug' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'slug' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'slug' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamMembersInfo' } }],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ActorImageBareInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ActorImageModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamCategoryInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamCategoryModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'color' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'iconImage' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentUploadInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentUploadModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mime' } },
          { kind: 'Field', name: { kind: 'Name', value: 'size' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfPages' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfWords' } },
          { kind: 'Field', name: { kind: 'Name', value: 'documentType' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FormInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FormModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'schema' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isTemplate' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'current' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tagline' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currentFinance' } },
          { kind: 'Field', name: { kind: 'Name', value: 'directorsCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'managersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'membersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberCount' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'tags' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'categories' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamCategoryInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'joinForm' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'FormInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'documents' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'document' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamMembersInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamInfo' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'roles' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                { kind: 'Field', name: { kind: 'Name', value: 'required' } },
                { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
                { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                { kind: 'Field', name: { kind: 'Name', value: 'key' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'members' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'user' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'actor' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'actorImages' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'roles' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'required' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'key' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetTeamDetailsQuery, GetTeamDetailsQueryVariables>;
export const GetTeamManageDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getTeamManage' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'teamById' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamMembersInfo' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'finances' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'FinanceInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ActorImageBareInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ActorImageModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamCategoryInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamCategoryModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'color' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'iconImage' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentUploadInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentUploadModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mime' } },
          { kind: 'Field', name: { kind: 'Name', value: 'size' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfPages' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfWords' } },
          { kind: 'Field', name: { kind: 'Name', value: 'documentType' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FormInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FormModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'schema' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isTemplate' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'current' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tagline' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currentFinance' } },
          { kind: 'Field', name: { kind: 'Name', value: 'directorsCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'managersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'membersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberCount' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'tags' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'categories' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamCategoryInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'joinForm' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'FormInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'documents' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'document' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'UserInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'primaryEmail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ical' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roles' } },
          { kind: 'Field', name: { kind: 'Name', value: 'scopeRole' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'EventInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TenantEventModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          { kind: 'Field', name: { kind: 'Name', value: 'title' } },
          { kind: 'Field', name: { kind: 'Name', value: 'start' } },
          { kind: 'Field', name: { kind: 'Name', value: 'end' } },
          { kind: 'Field', name: { kind: 'Name', value: 'state' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'orgs' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'orgKind' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actor' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'actorImages' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'supervisor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'location' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'street' } },
                { kind: 'Field', name: { kind: 'Name', value: 'city' } },
                { kind: 'Field', name: { kind: 'Name', value: 'state' } },
                { kind: 'Field', name: { kind: 'Name', value: 'zip' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'lastEventApprovalStep' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'stepOrder' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'rootContent' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ugcKind' } },
                { kind: 'Field', name: { kind: 'Name', value: 'isAnonymous' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'author' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProjectInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ProjectModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'expectedBudget' } },
          { kind: 'Field', name: { kind: 'Name', value: 'actualBudget' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'team' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createdBy' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'supervisor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'participants' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamMembersInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamInfo' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'roles' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                { kind: 'Field', name: { kind: 'Name', value: 'required' } },
                { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
                { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                { kind: 'Field', name: { kind: 'Name', value: 'key' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'members' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'user' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'actor' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'actorImages' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'roles' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'required' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'key' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FinanceInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FinanceModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'transaction' } },
          { kind: 'Field', name: { kind: 'Name', value: 'paymentDate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'paymentMethod' } },
          { kind: 'Field', name: { kind: 'Name', value: 'amountDue' } },
          { kind: 'Field', name: { kind: 'Name', value: 'amountPayed' } },
          { kind: 'Field', name: { kind: 'Name', value: 'state' } },
          { kind: 'Field', name: { kind: 'Name', value: 'category' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createdBy' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'receipts' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'linkedEvent' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'EventInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'linkedProject' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ProjectInfo' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetTeamManageQuery, GetTeamManageQueryVariables>;
export const GetTeamManageBySlugDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getTeamManageBySlug' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'slug' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'teamBySlug' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'slug' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'slug' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamManageInfo' } }],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ActorImageBareInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ActorImageModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamCategoryInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamCategoryModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'color' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'iconImage' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentUploadInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentUploadModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mime' } },
          { kind: 'Field', name: { kind: 'Name', value: 'size' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfPages' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfWords' } },
          { kind: 'Field', name: { kind: 'Name', value: 'documentType' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FormInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FormModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'schema' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isTemplate' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'current' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FormSubmissionInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FormSubmissionModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'submission' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'linkedFormEdit' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'newVersion' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'UserInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'primaryEmail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ical' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roles' } },
          { kind: 'Field', name: { kind: 'Name', value: 'scopeRole' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamJoinInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamJoinModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'team' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'askedRole' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
                { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                { kind: 'Field', name: { kind: 'Name', value: 'key' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'formSubmission' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'FormSubmissionInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'receivedRole' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
                { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                { kind: 'Field', name: { kind: 'Name', value: 'key' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'joiner' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createdBy' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'settledBy' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'settledAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'settledMessage' } },
          { kind: 'Field', name: { kind: 'Name', value: 'state' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'EventInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TenantEventModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          { kind: 'Field', name: { kind: 'Name', value: 'title' } },
          { kind: 'Field', name: { kind: 'Name', value: 'start' } },
          { kind: 'Field', name: { kind: 'Name', value: 'end' } },
          { kind: 'Field', name: { kind: 'Name', value: 'state' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'orgs' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'orgKind' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actor' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'actorImages' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'supervisor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'location' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'street' } },
                { kind: 'Field', name: { kind: 'Name', value: 'city' } },
                { kind: 'Field', name: { kind: 'Name', value: 'state' } },
                { kind: 'Field', name: { kind: 'Name', value: 'zip' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'lastEventApprovalStep' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'stepOrder' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'rootContent' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ugcKind' } },
                { kind: 'Field', name: { kind: 'Name', value: 'isAnonymous' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'author' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tagline' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currentFinance' } },
          { kind: 'Field', name: { kind: 'Name', value: 'directorsCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'managersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'membersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberCount' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'tags' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'categories' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamCategoryInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'joinForm' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'FormInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'documents' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'document' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProjectInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ProjectModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'expectedBudget' } },
          { kind: 'Field', name: { kind: 'Name', value: 'actualBudget' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'team' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createdBy' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'supervisor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'participants' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FinanceInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FinanceModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'transaction' } },
          { kind: 'Field', name: { kind: 'Name', value: 'paymentDate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'paymentMethod' } },
          { kind: 'Field', name: { kind: 'Name', value: 'amountDue' } },
          { kind: 'Field', name: { kind: 'Name', value: 'amountPayed' } },
          { kind: 'Field', name: { kind: 'Name', value: 'state' } },
          { kind: 'Field', name: { kind: 'Name', value: 'category' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createdBy' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'receipts' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'linkedEvent' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'EventInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'linkedProject' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ProjectInfo' } }],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamManageInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tagline' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currentFinance' } },
          { kind: 'Field', name: { kind: 'Name', value: 'directorsCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'managersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'membersCategoryName' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'tags' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'categories' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamCategoryInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'joinForm' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'FormInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'documents' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'document' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentInfo' } }],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'joins' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamJoinInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'roles' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                { kind: 'Field', name: { kind: 'Name', value: 'required' } },
                { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
                { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                { kind: 'Field', name: { kind: 'Name', value: 'key' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'members' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'user' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'actor' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'actorImages' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'roles' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'required' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'key' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'finances' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'FinanceInfo' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetTeamManageBySlugQuery, GetTeamManageBySlugQueryVariables>;
export const GetTeamWithMembersDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getTeamWithMembers' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'teamById' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamMembersInfo' } }],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ActorImageBareInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ActorImageModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamCategoryInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamCategoryModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'color' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'iconImage' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentUploadInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentUploadModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mime' } },
          { kind: 'Field', name: { kind: 'Name', value: 'size' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfPages' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfWords' } },
          { kind: 'Field', name: { kind: 'Name', value: 'documentType' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FormInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FormModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'schema' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isTemplate' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'current' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tagline' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currentFinance' } },
          { kind: 'Field', name: { kind: 'Name', value: 'directorsCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'managersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'membersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberCount' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'tags' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'categories' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamCategoryInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'joinForm' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'FormInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'documents' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'document' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamMembersInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamInfo' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'roles' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                { kind: 'Field', name: { kind: 'Name', value: 'required' } },
                { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
                { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                { kind: 'Field', name: { kind: 'Name', value: 'key' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'members' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'user' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'actor' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'actorImages' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'roles' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'required' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'key' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetTeamWithMembersQuery, GetTeamWithMembersQueryVariables>;
export const GetTeamWithMembersBySlugDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getTeamWithMembersBySlug' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'slug' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'teamBySlug' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'slug' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'slug' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamMembersInfo' } }],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ActorImageBareInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ActorImageModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamCategoryInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamCategoryModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'color' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'iconImage' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentUploadInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentUploadModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mime' } },
          { kind: 'Field', name: { kind: 'Name', value: 'size' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfPages' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfWords' } },
          { kind: 'Field', name: { kind: 'Name', value: 'documentType' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FormInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FormModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'schema' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isTemplate' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'current' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tagline' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currentFinance' } },
          { kind: 'Field', name: { kind: 'Name', value: 'directorsCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'managersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'membersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberCount' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'tags' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'categories' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamCategoryInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'joinForm' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'FormInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'documents' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'document' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamMembersInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamInfo' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'roles' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                { kind: 'Field', name: { kind: 'Name', value: 'required' } },
                { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
                { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                { kind: 'Field', name: { kind: 'Name', value: 'key' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'members' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'user' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'actor' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'actorImages' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'roles' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'required' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'key' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetTeamWithMembersBySlugQuery, GetTeamWithMembersBySlugQueryVariables>;
export const GetTeamsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getTeams' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'options' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'PaginationOptions' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'filter' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamFilterQuery' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'teams' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'options' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'options' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'filter' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'edges' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ActorImageBareInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ActorImageModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamCategoryInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamCategoryModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'color' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'iconImage' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentUploadInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentUploadModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mime' } },
          { kind: 'Field', name: { kind: 'Name', value: 'size' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfPages' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfWords' } },
          { kind: 'Field', name: { kind: 'Name', value: 'documentType' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FormInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FormModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'schema' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isTemplate' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'current' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tagline' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currentFinance' } },
          { kind: 'Field', name: { kind: 'Name', value: 'directorsCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'managersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'membersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberCount' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'tags' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'categories' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamCategoryInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'joinForm' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'FormInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'documents' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'document' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetTeamsQuery, GetTeamsQueryVariables>;
export const GetTeamsByCategoryDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getTeamsByCategory' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'categorySlug' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'teams' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'categories' },
                      value: {
                        kind: 'ListValue',
                        values: [{ kind: 'Variable', name: { kind: 'Name', value: 'categorySlug' } }],
                      },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'types' },
                      value: {
                        kind: 'ListValue',
                        values: [
                          { kind: 'EnumValue', value: 'Association' },
                          { kind: 'EnumValue', value: 'Club' },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'edges' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamMembersInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ActorImageBareInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ActorImageModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamCategoryInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamCategoryModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'color' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'iconImage' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentUploadInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentUploadModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mime' } },
          { kind: 'Field', name: { kind: 'Name', value: 'size' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfPages' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfWords' } },
          { kind: 'Field', name: { kind: 'Name', value: 'documentType' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FormInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FormModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'schema' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isTemplate' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'current' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tagline' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currentFinance' } },
          { kind: 'Field', name: { kind: 'Name', value: 'directorsCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'managersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'membersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberCount' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'tags' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'categories' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamCategoryInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'joinForm' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'FormInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'documents' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'document' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamMembersInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamInfo' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'roles' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                { kind: 'Field', name: { kind: 'Name', value: 'required' } },
                { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
                { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                { kind: 'Field', name: { kind: 'Name', value: 'key' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'members' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'user' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'actor' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'actorImages' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'roles' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'required' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'key' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetTeamsByCategoryQuery, GetTeamsByCategoryQueryVariables>;
export const GetTeamsWithMembersDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getTeamsWithMembers' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'teams' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'edges' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamMembersInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ActorImageBareInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ActorImageModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamCategoryInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamCategoryModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'color' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'iconImage' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentUploadInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentUploadModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mime' } },
          { kind: 'Field', name: { kind: 'Name', value: 'size' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfPages' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfWords' } },
          { kind: 'Field', name: { kind: 'Name', value: 'documentType' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FormInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FormModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'schema' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isTemplate' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'current' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tagline' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currentFinance' } },
          { kind: 'Field', name: { kind: 'Name', value: 'directorsCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'managersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'membersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberCount' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'tags' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'categories' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamCategoryInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'joinForm' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'FormInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'documents' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'document' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamMembersInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamInfo' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'roles' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                { kind: 'Field', name: { kind: 'Name', value: 'required' } },
                { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
                { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                { kind: 'Field', name: { kind: 'Name', value: 'key' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'members' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'user' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'actor' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'actorImages' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'roles' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'required' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'key' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetTeamsWithMembersQuery, GetTeamsWithMembersQueryVariables>;
export const GetTenantByIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getTenantById' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'tenantById' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TenantInfo' } }],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ActorImageBareInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ActorImageModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentUploadInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentUploadModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mime' } },
          { kind: 'Field', name: { kind: 'Name', value: 'size' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfPages' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfWords' } },
          { kind: 'Field', name: { kind: 'Name', value: 'documentType' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'current' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TenantInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TenantModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'eventValidationForm' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'schema' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'documents' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'document' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetTenantByIdQuery, GetTenantByIdQueryVariables>;
export const GetTenantDocumentsQueryDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getTenantDocumentsQuery' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'tenantById' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TenantInfo' } }],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ActorImageBareInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ActorImageModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentUploadInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentUploadModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mime' } },
          { kind: 'Field', name: { kind: 'Name', value: 'size' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfPages' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfWords' } },
          { kind: 'Field', name: { kind: 'Name', value: 'documentType' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'current' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TenantInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TenantModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'eventValidationForm' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'schema' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'documents' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'document' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetTenantDocumentsQueryQuery, GetTenantDocumentsQueryQueryVariables>;
export const GetUserByIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getUserById' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'userById' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'MyInfo' } }],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ActorImageBareInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ActorImageModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'UserInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'primaryEmail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ical' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roles' } },
          { kind: 'Field', name: { kind: 'Name', value: 'scopeRole' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamCategoryInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamCategoryModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'color' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'iconImage' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentUploadInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentUploadModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mime' } },
          { kind: 'Field', name: { kind: 'Name', value: 'size' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfPages' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfWords' } },
          { kind: 'Field', name: { kind: 'Name', value: 'documentType' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FormInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FormModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'schema' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isTemplate' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'current' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tagline' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currentFinance' } },
          { kind: 'Field', name: { kind: 'Name', value: 'directorsCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'managersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'membersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberCount' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'tags' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'categories' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamCategoryInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'joinForm' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'FormInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'documents' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'document' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FormSubmissionInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FormSubmissionModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'submission' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'linkedFormEdit' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'newVersion' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamJoinInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamJoinModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'team' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'askedRole' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
                { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                { kind: 'Field', name: { kind: 'Name', value: 'key' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'formSubmission' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'FormSubmissionInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'receivedRole' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
                { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                { kind: 'Field', name: { kind: 'Name', value: 'key' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'joiner' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createdBy' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'settledBy' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'settledAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'settledMessage' } },
          { kind: 'Field', name: { kind: 'Name', value: 'state' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'MyInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'primaryEmail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ical' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roles' } },
          { kind: 'Field', name: { kind: 'Name', value: 'scopeRole' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'shortcuts' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'targetActor' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'actorKind' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'actorImages' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'individual' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'InlineFragment',
                              typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserInfo' } }],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'org' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'InlineFragment',
                              typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamModel' } },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamInfo' } }],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'teamJoins' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamJoinInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'teamMemberships' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'roles' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'required' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'key' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'team' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetUserByIdQuery, GetUserByIdQueryVariables>;
export const GetUserBySlugDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getUserBySlug' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'slug' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'userBySlug' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'slug' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'slug' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserMembershipsInfo' } }],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ActorImageBareInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ActorImageModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamCategoryInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamCategoryModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'color' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'iconImage' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentUploadInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentUploadModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mime' } },
          { kind: 'Field', name: { kind: 'Name', value: 'size' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfPages' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfWords' } },
          { kind: 'Field', name: { kind: 'Name', value: 'documentType' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FormInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FormModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'schema' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isTemplate' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'current' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tagline' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currentFinance' } },
          { kind: 'Field', name: { kind: 'Name', value: 'directorsCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'managersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'membersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberCount' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'tags' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'categories' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamCategoryInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'joinForm' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'FormInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'documents' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'document' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'UserMembershipsInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'primaryEmail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ical' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roles' } },
          { kind: 'Field', name: { kind: 'Name', value: 'scopeRole' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'teamMemberships' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'team' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamInfo' } }],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'roles' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'key' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetUserBySlugQuery, GetUserBySlugQueryVariables>;
export const GetUserMembershipsByIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getUserMembershipsById' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'userById' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserMembershipsInfo' } }],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ActorImageBareInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ActorImageModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamCategoryInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamCategoryModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'color' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'iconImage' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentUploadInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentUploadModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mime' } },
          { kind: 'Field', name: { kind: 'Name', value: 'size' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfPages' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfWords' } },
          { kind: 'Field', name: { kind: 'Name', value: 'documentType' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FormInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FormModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'schema' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isTemplate' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'current' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tagline' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currentFinance' } },
          { kind: 'Field', name: { kind: 'Name', value: 'directorsCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'managersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'membersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberCount' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'tags' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'categories' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamCategoryInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'joinForm' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'FormInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'documents' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'document' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'UserMembershipsInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'primaryEmail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ical' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roles' } },
          { kind: 'Field', name: { kind: 'Name', value: 'scopeRole' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'teamMemberships' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'team' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamInfo' } }],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'roles' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'key' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetUserMembershipsByIdQuery, GetUserMembershipsByIdQueryVariables>;
export const GetUsersDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getUsers' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'options' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'PaginationOptions' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'filter' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'UserFilterQuery' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'users' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'options' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'options' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'filter' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'edges' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'UserMembershipsInfo' } },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ActorImageBareInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ActorImageModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamCategoryInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamCategoryModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'color' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'iconImage' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentUploadInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentUploadModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mime' } },
          { kind: 'Field', name: { kind: 'Name', value: 'size' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfPages' } },
          { kind: 'Field', name: { kind: 'Name', value: 'numberOfWords' } },
          { kind: 'Field', name: { kind: 'Name', value: 'documentType' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'FormInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FormModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'schema' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isTemplate' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'DocumentInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'current' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'edits' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentEditModel' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'yearVersion' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'newVersion' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentUploadInfo' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TeamInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'TeamModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'tagline' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currentFinance' } },
          { kind: 'Field', name: { kind: 'Name', value: 'directorsCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'managersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'membersCategoryName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberCount' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'tags' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'categories' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamCategoryInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'joinForm' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'FormInfo' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'documents' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'document' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'DocumentInfo' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'UserMembershipsInfo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserModel' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'actor' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bio' } },
                { kind: 'Field', name: { kind: 'Name', value: 'primaryEmail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ical' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actorImages' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'ActorImageBareInfo' } }],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roles' } },
          { kind: 'Field', name: { kind: 'Name', value: 'scopeRole' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'teamMemberships' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'team' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'TeamInfo' } }],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'roles' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'permissions' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'key' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetUsersQuery, GetUsersQueryVariables>;
