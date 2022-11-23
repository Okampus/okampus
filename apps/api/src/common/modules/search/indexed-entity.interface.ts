export interface BaseIndex {
  [key: string]: unknown;
  title: string;
  picture: string | null;
  description: string | null;
  category: string | null;
  createdDate: number;
  updatedDate: number;
  users: string[] | null;
  tags: string[] | null;
}

export interface IndexedEntity extends BaseIndex {
  id: string;
  realId: string;
  metaType: string;
}
