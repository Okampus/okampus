export type RequiredDocumentInfo = {
  id: bigint | string;
  name: string;
  description: string;
  teamTypes: string[] | null;
  isRequired: boolean;
};
