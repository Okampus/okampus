const VIEW_TREASURY = 1;
const MANAGE_TREASURY = 2;
const VIEW_JOINS = 4;
const MANAGE_JOINS = 8;
const MANAGE_ROLES = 16;
const MANAGE_MEMBERS = 32;
const MANAGE_PROFILE = 64;
const VIEW_DRAFT_EVENTS = 128;
const CREATE_EVENTS = 256;
const MANAGE_EVENTS = 512;
const CREATE_CONTENTS = 1024;
const MANAGE_CONTENTS = 2048;
const CREATE_ACTIONS = 4096;
const MANAGE_ACTIONS = 8192;

const VIEW_HIDDEN = 16_384;
const MANAGE_HIDDEN = 32_768;
const CREATE_TEAM = 65_536;
const MANAGE_CAMPUS = 131_072;
const MANAGE_APPROVAL_STEPS = 262_144;
const MANAGE_EVENT_APPROVALS = 524_288;

export enum TeamPermissions {
  ViewTreasury = VIEW_TREASURY,
  ManageTreasury = MANAGE_TREASURY,
  ViewJoins = VIEW_JOINS,
  ManageJoins = MANAGE_JOINS,
  ManageRoles = MANAGE_ROLES,
  ManageMembers = MANAGE_MEMBERS,
  ManageProfile = MANAGE_PROFILE,
  ViewDraftEvents = VIEW_DRAFT_EVENTS,
  CreateEvents = CREATE_EVENTS,
  ManageEvents = MANAGE_EVENTS,
  CreateContents = CREATE_CONTENTS,
  ManageContents = MANAGE_CONTENTS,
  CreateActions = CREATE_ACTIONS,
  ManageActions = MANAGE_ACTIONS,
}

export enum TenantPermissions {
  ViewHidden = VIEW_HIDDEN,
  ManageHidden = MANAGE_HIDDEN,
  CreateTeam = CREATE_TEAM,
  ManageCampus = MANAGE_CAMPUS,
  ManageApprovalSteps = MANAGE_APPROVAL_STEPS,
  ManageEventApprovals = MANAGE_EVENT_APPROVALS,
}
