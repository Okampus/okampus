export type DocumentMinimalInfo = {
  id: string;
  name: string;
  type: string;
  file?: {
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
  } | null;
};
