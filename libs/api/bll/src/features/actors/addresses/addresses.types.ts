import type {
  AddressInsertInput,
  AddressOnConflict,
  AddressSetInput,
  AddressBoolExp,
  AddressOrderBy,
  AddressSelectColumn,
  AddressPkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertAddressArgsType = {
  objects: Array<AddressInsertInput>;
  onConflict?: AddressOnConflict;
};

export type InsertOneAddressArgsType = {
  object: AddressInsertInput;
  onConflict?: AddressOnConflict;
};

export type UpdateAddressArgsType = {
  where: AddressBoolExp;
  _set: AddressSetInput;
};

export type DeleteAddressArgsType = {
  where: AddressBoolExp;
};

export type DeleteByPkAddressArgsType = {
  id: string;
};

export type UpdateByPkAddressArgsType = {
  pkColumns: AddressPkColumnsInput;
  _set: AddressSetInput;
};

export type FindAddressArgsType = {
  where: AddressBoolExp;
  orderBy?: Array<AddressOrderBy>;
  distinctOn?: Array<AddressSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkAddressArgsType = {
  id: string;
};

export type AggregateAddressArgsType = {
  where: AddressBoolExp;
  orderBy?: Array<AddressOrderBy>;
  distinctOn?: Array<AddressSelectColumn>;
  limit?: number;
  offset?: number;
};
