export type AddressInfo = {
  streetNumber: number;
  streetType: string;
  streetName: string;
  city: string;
  cityCode: string;
};

export type CompanyInfo = {
  nationalId: string;
  type?: string;
  activity?: string;
  name: string;
  address: AddressInfo;
};
