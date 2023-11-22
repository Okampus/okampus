import { DEFAULT_ADDRESSES, DEFAULT_CAMPUS_CLUSTERS, N_DEFAULT_CAMPUS } from './defaults';
import { parseSeedYaml } from './from-yaml';

import prisma from '../db';

import { getAddress } from '../../../server/services/address';
import { isNotNull, pickOneRandom, unique, uniqueSlug } from '@okampus/shared/utils';

import { faker } from '@faker-js/faker';
import debug from 'debug';

import type { S3Client } from '@aws-sdk/client-s3';

export type Only<T, U> = {
  [P in keyof T]: T[P];
} & {
  [P in keyof U]?: never;
};

export type Either<T, U> = Only<T, U> | Only<U, T>;

export type TenantLocationData = {
  name: string;
  slug?: string;
  clusterName: string;
  location: Either<{ geoapifyId: string }, { link: string }> & {
    details?: string;
  };
};

function fakeTenantLocationData(): TenantLocationData[] {
  return DEFAULT_CAMPUS_CLUSTERS.flatMap((clusterName) =>
    Array.from({ length: N_DEFAULT_CAMPUS }).map(() => {
      return {
        name: faker.company.name(),
        clusterName,
        location: { geoapifyId: pickOneRandom(DEFAULT_ADDRESSES) },
      };
    }),
  );
}

type SeedTenantLocationOptions = {
  s3Client: S3Client | null;
  tenant: { id: bigint; actorId: bigint; domain: string };
  useFaker?: boolean;
};

const debugLog = debug('okampus:seed:tenant-location');
export async function seedTenantLocation({ s3Client, tenant, useFaker }: SeedTenantLocationOptions) {
  const faker = useFaker ? fakeTenantLocationData : () => [];
  const tenantLocationData = await parseSeedYaml(s3Client, `${tenant.domain}/tenant-locations.yaml`, faker);

  const clusterNames = unique(tenantLocationData.map(({ clusterName }) => clusterName));
  const tenantScopeId = tenant.id;

  const tenantLocationClusters = await Promise.all(
    clusterNames.map(
      async (clusterName) =>
        await prisma.tenantLocationCluster.create({
          data: { name: clusterName, slug: uniqueSlug(clusterName), tenantScopeId },
        }),
    ),
  );

  debugLog(`Created ${tenantLocationClusters.length} tenant location clusters`);
  const tenantLocation = await Promise.all(
    tenantLocationData.map(async ({ clusterName, name, location, slug }) => {
      const tenantLocationCluster = tenantLocationClusters.find(({ name }) => name === clusterName);
      if (tenantLocationCluster) {
        const address = location.geoapifyId ? await getAddress(location.geoapifyId) : null;
        return await prisma.tenantLocation.create({
          data: {
            name,
            slug: slug || uniqueSlug(name),
            geoapifyAddressId: address?.geoapifyId,
            tenantLocationClusterId: tenantLocationCluster.id,
          },
        });
      } else {
        debugLog(`Tenant location cluster ${clusterName} not found`);
        return null;
      }
    }),
  );

  debugLog(`Created ${tenantLocation.length} tenant location`);

  return { tenantLocationClusters, tenantLocation: tenantLocation.filter(isNotNull) };
}
