const DEFAULT = 0;
const VIEW_TREASURY = 1;
const MANAGE_TREASURY = 2;
const VIEW_JOINS = 4;
const MANAGE_JOINS = 8;
const MANAGE_ROLES = 16;
const MANAGE_MEMBERS = 32;
const MANAGE_TEAM = 64;
const VIEW_DRAFT_EVENTS = 128;
const CREATE_EVENTS = 256;
const MANAGE_EVENTS = 512;

const ADMIN =
  VIEW_TREASURY |
  MANAGE_TREASURY |
  VIEW_JOINS |
  MANAGE_JOINS |
  MANAGE_ROLES |
  MANAGE_MEMBERS |
  MANAGE_TEAM |
  VIEW_DRAFT_EVENTS |
  CREATE_EVENTS |
  MANAGE_EVENTS;

export enum TeamPermissions {
  Default = DEFAULT,
  ViewTreasury = VIEW_TREASURY,
  ManageTreasury = MANAGE_TREASURY,
  ViewJoins = VIEW_JOINS,
  ManageJoins = MANAGE_JOINS,
  ManageRoles = MANAGE_ROLES,
  ManageMembers = MANAGE_MEMBERS,
  ManageTeam = MANAGE_TEAM,
  ViewDraftEvents = VIEW_DRAFT_EVENTS,
  CreateEvents = CREATE_EVENTS,
  ManageEvents = MANAGE_EVENTS,
  Admin = ADMIN,
}
