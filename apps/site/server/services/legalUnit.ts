import { getCountryCode, getGeoapifyAddressStructured } from './address';
import { inseeApiKey } from '../secrets';
import { jsonFetcher } from '../../utils/json-fetcher';
import { legalUnitUniqueCodeMinimal } from '../../types/prisma/LegalUnitUniqueCode/legal-unit-unique-code-minimal';

import prisma from '../../database/prisma/db';

import { uniqueSlug } from '@okampus/shared/utils';
import { ActorType, CountryCode, LegalUnitUniqueCodeType } from '@prisma/client';

import type { AddressInfo } from '../types';
import type { LegalUnitUniqueCodeMinimal } from '../../types/prisma/LegalUnitUniqueCode/legal-unit-unique-code-minimal';

const inseeAdressFields = [
  'numeroVoieEtablissement',
  'indiceRepetitionEtablissement',
  'typeVoieEtablissement',
  'libelleVoieEtablissement',
  'codePostalEtablissement',
  'codePaysEtrangerEtablissement',
  'libelleCommuneEtrangerEtablissement',
  'libelleCommuneEtablissement',
] as const;
const inseeCompanyFields = [
  'denominationUniteLegale',
  'activitePrincipaleUniteLegale',
  'categorieJuridiqueUniteLegale',
  'prenomUsuelUniteLegale',
  'nomUniteLegale',
] as const;

interface SireneLegalUnitProperties {
  siret: string;
  uniteLegale: {
    [key in (typeof inseeCompanyFields)[number]]: string;
  };
  adresseEtablissement: {
    [key in (typeof inseeAdressFields)[number]]: string;
  };
}

const champs = ['siret', ...inseeAdressFields, ...inseeCompanyFields].join(',');

// TODO: Find a way to retrieve the website
export async function sireneLegalUnitToLegalUnit(
  legalUnit: SireneLegalUnitProperties,
): Promise<LegalUnitUniqueCodeMinimal> {
  const code = { code: legalUnit.siret, codeType: LegalUnitUniqueCodeType.SIRET, country: CountryCode.FR };
  const company = await prisma.legalUnitUniqueCode.findFirst({
    where: code,
    select: legalUnitUniqueCodeMinimal.select,
  });

  if (company) return company;

  const {
    uniteLegale,
    adresseEtablissement: {
      libelleCommuneEtrangerEtablissement: foreignCity,
      libelleCommuneEtablissement: city,
      codePaysEtrangerEtablissement: foreignCountry,
      codePostalEtablissement: cityCode,
      libelleVoieEtablissement: streetName,
      typeVoieEtablissement: streetType,
      numeroVoieEtablissement: streetNumber,
      indiceRepetitionEtablissement: streetNumberSuffix,
    },
  } = legalUnit;

  const addressStructured = {
    countryCode: foreignCountry ? getCountryCode(foreignCountry.toUpperCase()) : CountryCode.FR,
    streetNumber: streetNumber + (streetNumberSuffix ? ` ${streetNumberSuffix}` : ''),
    streetName: streetType ? `${streetType} ${streetName}` : streetName,
    city: city ?? foreignCity,
    cityCode,
  };

  const address = await getGeoapifyAddressStructured(addressStructured);

  const name =
    uniteLegale.denominationUniteLegale ?? `${uniteLegale.prenomUsuelUniteLegale} ${uniteLegale.nomUniteLegale}`;
  const actor = { create: { name, type: ActorType.LegalUnit } };

  const legalUnitData = {
    legalName: name,
    slug: uniqueSlug(name),
    actor,
    address: address ? { connect: { geoapifyId: address.geoapifyId } } : undefined,
  };

  return await prisma.legalUnitUniqueCode.create({
    data: { ...code, legalUnit: { create: legalUnitData } },
    select: legalUnitUniqueCodeMinimal.select,
  });
}

export async function getSireneCompany(siret: string): Promise<LegalUnitUniqueCodeMinimal | null> {
  const company = await prisma.legalUnitUniqueCode.findUnique({
    where: { country_codeType_code: { code: siret, codeType: LegalUnitUniqueCodeType.SIRET, country: CountryCode.FR } },
    select: legalUnitUniqueCodeMinimal.select,
  });

  if (company) return company;

  const data: { etablissement: SireneLegalUnitProperties } = await jsonFetcher(
    `https://api.insee.fr/entreprises/sirene/V3/siret/${siret}?champs=${champs}`,
    { headers: { Authorization: `Bearer ${inseeApiKey}` } },
  );

  if (!data.etablissement) return null;
  return await sireneLegalUnitToLegalUnit(data.etablissement);
}

export async function searchCompanies(name: string, limit = 5, address: AddressInfo | null = null) {
  // cf. https://www.sirene.fr/static-resources/doc/INSEE_Documentation-Extrait_q.pdf
  let q = '';
  if (name) q += `denominationUniteLegale:"${encodeURI(name)}"`;
  if (address) {
    if (address.streetNumber) q += `${q ? ' AND ' : ''}numeroVoieEtablissement:"${address.streetNumber}"`;
    if (address.streetName) q += `${q ? ' AND ' : ''}libelleVoieEtablissement:"${address.streetName}"`;
    if (address.cityCode) q += `${q ? ' AND ' : ''}codePostalEtablissement:"${address.cityCode}"`;
    if (address.city) q += `${q ? ' AND ' : ''}libelleCommuneEtablissement:"${address.city}"`;
  }

  const data: { etablissements: SireneLegalUnitProperties[] } = await jsonFetcher(
    `https://api.insee.fr/entreprises/sirene/V3/siret?q=${q}&nombre=${limit}&champs=${champs}`,
    { headers: { Authorization: `Bearer ${inseeApiKey}` } },
  );

  return data.etablissements;
}

export async function getSireneCompanies() {
  const companies = await searchCompanies('', 20);
  return await Promise.all(companies.map(sireneLegalUnitToLegalUnit));
}
