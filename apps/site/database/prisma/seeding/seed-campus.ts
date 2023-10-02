import { DEFAULT_ADDRESSES, DEFAULT_CAMPUS_CLUSTERS, N_DEFAULT_CAMPUS } from './defaults';
import { prisma } from '../db';
import { parseSeedYaml } from '../parse-seed-yaml';
import { getAddress } from '../services/geoapify';

import { pickOneRandom, toSlug, unique } from '@okampus/shared/utils';
import { LocationType } from '@okampus/shared/enums';

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
    clusterNames.map((clusterName) =>
      prisma.campusCluster.create({ data: { name: clusterName, slug: toSlug(clusterName), tenantScopeId } }),
    ),
  );

  const allCampus = await Promise.all(
    campusData.map(async (campus) => {
      const campusCluster = campusClusters.find(({ name }) => name === campus.clusterName);
      if (campusCluster) {
        let locationProps;
        try {
          if (campus.location.geoapifyId) {
            const address = await getAddress(campus.location.geoapifyId);
            locationProps = { geoapifyId: address.geoapifyId, type: LocationType.Address };
          } else {
            locationProps = { link: campus.location.link, type: LocationType.Online };
          }
        } catch {
          locationProps = { type: LocationType.Unspecificed };
        }

        const location = await prisma.location.create({
          data: {
            name: campus.name,
            actorId: tenant.actorId,
            details: campus.location.details,
            ...locationProps,
            tenantScopeId,
          },
        });

        const slug = campus.slug || toSlug(campus.name);
        const campusClusterId = campusCluster.id;
        const locationId = location.id;
        await prisma.campus.create({ data: { name: campus.name, slug, campusClusterId, locationId, tenantScopeId } });
      }
    }),
  );

  return { campusClusters, campus: allCampus };
}
