/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel-plugin for production.
 */
const documents = {
  '\n  fragment ActorImageBareInfo on ActorImageModel {\n    __typename\n    id\n    type\n    image {\n      __typename\n      id\n      url\n    }\n  }\n':
    types.ActorImageBareInfoFragmentDoc,
  '\n  fragment DocumentInfo on DocumentModel {\n    __typename\n    id\n    createdAt\n    updatedAt\n    text\n    name\n    yearVersion\n    documentUpload {\n      ...DocumentUploadInfo\n    }\n    edits {\n      __typename\n      id\n      createdAt\n      yearVersion\n      documentUpload {\n        ...DocumentUploadInfo\n      }\n    }\n  }\n':
    types.DocumentInfoFragmentDoc,
  '\n  fragment DocumentUploadInfo on DocumentUploadModel {\n    __typename\n    id\n    createdAt\n    url\n    name\n    mime\n    size\n    numberOfPages\n    numberOfWords\n    documentType\n  }\n':
    types.DocumentUploadInfoFragmentDoc,
  '\n  fragment EventInfo on TenantEventModel {\n    __typename\n    id\n    createdAt\n    updatedAt\n    slug\n    title\n    start\n    end\n    state\n    supervisor {\n      __typename\n      id\n    }\n    location {\n      __typename\n      name\n      street\n      city\n      state\n      zip\n    }\n    lastEventApprovalStep {\n      __typename\n      id\n      name\n      order\n    }\n    rootContent {\n      __typename\n      ugcKind\n      isAnonymous\n      representingOrg {\n        id\n        createdAt\n        updatedAt\n        orgKind\n        actor {\n          id\n          name\n          slug\n          actorImages {\n            ...ActorImageBareInfo\n          }\n        }\n      }\n      author {\n        ...UserInfo\n      }\n      ... on ContentModel {\n        text\n      }\n    }\n  }\n':
    types.EventInfoFragmentDoc,
  '\n  fragment FileInfo on FileUploadModel {\n    __typename\n    id\n    createdAt\n    url\n    name\n    mime\n    size\n  }\n':
    types.FileInfoFragmentDoc,
  '\n  fragment FinanceInfo on FinanceModel {\n    __typename\n    id\n    createdAt\n    updatedAt\n    # description\n    # address {\n    #   name\n    #   street\n    #   city\n    #   state\n    #   zip\n    # }\n    transaction\n    paymentDate\n    paymentMethod\n    amountDue\n    amountPayed\n    state\n    category\n    createdBy {\n      ...on UserModel {\n        ...UserInfo\n      }\n    }\n    receipts {\n      ...DocumentUploadInfo\n    }\n    linkedEvent {\n      ...EventInfo\n    }\n    linkedProject {\n      ...ProjectInfo\n    }\n  }\n':
    types.FinanceInfoFragmentDoc,
  '\n  fragment FormInfo on FormModel {\n    __typename\n    id\n    createdAt\n    updatedAt\n    name\n    description\n    schema\n    type\n    isTemplate\n  }\n':
    types.FormInfoFragmentDoc,
  '\n  fragment MyInfo on UserModel {\n    __typename\n    id\n    createdAt\n    updatedAt\n    actor {\n      id\n      slug\n      name\n      bio\n      primaryEmail\n      ical\n      actorImages {\n        ...ActorImageBareInfo\n      }\n    }\n    firstName\n    lastName\n    roles\n    scopeRole\n    shortcuts {\n      __typename\n      id\n      type\n      targetActor {\n        __typename\n        id\n        actorKind\n        name\n        slug\n        actorImages {\n          ...ActorImageBareInfo\n        }\n        individual {\n          ... on UserModel {\n            ...UserInfo\n          }\n        }\n        org {\n          ... on TeamModel {\n            ...TeamInfo\n          }\n        }\n      }\n    }\n    teamMemberships {\n      __typename\n      id\n      roles {\n        __typename\n        id\n        name\n        color\n        required\n        permissions\n        category\n        key\n      }\n      team {\n        __typename\n        id\n      }\n    }\n  }\n':
    types.MyInfoFragmentDoc,
  '\n  fragment OrgInfo on OrgModel {\n    __typename\n    id\n    createdAt\n    updatedAt\n    orgKind\n    actor {\n      __typename\n      id\n      name\n      slug\n      actorImages {\n        ...ActorImageBareInfo\n      }\n    }\n  }\n':
    types.OrgInfoFragmentDoc,
  '\n  fragment ProjectInfo on ProjectModel {\n    __typename\n    id\n    createdAt\n    updatedAt\n    name\n    expectedBudget\n    actualBudget\n    team {\n      ...TeamInfo\n    }\n    createdBy {\n      ...on UserModel {\n        ...UserInfo\n      }\n    }\n    supervisor {\n      ...UserInfo\n    }\n    participants {\n      ...UserInfo\n    }\n  }\n':
    types.ProjectInfoFragmentDoc,
  '\n  fragment TeamCategoryInfo on TeamCategoryModel {\n    __typename\n    id\n    createdAt\n    updatedAt\n    name\n    description\n    color\n    slug\n    iconImage {\n      __typename\n      id\n      createdAt\n      updatedAt\n      url\n    }\n  }\n':
    types.TeamCategoryInfoFragmentDoc,
  '\n  fragment TeamInfo on TeamModel {\n    __typename\n    id\n    createdAt\n    updatedAt\n    tagline\n    type\n    currentFinance\n    actor {\n      __typename\n      id\n      name\n      slug\n      actorImages {\n        ...ActorImageBareInfo\n      }\n    }\n    categories {\n      ...TeamCategoryInfo\n    }\n    joinForm {\n      ...FormInfo\n    }\n    documents {\n      __typename\n      id\n      type\n      document {\n        ...DocumentInfo\n      }\n    }\n  }\n':
    types.TeamInfoFragmentDoc,
  '\n  fragment TeamManageInfo on TeamModel {\n    __typename\n    id\n    createdAt\n    updatedAt\n    tagline\n    type\n    currentFinance\n    actor {\n      __typename\n      id\n      bio\n      name\n      slug\n      actorImages {\n        ...ActorImageBareInfo\n      }\n      tags {\n        __typename\n        id\n        name\n        slug\n        color\n      }\n    }\n    categories {\n      ...TeamCategoryInfo\n    }\n    joinForm {\n      ...FormInfo\n    }\n    documents {\n      __typename\n      id\n      type\n      document {\n        ...DocumentInfo\n      }\n    }\n    members {\n      __typename\n      id\n      user {\n        __typename\n        id\n        actor {\n          __typename\n          id\n          name\n          actorImages {\n            ...ActorImageBareInfo\n          }\n        }\n        firstName\n      }\n      roles {\n        __typename\n        id\n        name\n        color\n        required\n        permissions\n        category\n        key\n      }\n    }\n    finances {\n      ...FinanceInfo\n    }\n  }\n':
    types.TeamManageInfoFragmentDoc,
  '\n  fragment TeamMembersInfo on TeamModel {\n    __typename\n    id\n    createdAt\n    updatedAt\n    tagline\n    type\n    currentFinance\n    actor {\n      __typename\n      id\n      bio\n      name\n      slug\n      actorImages {\n        ...ActorImageBareInfo\n      }\n      tags {\n        __typename\n        id\n        name\n        slug\n        color\n      }\n    }\n    documents {\n      __typename\n      id\n      type\n      document {\n        ...DocumentInfo\n      }\n    }\n    members {\n      __typename\n      id\n      user {\n        __typename\n        id\n        actor {\n          __typename\n          id\n          name\n          actorImages {\n            ...ActorImageBareInfo\n          }\n        }\n        firstName\n      }\n      roles {\n        __typename\n        id\n        name\n        color\n        required\n        permissions\n        category\n        key\n      }\n    }\n  }\n':
    types.TeamMembersInfoFragmentDoc,
  '\n  fragment TenantInfo on TenantModel {\n    __typename\n    id\n    createdAt\n    updatedAt\n    actor {\n      __typename\n      id\n      name\n      slug\n      actorImages {\n        ...ActorImageBareInfo\n      }\n    }\n    eventValidationForm {\n      __typename\n      id\n      schema\n    }\n    documents {\n      __typename\n      id\n      type\n      document {\n        ...DocumentInfo\n      }\n    }\n  }\n':
    types.TenantInfoFragmentDoc,
  '\n  fragment UserInfo on UserModel {\n    __typename\n    id\n    createdAt\n    updatedAt\n    actor {\n      __typename\n      id\n      slug\n      name\n      bio\n      primaryEmail\n      ical\n      actorImages {\n        ...ActorImageBareInfo\n      }\n    }\n    firstName\n    lastName\n    roles\n    scopeRole\n  }\n':
    types.UserInfoFragmentDoc,
  '\n  fragment UserMembershipsInfo on UserModel {\n    __typename\n    id\n    createdAt\n    updatedAt\n    actor {\n      __typename\n      id\n      slug\n      name\n      bio\n      primaryEmail\n      ical\n      actorImages {\n        ...ActorImageBareInfo\n      }\n    }\n    firstName\n    lastName\n    roles\n    scopeRole\n    teamMemberships {\n      __typename\n      id\n      createdAt\n      updatedAt\n      team {\n        ...TeamInfo\n      }\n      roles {\n        __typename\n        id\n        createdAt\n        updatedAt\n        name\n        permissions\n        category\n        key\n      }\n    }\n  }\n':
    types.UserMembershipsInfoFragmentDoc,
  '\n  mutation login($username: String!, $password: String!) {\n    login(username: $username, password: $password) {\n      __typename\n      user {\n        ...MyInfo\n      }\n      tenant {\n        ...TenantInfo\n      }\n    }\n  }\n':
    types.LoginDocument,
  '\n  mutation logout {\n    logout\n  }\n': types.LogoutDocument,
  '\n  mutation createEventApproval($eventApproval: CreateEventApprovalDto!) {\n    createEventApproval(eventApproval: $eventApproval) {\n      __typename\n      id\n      createdAt\n      updatedAt\n      deletedAt\n      message\n      approved\n      step {\n        __typename\n        id\n        name\n      }\n      createdBy {\n        ...UserInfo\n      }\n      event {\n        ...EventInfo\n      }\n    }\n  }\n':
    types.CreateEventApprovalDocument,
  '\n  mutation createEvent($event: CreateEventDto!) {\n    createEvent(event: $event) {\n      ...EventInfo\n    }\n  }\n':
    types.CreateEventDocument,
  '\n  mutation updateEvent($updateEvent: UpdateEventDto!) {\n    updateEvent(updateEvent: $updateEvent) {\n      ...EventInfo\n    }\n  }\n':
    types.UpdateEventDocument,
  '\n  mutation createFinance($finance: CreateFinanceDto!) {\n    createFinance(finance: $finance) {\n      team {\n        __typename\n        id\n        currentFinance\n        finances {\n          ...FinanceInfo\n        }\n      }\n    }\n  }\n':
    types.CreateFinanceDocument,
  '\n  mutation updateFinance($updateFinance: UpdateFinanceDto!) {\n    updateFinance(updateFinance: $updateFinance) {\n      ...FinanceInfo\n    }\n  }\n':
    types.UpdateFinanceDocument,
  '\n  mutation createProject($project: CreateProjectDto!) {\n    createProject(project: $project) {\n      ...ProjectInfo\n    }\n  }\n':
    types.CreateProjectDocument,
  '\n  mutation updateProject($updateProject: UpdateProjectDto!) {\n    updateProject(updateProject: $updateProject) {\n      ...ProjectInfo\n    }\n  }\n':
    types.UpdateProjectDocument,
  '\n  mutation deactivateTeamImage($id: String!, $actorImageType: ActorImageType!) {\n    deactivateTeamImage(id: $id, actorImageType: $actorImageType) {\n      __typename\n      actor {\n        __typename\n        id\n        name\n        slug\n        actorImages {\n          ...ActorImageBareInfo\n        }\n      }\n    }\n  }\n':
    types.DeactivateTeamImageDocument,
  '\n  mutation teamAddDocument($teamId: String!, $createOrgDocument: CreateOrgDocumentDto!, $documentFile: Upload!) {\n    teamAddDocument(teamId: $teamId, createOrgDocument: $createOrgDocument, documentFile: $documentFile) {\n      __typename\n      id\n      org {\n        __typename\n        id\n        documents {\n          __typename\n          id\n          createdAt\n          type\n          document {\n            ...DocumentInfo\n          }\n        }\n      }\n    }\n  }\n':
    types.TeamAddDocumentDocument,
  '\n  mutation updateTeam($updateTeam: UpdateTeamDto!, $avatar: Upload) {\n    updateTeam(updateTeam: $updateTeam, avatar: $avatar) {\n      ...TeamManageInfo\n    }\n  }\n':
    types.UpdateTeamDocument,
  '\n  mutation tenantAddDocument($tenantId: String!, $createDocument: CreateDocumentDto!, $documentFile: Upload!) {\n    tenantAddDocument(tenantId: $tenantId, createDocument: $createDocument, documentFile: $documentFile) {\n      __typename\n      id\n      org {\n        id\n        documents {\n          id\n          type\n          document {\n            ...DocumentInfo\n          }\n        }\n      }\n    }\n  }\n':
    types.TenantAddDocumentDocument,
  '\n  query getEvents {\n    events {\n      edges {\n        node {\n          ...EventInfo\n        }\n      }\n    }\n  }\n':
    types.GetEventsDocument,
  '\n  query getFinances($teamId: String!) {\n    financesByTeam(teamId: $teamId, options: {}) {\n      edges {\n        node {\n          ...FinanceInfo\n        }\n      }\n    }\n  }\n':
    types.GetFinancesDocument,
  '\n  query me {\n    me {\n      user {\n        ...MyInfo\n      }\n      tenant {\n        ...TenantInfo\n      }\n    }\n  }\n':
    types.MeDocument,
  '\n  query getTeamById($id: String!) {\n    teamById(id: $id) {\n      ...TeamInfo\n    }\n  }\n':
    types.GetTeamByIdDocument,
  '\n  query getTeamCategories {\n    teamCategories {\n      edges {\n        node {\n          ...TeamCategoryInfo\n        }\n      }\n    }\n  }\n':
    types.GetTeamCategoriesDocument,
  '\n  query getTeamCategoryBySlug($slug: String!) {\n    teamCategoryBySlug(slug: $slug) {\n      ...TeamCategoryInfo\n    }\n  }\n':
    types.GetTeamCategoryBySlugDocument,
  '\n  query getTeamDetails($slug: String!) {\n    teamBySlug(slug: $slug) {\n      ...TeamMembersInfo\n    }\n  }\n':
    types.GetTeamDetailsDocument,
  '\n  query getTeamManage($id: String!) {\n    teamById(id: $id) {\n      ...TeamMembersInfo\n      finances {\n        ...FinanceInfo\n      }\n    }\n  }\n':
    types.GetTeamManageDocument,
  '\n  query getTeamManageBySlug($slug: String!) {\n    teamBySlug(slug: $slug) {\n      ...TeamManageInfo\n    }\n  }\n':
    types.GetTeamManageBySlugDocument,
  '\n  query getTeamWithMembers($id: String!) {\n    teamById(id: $id) {\n      ...TeamMembersInfo\n    }\n  }\n':
    types.GetTeamWithMembersDocument,
  '\n  query getTeamWithMembersBySlug($slug: String!) {\n    teamBySlug(slug: $slug) {\n      ...TeamMembersInfo\n    }\n  }\n':
    types.GetTeamWithMembersBySlugDocument,
  '\n  query getTeams {\n    teams(filter: { types: [Association, Club] }) {\n      edges {\n        node {\n          ...TeamInfo\n        }\n      }\n    }\n  }\n':
    types.GetTeamsDocument,
  '\n  query getTeamsByCategory($categorySlug: String!) {\n    teams(filter: { categories: [$categorySlug], types: [Association, Club] }) {\n      edges {\n        node {\n          ...TeamMembersInfo\n        }\n      }\n    }\n  }\n':
    types.GetTeamsByCategoryDocument,
  '\n  query getTeamsWithMembers {\n    teams {\n      edges {\n        node {\n          ...TeamMembersInfo\n        }\n      }\n    }\n  }\n':
    types.GetTeamsWithMembersDocument,
  '\n  query getTenantById($id: String!) {\n    tenantById(id: $id) {\n      ...TenantInfo\n    }\n  }\n':
    types.GetTenantByIdDocument,
  '\n  query getTenantDocumentsQuery($id: String!) {\n    tenantById(id: $id) {\n      ...TenantInfo\n    }\n  }\n':
    types.GetTenantDocumentsQueryDocument,
  '\n  query getUserById($id: String!) {\n    userById(id: $id) {\n      ...MyInfo\n    }\n  }\n':
    types.GetUserByIdDocument,
  '\n  query getUserBySlug($slug: String!) {\n    userBySlug(slug: $slug) {\n      ...UserMembershipsInfo\n    }\n  }\n':
    types.GetUserBySlugDocument,
  '\n  query getUserMembershipsById($id: String!) {\n    userById(id: $id) {\n      ...UserMembershipsInfo\n    }\n  }\n':
    types.GetUserMembershipsByIdDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  fragment ActorImageBareInfo on ActorImageModel {\n    __typename\n    id\n    type\n    image {\n      __typename\n      id\n      url\n    }\n  }\n'
): (typeof documents)['\n  fragment ActorImageBareInfo on ActorImageModel {\n    __typename\n    id\n    type\n    image {\n      __typename\n      id\n      url\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  fragment DocumentInfo on DocumentModel {\n    __typename\n    id\n    createdAt\n    updatedAt\n    text\n    name\n    yearVersion\n    documentUpload {\n      ...DocumentUploadInfo\n    }\n    edits {\n      __typename\n      id\n      createdAt\n      yearVersion\n      documentUpload {\n        ...DocumentUploadInfo\n      }\n    }\n  }\n'
): (typeof documents)['\n  fragment DocumentInfo on DocumentModel {\n    __typename\n    id\n    createdAt\n    updatedAt\n    text\n    name\n    yearVersion\n    documentUpload {\n      ...DocumentUploadInfo\n    }\n    edits {\n      __typename\n      id\n      createdAt\n      yearVersion\n      documentUpload {\n        ...DocumentUploadInfo\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  fragment DocumentUploadInfo on DocumentUploadModel {\n    __typename\n    id\n    createdAt\n    url\n    name\n    mime\n    size\n    numberOfPages\n    numberOfWords\n    documentType\n  }\n'
): (typeof documents)['\n  fragment DocumentUploadInfo on DocumentUploadModel {\n    __typename\n    id\n    createdAt\n    url\n    name\n    mime\n    size\n    numberOfPages\n    numberOfWords\n    documentType\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  fragment EventInfo on TenantEventModel {\n    __typename\n    id\n    createdAt\n    updatedAt\n    slug\n    title\n    start\n    end\n    state\n    supervisor {\n      __typename\n      id\n    }\n    location {\n      __typename\n      name\n      street\n      city\n      state\n      zip\n    }\n    lastEventApprovalStep {\n      __typename\n      id\n      name\n      order\n    }\n    rootContent {\n      __typename\n      ugcKind\n      isAnonymous\n      representingOrg {\n        id\n        createdAt\n        updatedAt\n        orgKind\n        actor {\n          id\n          name\n          slug\n          actorImages {\n            ...ActorImageBareInfo\n          }\n        }\n      }\n      author {\n        ...UserInfo\n      }\n      ... on ContentModel {\n        text\n      }\n    }\n  }\n'
): (typeof documents)['\n  fragment EventInfo on TenantEventModel {\n    __typename\n    id\n    createdAt\n    updatedAt\n    slug\n    title\n    start\n    end\n    state\n    supervisor {\n      __typename\n      id\n    }\n    location {\n      __typename\n      name\n      street\n      city\n      state\n      zip\n    }\n    lastEventApprovalStep {\n      __typename\n      id\n      name\n      order\n    }\n    rootContent {\n      __typename\n      ugcKind\n      isAnonymous\n      representingOrg {\n        id\n        createdAt\n        updatedAt\n        orgKind\n        actor {\n          id\n          name\n          slug\n          actorImages {\n            ...ActorImageBareInfo\n          }\n        }\n      }\n      author {\n        ...UserInfo\n      }\n      ... on ContentModel {\n        text\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  fragment FileInfo on FileUploadModel {\n    __typename\n    id\n    createdAt\n    url\n    name\n    mime\n    size\n  }\n'
): (typeof documents)['\n  fragment FileInfo on FileUploadModel {\n    __typename\n    id\n    createdAt\n    url\n    name\n    mime\n    size\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  fragment FinanceInfo on FinanceModel {\n    __typename\n    id\n    createdAt\n    updatedAt\n    # description\n    # address {\n    #   name\n    #   street\n    #   city\n    #   state\n    #   zip\n    # }\n    transaction\n    paymentDate\n    paymentMethod\n    amountDue\n    amountPayed\n    state\n    category\n    createdBy {\n      ...on UserModel {\n        ...UserInfo\n      }\n    }\n    receipts {\n      ...DocumentUploadInfo\n    }\n    linkedEvent {\n      ...EventInfo\n    }\n    linkedProject {\n      ...ProjectInfo\n    }\n  }\n'
): (typeof documents)['\n  fragment FinanceInfo on FinanceModel {\n    __typename\n    id\n    createdAt\n    updatedAt\n    # description\n    # address {\n    #   name\n    #   street\n    #   city\n    #   state\n    #   zip\n    # }\n    transaction\n    paymentDate\n    paymentMethod\n    amountDue\n    amountPayed\n    state\n    category\n    createdBy {\n      ...on UserModel {\n        ...UserInfo\n      }\n    }\n    receipts {\n      ...DocumentUploadInfo\n    }\n    linkedEvent {\n      ...EventInfo\n    }\n    linkedProject {\n      ...ProjectInfo\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  fragment FormInfo on FormModel {\n    __typename\n    id\n    createdAt\n    updatedAt\n    name\n    description\n    schema\n    type\n    isTemplate\n  }\n'
): (typeof documents)['\n  fragment FormInfo on FormModel {\n    __typename\n    id\n    createdAt\n    updatedAt\n    name\n    description\n    schema\n    type\n    isTemplate\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  fragment MyInfo on UserModel {\n    __typename\n    id\n    createdAt\n    updatedAt\n    actor {\n      id\n      slug\n      name\n      bio\n      primaryEmail\n      ical\n      actorImages {\n        ...ActorImageBareInfo\n      }\n    }\n    firstName\n    lastName\n    roles\n    scopeRole\n    shortcuts {\n      __typename\n      id\n      type\n      targetActor {\n        __typename\n        id\n        actorKind\n        name\n        slug\n        actorImages {\n          ...ActorImageBareInfo\n        }\n        individual {\n          ... on UserModel {\n            ...UserInfo\n          }\n        }\n        org {\n          ... on TeamModel {\n            ...TeamInfo\n          }\n        }\n      }\n    }\n    teamMemberships {\n      __typename\n      id\n      roles {\n        __typename\n        id\n        name\n        color\n        required\n        permissions\n        category\n        key\n      }\n      team {\n        __typename\n        id\n      }\n    }\n  }\n'
): (typeof documents)['\n  fragment MyInfo on UserModel {\n    __typename\n    id\n    createdAt\n    updatedAt\n    actor {\n      id\n      slug\n      name\n      bio\n      primaryEmail\n      ical\n      actorImages {\n        ...ActorImageBareInfo\n      }\n    }\n    firstName\n    lastName\n    roles\n    scopeRole\n    shortcuts {\n      __typename\n      id\n      type\n      targetActor {\n        __typename\n        id\n        actorKind\n        name\n        slug\n        actorImages {\n          ...ActorImageBareInfo\n        }\n        individual {\n          ... on UserModel {\n            ...UserInfo\n          }\n        }\n        org {\n          ... on TeamModel {\n            ...TeamInfo\n          }\n        }\n      }\n    }\n    teamMemberships {\n      __typename\n      id\n      roles {\n        __typename\n        id\n        name\n        color\n        required\n        permissions\n        category\n        key\n      }\n      team {\n        __typename\n        id\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  fragment OrgInfo on OrgModel {\n    __typename\n    id\n    createdAt\n    updatedAt\n    orgKind\n    actor {\n      __typename\n      id\n      name\n      slug\n      actorImages {\n        ...ActorImageBareInfo\n      }\n    }\n  }\n'
): (typeof documents)['\n  fragment OrgInfo on OrgModel {\n    __typename\n    id\n    createdAt\n    updatedAt\n    orgKind\n    actor {\n      __typename\n      id\n      name\n      slug\n      actorImages {\n        ...ActorImageBareInfo\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  fragment ProjectInfo on ProjectModel {\n    __typename\n    id\n    createdAt\n    updatedAt\n    name\n    expectedBudget\n    actualBudget\n    team {\n      ...TeamInfo\n    }\n    createdBy {\n      ...on UserModel {\n        ...UserInfo\n      }\n    }\n    supervisor {\n      ...UserInfo\n    }\n    participants {\n      ...UserInfo\n    }\n  }\n'
): (typeof documents)['\n  fragment ProjectInfo on ProjectModel {\n    __typename\n    id\n    createdAt\n    updatedAt\n    name\n    expectedBudget\n    actualBudget\n    team {\n      ...TeamInfo\n    }\n    createdBy {\n      ...on UserModel {\n        ...UserInfo\n      }\n    }\n    supervisor {\n      ...UserInfo\n    }\n    participants {\n      ...UserInfo\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  fragment TeamCategoryInfo on TeamCategoryModel {\n    __typename\n    id\n    createdAt\n    updatedAt\n    name\n    description\n    color\n    slug\n    iconImage {\n      __typename\n      id\n      createdAt\n      updatedAt\n      url\n    }\n  }\n'
): (typeof documents)['\n  fragment TeamCategoryInfo on TeamCategoryModel {\n    __typename\n    id\n    createdAt\n    updatedAt\n    name\n    description\n    color\n    slug\n    iconImage {\n      __typename\n      id\n      createdAt\n      updatedAt\n      url\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  fragment TeamInfo on TeamModel {\n    __typename\n    id\n    createdAt\n    updatedAt\n    tagline\n    type\n    currentFinance\n    actor {\n      __typename\n      id\n      name\n      slug\n      actorImages {\n        ...ActorImageBareInfo\n      }\n    }\n    categories {\n      ...TeamCategoryInfo\n    }\n    joinForm {\n      ...FormInfo\n    }\n    documents {\n      __typename\n      id\n      type\n      document {\n        ...DocumentInfo\n      }\n    }\n  }\n'
): (typeof documents)['\n  fragment TeamInfo on TeamModel {\n    __typename\n    id\n    createdAt\n    updatedAt\n    tagline\n    type\n    currentFinance\n    actor {\n      __typename\n      id\n      name\n      slug\n      actorImages {\n        ...ActorImageBareInfo\n      }\n    }\n    categories {\n      ...TeamCategoryInfo\n    }\n    joinForm {\n      ...FormInfo\n    }\n    documents {\n      __typename\n      id\n      type\n      document {\n        ...DocumentInfo\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  fragment TeamManageInfo on TeamModel {\n    __typename\n    id\n    createdAt\n    updatedAt\n    tagline\n    type\n    currentFinance\n    actor {\n      __typename\n      id\n      bio\n      name\n      slug\n      actorImages {\n        ...ActorImageBareInfo\n      }\n      tags {\n        __typename\n        id\n        name\n        slug\n        color\n      }\n    }\n    categories {\n      ...TeamCategoryInfo\n    }\n    joinForm {\n      ...FormInfo\n    }\n    documents {\n      __typename\n      id\n      type\n      document {\n        ...DocumentInfo\n      }\n    }\n    members {\n      __typename\n      id\n      user {\n        __typename\n        id\n        actor {\n          __typename\n          id\n          name\n          actorImages {\n            ...ActorImageBareInfo\n          }\n        }\n        firstName\n      }\n      roles {\n        __typename\n        id\n        name\n        color\n        required\n        permissions\n        category\n        key\n      }\n    }\n    finances {\n      ...FinanceInfo\n    }\n  }\n'
): (typeof documents)['\n  fragment TeamManageInfo on TeamModel {\n    __typename\n    id\n    createdAt\n    updatedAt\n    tagline\n    type\n    currentFinance\n    actor {\n      __typename\n      id\n      bio\n      name\n      slug\n      actorImages {\n        ...ActorImageBareInfo\n      }\n      tags {\n        __typename\n        id\n        name\n        slug\n        color\n      }\n    }\n    categories {\n      ...TeamCategoryInfo\n    }\n    joinForm {\n      ...FormInfo\n    }\n    documents {\n      __typename\n      id\n      type\n      document {\n        ...DocumentInfo\n      }\n    }\n    members {\n      __typename\n      id\n      user {\n        __typename\n        id\n        actor {\n          __typename\n          id\n          name\n          actorImages {\n            ...ActorImageBareInfo\n          }\n        }\n        firstName\n      }\n      roles {\n        __typename\n        id\n        name\n        color\n        required\n        permissions\n        category\n        key\n      }\n    }\n    finances {\n      ...FinanceInfo\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  fragment TeamMembersInfo on TeamModel {\n    __typename\n    id\n    createdAt\n    updatedAt\n    tagline\n    type\n    currentFinance\n    actor {\n      __typename\n      id\n      bio\n      name\n      slug\n      actorImages {\n        ...ActorImageBareInfo\n      }\n      tags {\n        __typename\n        id\n        name\n        slug\n        color\n      }\n    }\n    documents {\n      __typename\n      id\n      type\n      document {\n        ...DocumentInfo\n      }\n    }\n    members {\n      __typename\n      id\n      user {\n        __typename\n        id\n        actor {\n          __typename\n          id\n          name\n          actorImages {\n            ...ActorImageBareInfo\n          }\n        }\n        firstName\n      }\n      roles {\n        __typename\n        id\n        name\n        color\n        required\n        permissions\n        category\n        key\n      }\n    }\n  }\n'
): (typeof documents)['\n  fragment TeamMembersInfo on TeamModel {\n    __typename\n    id\n    createdAt\n    updatedAt\n    tagline\n    type\n    currentFinance\n    actor {\n      __typename\n      id\n      bio\n      name\n      slug\n      actorImages {\n        ...ActorImageBareInfo\n      }\n      tags {\n        __typename\n        id\n        name\n        slug\n        color\n      }\n    }\n    documents {\n      __typename\n      id\n      type\n      document {\n        ...DocumentInfo\n      }\n    }\n    members {\n      __typename\n      id\n      user {\n        __typename\n        id\n        actor {\n          __typename\n          id\n          name\n          actorImages {\n            ...ActorImageBareInfo\n          }\n        }\n        firstName\n      }\n      roles {\n        __typename\n        id\n        name\n        color\n        required\n        permissions\n        category\n        key\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  fragment TenantInfo on TenantModel {\n    __typename\n    id\n    createdAt\n    updatedAt\n    actor {\n      __typename\n      id\n      name\n      slug\n      actorImages {\n        ...ActorImageBareInfo\n      }\n    }\n    eventValidationForm {\n      __typename\n      id\n      schema\n    }\n    documents {\n      __typename\n      id\n      type\n      document {\n        ...DocumentInfo\n      }\n    }\n  }\n'
): (typeof documents)['\n  fragment TenantInfo on TenantModel {\n    __typename\n    id\n    createdAt\n    updatedAt\n    actor {\n      __typename\n      id\n      name\n      slug\n      actorImages {\n        ...ActorImageBareInfo\n      }\n    }\n    eventValidationForm {\n      __typename\n      id\n      schema\n    }\n    documents {\n      __typename\n      id\n      type\n      document {\n        ...DocumentInfo\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  fragment UserInfo on UserModel {\n    __typename\n    id\n    createdAt\n    updatedAt\n    actor {\n      __typename\n      id\n      slug\n      name\n      bio\n      primaryEmail\n      ical\n      actorImages {\n        ...ActorImageBareInfo\n      }\n    }\n    firstName\n    lastName\n    roles\n    scopeRole\n  }\n'
): (typeof documents)['\n  fragment UserInfo on UserModel {\n    __typename\n    id\n    createdAt\n    updatedAt\n    actor {\n      __typename\n      id\n      slug\n      name\n      bio\n      primaryEmail\n      ical\n      actorImages {\n        ...ActorImageBareInfo\n      }\n    }\n    firstName\n    lastName\n    roles\n    scopeRole\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  fragment UserMembershipsInfo on UserModel {\n    __typename\n    id\n    createdAt\n    updatedAt\n    actor {\n      __typename\n      id\n      slug\n      name\n      bio\n      primaryEmail\n      ical\n      actorImages {\n        ...ActorImageBareInfo\n      }\n    }\n    firstName\n    lastName\n    roles\n    scopeRole\n    teamMemberships {\n      __typename\n      id\n      createdAt\n      updatedAt\n      team {\n        ...TeamInfo\n      }\n      roles {\n        __typename\n        id\n        createdAt\n        updatedAt\n        name\n        permissions\n        category\n        key\n      }\n    }\n  }\n'
): (typeof documents)['\n  fragment UserMembershipsInfo on UserModel {\n    __typename\n    id\n    createdAt\n    updatedAt\n    actor {\n      __typename\n      id\n      slug\n      name\n      bio\n      primaryEmail\n      ical\n      actorImages {\n        ...ActorImageBareInfo\n      }\n    }\n    firstName\n    lastName\n    roles\n    scopeRole\n    teamMemberships {\n      __typename\n      id\n      createdAt\n      updatedAt\n      team {\n        ...TeamInfo\n      }\n      roles {\n        __typename\n        id\n        createdAt\n        updatedAt\n        name\n        permissions\n        category\n        key\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation login($username: String!, $password: String!) {\n    login(username: $username, password: $password) {\n      __typename\n      user {\n        ...MyInfo\n      }\n      tenant {\n        ...TenantInfo\n      }\n    }\n  }\n'
): (typeof documents)['\n  mutation login($username: String!, $password: String!) {\n    login(username: $username, password: $password) {\n      __typename\n      user {\n        ...MyInfo\n      }\n      tenant {\n        ...TenantInfo\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation logout {\n    logout\n  }\n'
): (typeof documents)['\n  mutation logout {\n    logout\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation createEventApproval($eventApproval: CreateEventApprovalDto!) {\n    createEventApproval(eventApproval: $eventApproval) {\n      __typename\n      id\n      createdAt\n      updatedAt\n      deletedAt\n      message\n      approved\n      step {\n        __typename\n        id\n        name\n      }\n      createdBy {\n        ...UserInfo\n      }\n      event {\n        ...EventInfo\n      }\n    }\n  }\n'
): (typeof documents)['\n  mutation createEventApproval($eventApproval: CreateEventApprovalDto!) {\n    createEventApproval(eventApproval: $eventApproval) {\n      __typename\n      id\n      createdAt\n      updatedAt\n      deletedAt\n      message\n      approved\n      step {\n        __typename\n        id\n        name\n      }\n      createdBy {\n        ...UserInfo\n      }\n      event {\n        ...EventInfo\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation createEvent($event: CreateEventDto!) {\n    createEvent(event: $event) {\n      ...EventInfo\n    }\n  }\n'
): (typeof documents)['\n  mutation createEvent($event: CreateEventDto!) {\n    createEvent(event: $event) {\n      ...EventInfo\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation updateEvent($updateEvent: UpdateEventDto!) {\n    updateEvent(updateEvent: $updateEvent) {\n      ...EventInfo\n    }\n  }\n'
): (typeof documents)['\n  mutation updateEvent($updateEvent: UpdateEventDto!) {\n    updateEvent(updateEvent: $updateEvent) {\n      ...EventInfo\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation createFinance($finance: CreateFinanceDto!) {\n    createFinance(finance: $finance) {\n      team {\n        __typename\n        id\n        currentFinance\n        finances {\n          ...FinanceInfo\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  mutation createFinance($finance: CreateFinanceDto!) {\n    createFinance(finance: $finance) {\n      team {\n        __typename\n        id\n        currentFinance\n        finances {\n          ...FinanceInfo\n        }\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation updateFinance($updateFinance: UpdateFinanceDto!) {\n    updateFinance(updateFinance: $updateFinance) {\n      ...FinanceInfo\n    }\n  }\n'
): (typeof documents)['\n  mutation updateFinance($updateFinance: UpdateFinanceDto!) {\n    updateFinance(updateFinance: $updateFinance) {\n      ...FinanceInfo\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation createProject($project: CreateProjectDto!) {\n    createProject(project: $project) {\n      ...ProjectInfo\n    }\n  }\n'
): (typeof documents)['\n  mutation createProject($project: CreateProjectDto!) {\n    createProject(project: $project) {\n      ...ProjectInfo\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation updateProject($updateProject: UpdateProjectDto!) {\n    updateProject(updateProject: $updateProject) {\n      ...ProjectInfo\n    }\n  }\n'
): (typeof documents)['\n  mutation updateProject($updateProject: UpdateProjectDto!) {\n    updateProject(updateProject: $updateProject) {\n      ...ProjectInfo\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation deactivateTeamImage($id: String!, $actorImageType: ActorImageType!) {\n    deactivateTeamImage(id: $id, actorImageType: $actorImageType) {\n      __typename\n      actor {\n        __typename\n        id\n        name\n        slug\n        actorImages {\n          ...ActorImageBareInfo\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  mutation deactivateTeamImage($id: String!, $actorImageType: ActorImageType!) {\n    deactivateTeamImage(id: $id, actorImageType: $actorImageType) {\n      __typename\n      actor {\n        __typename\n        id\n        name\n        slug\n        actorImages {\n          ...ActorImageBareInfo\n        }\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation teamAddDocument($teamId: String!, $createOrgDocument: CreateOrgDocumentDto!, $documentFile: Upload!) {\n    teamAddDocument(teamId: $teamId, createOrgDocument: $createOrgDocument, documentFile: $documentFile) {\n      __typename\n      id\n      org {\n        __typename\n        id\n        documents {\n          __typename\n          id\n          createdAt\n          type\n          document {\n            ...DocumentInfo\n          }\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  mutation teamAddDocument($teamId: String!, $createOrgDocument: CreateOrgDocumentDto!, $documentFile: Upload!) {\n    teamAddDocument(teamId: $teamId, createOrgDocument: $createOrgDocument, documentFile: $documentFile) {\n      __typename\n      id\n      org {\n        __typename\n        id\n        documents {\n          __typename\n          id\n          createdAt\n          type\n          document {\n            ...DocumentInfo\n          }\n        }\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation updateTeam($updateTeam: UpdateTeamDto!, $avatar: Upload) {\n    updateTeam(updateTeam: $updateTeam, avatar: $avatar) {\n      ...TeamManageInfo\n    }\n  }\n'
): (typeof documents)['\n  mutation updateTeam($updateTeam: UpdateTeamDto!, $avatar: Upload) {\n    updateTeam(updateTeam: $updateTeam, avatar: $avatar) {\n      ...TeamManageInfo\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation tenantAddDocument($tenantId: String!, $createDocument: CreateDocumentDto!, $documentFile: Upload!) {\n    tenantAddDocument(tenantId: $tenantId, createDocument: $createDocument, documentFile: $documentFile) {\n      __typename\n      id\n      org {\n        id\n        documents {\n          id\n          type\n          document {\n            ...DocumentInfo\n          }\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  mutation tenantAddDocument($tenantId: String!, $createDocument: CreateDocumentDto!, $documentFile: Upload!) {\n    tenantAddDocument(tenantId: $tenantId, createDocument: $createDocument, documentFile: $documentFile) {\n      __typename\n      id\n      org {\n        id\n        documents {\n          id\n          type\n          document {\n            ...DocumentInfo\n          }\n        }\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query getEvents {\n    events {\n      edges {\n        node {\n          ...EventInfo\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query getEvents {\n    events {\n      edges {\n        node {\n          ...EventInfo\n        }\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query getFinances($teamId: String!) {\n    financesByTeam(teamId: $teamId, options: {}) {\n      edges {\n        node {\n          ...FinanceInfo\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query getFinances($teamId: String!) {\n    financesByTeam(teamId: $teamId, options: {}) {\n      edges {\n        node {\n          ...FinanceInfo\n        }\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query me {\n    me {\n      user {\n        ...MyInfo\n      }\n      tenant {\n        ...TenantInfo\n      }\n    }\n  }\n'
): (typeof documents)['\n  query me {\n    me {\n      user {\n        ...MyInfo\n      }\n      tenant {\n        ...TenantInfo\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query getTeamById($id: String!) {\n    teamById(id: $id) {\n      ...TeamInfo\n    }\n  }\n'
): (typeof documents)['\n  query getTeamById($id: String!) {\n    teamById(id: $id) {\n      ...TeamInfo\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query getTeamCategories {\n    teamCategories {\n      edges {\n        node {\n          ...TeamCategoryInfo\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query getTeamCategories {\n    teamCategories {\n      edges {\n        node {\n          ...TeamCategoryInfo\n        }\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query getTeamCategoryBySlug($slug: String!) {\n    teamCategoryBySlug(slug: $slug) {\n      ...TeamCategoryInfo\n    }\n  }\n'
): (typeof documents)['\n  query getTeamCategoryBySlug($slug: String!) {\n    teamCategoryBySlug(slug: $slug) {\n      ...TeamCategoryInfo\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query getTeamDetails($slug: String!) {\n    teamBySlug(slug: $slug) {\n      ...TeamMembersInfo\n    }\n  }\n'
): (typeof documents)['\n  query getTeamDetails($slug: String!) {\n    teamBySlug(slug: $slug) {\n      ...TeamMembersInfo\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query getTeamManage($id: String!) {\n    teamById(id: $id) {\n      ...TeamMembersInfo\n      finances {\n        ...FinanceInfo\n      }\n    }\n  }\n'
): (typeof documents)['\n  query getTeamManage($id: String!) {\n    teamById(id: $id) {\n      ...TeamMembersInfo\n      finances {\n        ...FinanceInfo\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query getTeamManageBySlug($slug: String!) {\n    teamBySlug(slug: $slug) {\n      ...TeamManageInfo\n    }\n  }\n'
): (typeof documents)['\n  query getTeamManageBySlug($slug: String!) {\n    teamBySlug(slug: $slug) {\n      ...TeamManageInfo\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query getTeamWithMembers($id: String!) {\n    teamById(id: $id) {\n      ...TeamMembersInfo\n    }\n  }\n'
): (typeof documents)['\n  query getTeamWithMembers($id: String!) {\n    teamById(id: $id) {\n      ...TeamMembersInfo\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query getTeamWithMembersBySlug($slug: String!) {\n    teamBySlug(slug: $slug) {\n      ...TeamMembersInfo\n    }\n  }\n'
): (typeof documents)['\n  query getTeamWithMembersBySlug($slug: String!) {\n    teamBySlug(slug: $slug) {\n      ...TeamMembersInfo\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query getTeams {\n    teams(filter: { types: [Association, Club] }) {\n      edges {\n        node {\n          ...TeamInfo\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query getTeams {\n    teams(filter: { types: [Association, Club] }) {\n      edges {\n        node {\n          ...TeamInfo\n        }\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query getTeamsByCategory($categorySlug: String!) {\n    teams(filter: { categories: [$categorySlug], types: [Association, Club] }) {\n      edges {\n        node {\n          ...TeamMembersInfo\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query getTeamsByCategory($categorySlug: String!) {\n    teams(filter: { categories: [$categorySlug], types: [Association, Club] }) {\n      edges {\n        node {\n          ...TeamMembersInfo\n        }\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query getTeamsWithMembers {\n    teams {\n      edges {\n        node {\n          ...TeamMembersInfo\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query getTeamsWithMembers {\n    teams {\n      edges {\n        node {\n          ...TeamMembersInfo\n        }\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query getTenantById($id: String!) {\n    tenantById(id: $id) {\n      ...TenantInfo\n    }\n  }\n'
): (typeof documents)['\n  query getTenantById($id: String!) {\n    tenantById(id: $id) {\n      ...TenantInfo\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query getTenantDocumentsQuery($id: String!) {\n    tenantById(id: $id) {\n      ...TenantInfo\n    }\n  }\n'
): (typeof documents)['\n  query getTenantDocumentsQuery($id: String!) {\n    tenantById(id: $id) {\n      ...TenantInfo\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query getUserById($id: String!) {\n    userById(id: $id) {\n      ...MyInfo\n    }\n  }\n'
): (typeof documents)['\n  query getUserById($id: String!) {\n    userById(id: $id) {\n      ...MyInfo\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query getUserBySlug($slug: String!) {\n    userBySlug(slug: $slug) {\n      ...UserMembershipsInfo\n    }\n  }\n'
): (typeof documents)['\n  query getUserBySlug($slug: String!) {\n    userBySlug(slug: $slug) {\n      ...UserMembershipsInfo\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query getUserMembershipsById($id: String!) {\n    userById(id: $id) {\n      ...UserMembershipsInfo\n    }\n  }\n'
): (typeof documents)['\n  query getUserMembershipsById($id: String!) {\n    userById(id: $id) {\n      ...UserMembershipsInfo\n    }\n  }\n'];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<
  infer TType,
  any
>
  ? TType
  : never;
