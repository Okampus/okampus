import { DEFAULT_ADDRESSES, DEFAULT_CAMPUS_CLUSTERS, N_DEFAULT_CAMPUS } from './defaults';
import { parseSeedYaml } from './from-yaml';

import prisma from '../db';
import { getAddress } from '../services/geoapify';

import { isNotNull, pickOneRandom, toSlug, unique } from '@okampus/shared/utils';
import { LocationType } from '@prisma/client';

import { faker } from '@faker-js/faker';

import type { S3Client } from '@aws-sdk/client-s3';

export type Only<T, U> = {
  [P in keyof T]: T[P];
} & {
  [P in keyof U]?: never;
};

export type Either<T, U> = Only<T, U> | Only<U, T>;

export type CampusData = {
  name: string;
  slug?: string;
  clusterName: string;
  location: Either<{ geoapifyId: string }, { link: string }> & {
    details?: string;
  };
};

function fakeCampusData(): CampusData[] {
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

type SeedCampusOptions = {
  s3Client: S3Client | null;
  tenant: { id: bigint; actorId: bigint; domain: string };
  useFaker?: boolean;
};

export async function seedCampus({ s3Client, tenant, useFaker }: SeedCampusOptions) {
  const faker = useFaker ? fakeCampusData : () => [];
  const campusData = await parseSeedYaml(s3Client, `${tenant.domain}/campus.yaml`, faker);

  const clusterNames = unique(campusData.map(({ clusterName }) => clusterName));
  const tenantScopeId = tenant.id;

  const campusClusters = await Promise.all(
    clusterNames.map(
      async (clusterName) =>
        await prisma.campusCluster.create({ data: { name: clusterName, slug: toSlug(clusterName), tenantScopeId } }),
    ),
  );
  console.log(`Created ${campusClusters.length} campus clusters`);

  const campus = await Promise.all(
    campusData.map(async ({ clusterName, name, location, slug }) => {
      const campusCluster = campusClusters.find(({ name }) => name === clusterName);
      if (campusCluster) {
        let locationProps;
        try {
          if (location.geoapifyId) {
            const address = await getAddress(location.geoapifyId);
            locationProps = { geoapifyId: address.geoapifyId, type: LocationType.Address };
          } else {
            locationProps = { link: location.link, type: LocationType.Online };
          }
        } catch {
          locationProps = { type: LocationType.Unspecificed };
        }

        const campusLocation = await prisma.location.create({
          data: { name, actorId: tenant.actorId, ...locationProps, tenantScopeId },
        });

        const campusClusterId = campusCluster.id;
        const locationId = campusLocation.id;
        const campusData = { name, slug: slug || toSlug(name), campusClusterId, locationId, tenantScopeId };
        return await prisma.campus.create({ data: campusData });
      } else {
        console.error(`Campus cluster ${clusterName} not found`);
        return null;
      }
    }),
  );

  console.log(`Created ${campus.length} campus`);

  return { campusClusters, campus: campus.filter(isNotNull) };
}
