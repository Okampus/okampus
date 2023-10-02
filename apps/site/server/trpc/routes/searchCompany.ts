import { inseeApiKey } from '../../../config/secrets';
import axios from 'axios';

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

const inseeAdressFields = [
  'numeroVoieEtablissement',
  'typeVoieEtablissement',
  'libelleVoieEtablissement',
  'codePostalEtablissement',
  'libelleCommuneEtablissement',
] as const;
const inseeCompanyFields = [
  'denominationUniteLegale',
  'activitePrincipaleUniteLegale',
  'categorieJuridiqueUniteLegale',
] as const;

interface InseeFields {
  siret: string;
  uniteLegale: {
    [key in (typeof inseeCompanyFields)[number]]: string;
  };
  adresseEtablissement: {
    [key in (typeof inseeAdressFields)[number]]: string;
  };
}

const axiosInstance = axios.create({ baseURL: 'https://api.insee.fr/entreprises/sirene/V3', method: 'GET' });
axiosInstance.defaults.headers.common.Authorization = `Bearer ${inseeApiKey}`;
axiosInstance.interceptors.request.use((config) => {
  config.params = { champs: ['siret', ...inseeAdressFields, ...inseeCompanyFields].join(','), ...config.params };
  return config;
});

// TODO: this is unused for now ; use later
export async function searchCompany(name: string, address?: AddressInfo): Promise<CompanyInfo[]> {
  // cf. https://www.sirene.fr/static-resources/doc/INSEE_Documentation-Extrait_q.pdf
  let q = `denominationUniteLegale:${name}~4`;
  if (address) {
    if (address.streetNumber && address.streetType)
      q += ` AND numeroVoieEtablissement:${address.streetNumber} AND typeVoieEtablissement:${address.streetType}`;
    if (address.streetName) q += ` AND libelleVoieEtablissement:${address.streetName}`;
    if (address.cityCode) q += ` AND codePostalEtablissement:${address.cityCode}`;
    if (address.city) q += ` AND libelleCommuneEtablissement:${address.city}`;
  }

  const { data } = await axiosInstance.get<{ etablissements: InseeFields[] }>('/siret', {
    params: { q, nombre: 5 },
  });

  const output = data.etablissements.map((etablissement) => ({
    nationalId: etablissement.siret,
    name: etablissement.uniteLegale.denominationUniteLegale,
    type: etablissement.uniteLegale.categorieJuridiqueUniteLegale,
    activity: etablissement.uniteLegale.activitePrincipaleUniteLegale,
    address: {
      streetNumber: Number.parseInt(etablissement.adresseEtablissement.numeroVoieEtablissement),
      streetType: etablissement.adresseEtablissement.typeVoieEtablissement,
      streetName: etablissement.adresseEtablissement.libelleVoieEtablissement,
      cityCode: etablissement.adresseEtablissement.codePostalEtablissement,
      city: etablissement.adresseEtablissement.libelleCommuneEtablissement,
    },
  }));

  return output;
}
