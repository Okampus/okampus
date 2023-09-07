import { loadConfig } from '../../shards/utils/load-config';

import { EntityManager } from '@mikro-orm/core';

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import axios from 'axios';

import type { AxiosInstance } from 'axios';
import type { AddressInfo, CompanyInfo } from '@okampus/shared/types';

// const inseeFields = {
//   uniteLegale: {
//     denominationUniteLegale: 'denominationUniteLegale',
//     activitePrincipaleUniteLegale: 'activitePrincipaleUniteLegale',
//   }
// }

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

@Injectable()
export class NationalIdentificationService {
  inseeAxiosInstance: AxiosInstance;
  inseeApiToken: string;
  logger = new Logger(NationalIdentificationService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly em: EntityManager,
  ) {
    this.inseeApiToken = loadConfig(this.configService, 'insee.apiToken');

    this.inseeAxiosInstance = axios.create({ baseURL: 'https://api.insee.fr/entreprises/sirene/V3', method: 'GET' });
    this.inseeAxiosInstance.defaults.headers.common.Authorization = `Bearer ${this.inseeApiToken}`;

    const champs = ['siret', ...inseeAdressFields, ...inseeCompanyFields].join(',');
    this.inseeAxiosInstance.interceptors.request.use((config) => {
      config.params = { champs, ...config.params };
      return config;
    });
  }

  public async searchFrenchCompany(name: string, address?: AddressInfo): Promise<CompanyInfo[]> {
    // cf. https://www.sirene.fr/static-resources/doc/INSEE_Documentation-Extrait_q.pdf
    let q = `denominationUniteLegale:${name}~4`;
    if (address) {
      if (address.streetNumber && address.streetType)
        q += ` AND numeroVoieEtablissement:${address.streetNumber} AND typeVoieEtablissement:${address.streetType}`;
      if (address.streetName) q += ` AND libelleVoieEtablissement:${address.streetName}`;
      if (address.cityCode) q += ` AND codePostalEtablissement:${address.cityCode}`;
      if (address.city) q += ` AND libelleCommuneEtablissement:${address.city}`;
    }

    const { data } = await this.inseeAxiosInstance.get<{ etablissements: InseeFields[] }>('/siret', {
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
}
