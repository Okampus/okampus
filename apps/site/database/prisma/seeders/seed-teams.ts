import { DEFAULT_ADDRESSES, N_DEFAULT_TEAMS } from './defaults';
import { parseSeedYaml } from './from-yaml';
import prisma from '../db';

import { seedingBucket } from '../../../server/secrets';
import { readS3File } from '../../../server/utils/read-s3-file';
import { getAddress } from '../../../server/services/address';
import { createActorImage } from '../../../server/services/upload';

import { fakeText } from '../fakers/faker-utils';

import { toSlug, pickRandom, isNotNull, pickOneRandom, uniqueSlug } from '@okampus/shared/utils';

import { faker } from '@faker-js/faker';
import {
  TeamType,
  TeamHistoryType,
  ApproximateDate,
  TransactionType,
  PaymentMethod,
  ActorImageType,
  ActorType,
} from '@prisma/client';
import debug from 'debug';

import type { BankMinimal } from '../../../types/prisma/Bank/bank-minimal';
import type { S3Client } from '@aws-sdk/client-s3';
import type { SocialType } from '@prisma/client';

export type TeamData = {
  avatar?: Buffer;
  bio?: string;
  categories?: string[];
  email?: string;
  name: string;
  parent?: string;
  slug?: string;
  socials: { pseudo: string; type: SocialType; url: string }[];
  status?: string;
  type: TeamType;
  website?: string;
  originalCreationDay?: number;
  originalCreationMonth?: number;
  originalCreationYear?: number;
  expectingPresidentEmail?: string;
  expectingTreasurerEmail?: string;
  expectingSecretaryEmail?: string;
  bankAccountInfo?: { bic: string; geoapifyId: string; iban: string };
  initialSubvention?: number;
  clusters?: string[];
};

function fakeTeamsData(
  categorieSlugs: { slug: string }[],
  tenant: { domain: string },
  tenantLocationClusters: { slug: string }[],
): TeamData[] {
  const tenantLocationClusterSlugs = tenantLocationClusters.map(({ slug }) => slug);
  const slugs: string[] = [];
  return Array.from({ length: N_DEFAULT_TEAMS }).map(() => {
    const name = faker.company.name();
    const slug = uniqueSlug(name);
    const email = `${slug}@${tenant.domain}.fr`;

    let parent;
    if (slugs.length > 1 && Math.random() > 0.75) parent = pickOneRandom(slugs);
    slugs.push(slug);

    const categories = pickRandom(categorieSlugs, 1, 3).map(({ slug }) => slug);
    const status = faker.company.catchPhrase();
    const type = parent ? TeamType.Club : TeamType.Association;

    // TODO: fake socials
    const clusters = pickRandom(tenantLocationClusterSlugs, 1, 3);
    return { bio: fakeText(), clusters, email, name, parent, slug, socials: [], status, categories, type };
  });
}

export type SeedTeamsOptions = {
  s3Client: S3Client | null;
  categories: { id: bigint; name: string; slug: string }[];
  banks: BankMinimal[];
  tenantLocationClusters: { id: bigint; slug: string }[];
  tenant: { id: bigint; actorId: bigint; domain: string };
  useFaker?: boolean;
};

// TODO: get admins from tenant

const debugLog = debug('okampus:seed:teams');
export async function seedTeams({
  s3Client,
  categories,
  tenant,
  tenantLocationClusters,
  banks,
  useFaker,
}: SeedTeamsOptions) {
  const fakeSeeder = useFaker ? () => fakeTeamsData(categories, tenant, tenantLocationClusters) : () => [];
  const teamsData = await parseSeedYaml(s3Client, `${tenant.domain}/teams.yaml`, fakeSeeder);

  const teams = await Promise.all(
    teamsData.map(async (teamData) => {
      debugLog('Seeding team:', { teamData });
      const socials = teamData.socials ?? [];
      const teamCategories = (teamData.categories && Array.isArray(teamData.categories) ? teamData.categories : [])
        .map((slug) => categories.find((category) => category.slug === slug))
        .filter(isNotNull);

      const team = await prisma.team.create({
        data: {
          actor: {
            create: {
              name: teamData.name,
              bio: teamData.bio,
              email: teamData.email,
              status: teamData.status,
              website: teamData.website,
              actorTags: { create: teamCategories.map((category) => ({ tagId: category.id })) },
              socials: { create: socials.map((social, order) => ({ order, ...social })) },
              type: ActorType.Team,
            },
          },
          slug: teamData.slug || toSlug(teamData.name),
          type: teamData.parent ? TeamType.Club : TeamType.Association,
          membersCategoryName: 'Membres',
          managersCategoryName: 'Bureau étendu',
          directorsCategoryName: 'Bureau restreint',
          tenantScope: { connect: { id: tenant.id } },
        },
      });

      if (seedingBucket) {
        const buffer = await readS3File(s3Client, seedingBucket, `${tenant.domain}/teams.yaml`);
        if (buffer) {
          await createActorImage({
            // blob: new File([buffer], 'avatar.webp', { type: 'image/webp' }),
            blob: new Blob([buffer], { type: 'image/webp' }),
            actorId: team.actorId,
            actorImageType: ActorImageType.Avatar,
            authContext: { tenant, role: 'admin' },
          });
        }
      }

      if (teamData.originalCreationYear) {
        const type = TeamHistoryType.AcitivityStart;
        const happenedAt = new Date(
          teamData.originalCreationYear,
          teamData.originalCreationMonth ?? 0,
          teamData.originalCreationDay ?? 0,
        );

        let approximateDate;
        if (teamData.originalCreationDay) approximateDate = ApproximateDate.Day;
        else if (teamData.originalCreationMonth) approximateDate = ApproximateDate.Month;
        else approximateDate = ApproximateDate.Year;

        await prisma.teamHistory.create({ data: { teamId: team.id, type, approximateDate, happenedAt } });
      }

      const type = TeamHistoryType.OkampusStart;
      const approximateDate = ApproximateDate.Exact;

      await prisma.teamHistory.create({ data: { teamId: team.id, type, approximateDate, happenedAt: new Date() } });

      if (teamData.clusters) {
        for (const clusterSlug of teamData.clusters) {
          const cluster = tenantLocationClusters.find((cluster) => cluster.slug === clusterSlug);
          if (cluster)
            await prisma.actorCluster.create({ data: { actorId: team.actorId, tenantLocationClusterId: cluster.id } });
        }
      }

      return team;
    }),
  );

  const accounts: { id: bigint; teamId: bigint }[] = [];

  await Promise.all(
    teamsData.map(async (teamData, idx) => {
      const team = teams.at(idx);
      if (team) {
        // Add parent to teams
        if (teamData.parent) {
          const parent = teams.find((team) => team.slug === teamData.parent);
          if (parent) await prisma.team.update({ where: { id: team.id }, data: { parentId: parent.id } });
        }

        // Create parent bank accounts
        if (useFaker && Math.random() > 0.8) {
          teamData.bankAccountInfo = {
            bic: pickOneRandom(banks).bic,
            geoapifyId: pickOneRandom(DEFAULT_ADDRESSES),
            iban: `FR76${faker.finance.iban()}`,
          };
        }

        const bankAccountInfoData = teamData.bankAccountInfo;
        if (bankAccountInfoData && !teamData.parent) {
          const bank = banks.find((bank) => bank.bic === bankAccountInfoData.bic);
          if (!bank) throw new Error(`Bank with BIC ${bankAccountInfoData.bic} not found`);

          try {
            const { geoapifyId, iban } = bankAccountInfoData;
            const address = await getAddress(geoapifyId);

            const bankId = bank.goCardLessInstitutionId;

            const branchGeoapifyAddressId = address ? address.geoapifyId : null;
            const bankAccountInfo = await prisma.bankAccountInfo.create({
              data: { bankId, branchGeoapifyAddressId, actorId: team.actorId, iban },
            });

            const moneyAccountData = { bankAccountInfoId: bankAccountInfo.id, teamId: team.id };
            const moneyAccount = await prisma.moneyAccount.create({ data: moneyAccountData });

            accounts.push(moneyAccount);

            if (teamData.initialSubvention) {
              await prisma.transaction.create({
                data: {
                  moneyAccountId: moneyAccount.id,
                  amount: teamData.initialSubvention,
                  wording: 'Subvention initiale',
                  payedAt: new Date(),
                  paymentMethod: PaymentMethod.BankTransfer,
                  counterPartyActorId: tenant.actorId,
                  transactionType: TransactionType.Subvention,
                  teamId: team.id,
                },
              });
            }
          } catch (error) {
            debugLog(error);
          }
        }
      }
    }),
  );

  await Promise.all(
    teamsData
      .filter((teamData) => teamData.parent)
      .map(async (teamData) => {
        const parent = teams.find((team) => team.slug === teamData.parent);
        if (!parent) return;

        const team = teams.find((team) => team.slug === teamData.slug || toSlug(teamData.name));
        if (!team) return;

        const parentAccount = accounts.find((account) => account.teamId === parent.id);
        if (!parentAccount) return;

        const childAccount = await prisma.moneyAccount.create({
          data: { parentId: parentAccount.id, teamId: team.id },
        });
        accounts.push(childAccount);
      }),
  );

  return teams.map((team) => [team, accounts.find(({ teamId }) => teamId === team.id)] as const);
}
