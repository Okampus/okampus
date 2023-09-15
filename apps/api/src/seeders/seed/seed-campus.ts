import { getCampusData } from './data/campus.data';
import { Campus, CampusCluster, Location } from '@okampus/api/dal';
import { LocationType } from '@okampus/shared/enums';

import { unique } from '@okampus/shared/utils';

import type { GeocodeService } from '@okampus/api/bll';
import type { Tenant } from '@okampus/api/dal';
import type { S3Client } from '@aws-sdk/client-s3';

type SeedCampusOptions = {
  s3Client: S3Client | null;
  geocodeService: GeocodeService;
  tenant: Tenant;
};

type SeedCampusReturn = {
  campusClusters: CampusCluster[];
  campus: Campus[];
};

export async function seedCampus({ s3Client, geocodeService, tenant }: SeedCampusOptions): Promise<SeedCampusReturn> {
  const campusData = await getCampusData(s3Client, tenant);
  const clusterNames = unique(campusData.map(({ clusterName }) => clusterName));

  const campusClusters = clusterNames.map(
    (clusterName) => new CampusCluster({ name: clusterName, tenantScope: tenant }),
  );
  const allCampus = [];
  for (const campus of campusData) {
    const campusCluster = campusClusters.find(({ name }) => name === campus.clusterName);
    if (campusCluster) {
      const locationOptions = {
        actor: tenant.actor,
        name: campus.name,
        tenantScope: tenant,
        details: campus.location.details,
      };

      const location = campus.location.addressGeoapifyId
        ? new Location({
            address: await geocodeService.getGeoapifyAddress(campus.location.addressGeoapifyId),
            link: campus.location.link,
            type: LocationType.Address,
            ...locationOptions,
          })
        : new Location({ link: campus.location.link, type: LocationType.Online, ...locationOptions });

      allCampus.push(new Campus({ name: campus.name, campusCluster, location, tenantScope: tenant }));
    }
  }

  return { campusClusters, campus: allCampus };
}
