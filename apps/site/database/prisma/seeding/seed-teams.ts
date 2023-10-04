import { prisma } from '../db';
import { parseSeedYaml } from '../parse-seed-yaml';
import { createImageUpload } from '../services/upload';
import { seedingBucket } from '../../../config/secrets';
import { readS3File } from '../../../server/utils/read-s3-file';

import { getAddress } from '../services/geoapify';
import {
  TeamType,
  TeamHistoryEventType,
  ApproximateDate,
  S3BucketNames,
  EntityNames,
  TransactionCategory,
  PaymentMethod,
  ProcessedByType,
  TransactionState,
  ActorImageType,
} from '@okampus/shared/enums';
import { toSlug, pickRandom, randomId, isNotNull } from '@okampus/shared/utils';

import { faker } from '@faker-js/faker';
import { randomInt } from 'node:crypto';

import type { S3Client } from '@aws-sdk/client-s3';
import type { SocialType } from '@okampus/shared/enums';

export type TeamData = {
  name: string;
  type: TeamType;
  email?: string;
  website?: string;
  status?: string;
  bio?: string;
  categories?: string[];
  socials: { pseudo: string; type: SocialType; url: string }[];
  slug?: string;
  avatar?: Buffer | null;
  parent?: string;
  originalCreationDay?: number;
  originalCreationMonth?: number;
  originalCreationYear?: number;
  expectingPresidentEmail?: string;
  expectingTreasurerEmail?: string;
  expectingSecretaryEmail?: string;
  initialSubvention?: number;
  bankInfo?: { bicSwift: string; geoapifyId: string; iban: string };
};

function fakeTeamsData(categories: { id: bigint; slug: string }[], tenant: { domain: string }): TeamData[] {
  return Array.from({ length: 10 }).map(() => {
    const name = faker.company.name();
    return {
      name,
      email: `${toSlug(name)}@${tenant.domain}.fr`,
      avatar: null,
      bio: faker.lorem.paragraph(randomInt(2, 12)),
      tags: pickRandom(categories, 1, 3),
      socials: [],
      slug: `${toSlug(name)}-${randomId()}`,
      status: faker.company.catchPhrase(),
      type: TeamType.Association,
    };
  });
}

export type SeedTeamsOptions = {
  s3Client: S3Client | null;
  categories: { id: bigint; slug: string }[];
  banks: { id: bigint; bankCode: number }[];
  tenant: { id: bigint; actorId: bigint; domain: string };
  useFaker?: boolean;
};

export async function seedTeams({ s3Client, categories, tenant, banks, useFaker }: SeedTeamsOptions) {
  const faker = useFaker ? () => fakeTeamsData(categories, tenant) : () => [];
  const teamsData = await parseSeedYaml(s3Client, `${tenant.domain}/teams.yaml`, faker);
  const teams = await Promise.all(
    teamsData.map(async (teamData) => {
      const teamCategoriesSlugs = teamData.categories && Array.isArray(teamData.categories) ? teamData.categories : [];

      let image;
      const buffer =
        s3Client && seedingBucket ? await readS3File(s3Client, seedingBucket, `${tenant.domain}/teams.yaml`) : null;

      if (buffer) {
        const meta = { filename: teamData.name, mimetype: 'image/webp' };
        image = await createImageUpload(buffer, meta, S3BucketNames.Thumbnails, EntityNames.Tag, 200, {
          tenantScopeId: tenant.id,
          createdById: tenant.id,
        });
      }

      const teamCategories = teamCategoriesSlugs
        .map((slug) => categories.find((category) => category.slug === slug))
        .filter(isNotNull);

      const team = await prisma.team.create({
        data: {
          actor: {
            create: {
              name: teamData.name,
              avatar: image?.url,
              bio: teamData.bio,
              email: teamData.email,
              status: teamData.status,
              website: teamData.website,
              actorTags: { create: teamCategories.map((category) => ({ tagId: category.id })) },
              socials: { create: teamData.socials.map((social, order) => ({ order, ...social })) },
              tenantScopeId: tenant.id,
            },
          },
          slug: teamData.slug || toSlug(teamData.name),
          type: teamData.parent ? TeamType.Club : TeamType.Association,
          managersCategoryName: 'Bureau étendu',
          directorsCategoryName: 'Bureau restreint',
          membersCategoryName: 'Membres',
          tenantScope: { connect: { id: tenant.id } },
        },
      });

      if (image)
        prisma.actorImage.create({ data: { actorId: team.actorId, imageId: image.id, type: ActorImageType.Avatar } });

      if (teamData.originalCreationYear) {
        const eventType = TeamHistoryEventType.Start;
        const eventDate = new Date(
          teamData.originalCreationYear,
          teamData.originalCreationMonth ?? 0,
          teamData.originalCreationDay ?? 0,
        );

        let approximateDate;
        if (teamData.originalCreationDay) approximateDate = ApproximateDate.Day;
        else if (teamData.originalCreationMonth) approximateDate = ApproximateDate.Month;
        else approximateDate = ApproximateDate.Year;

        await prisma.teamHistory.create({
          data: { teamId: team.id, eventType, approximateDate, eventDate, tenantScopeId: tenant.id },
        });
      }

      const eventType = TeamHistoryEventType.OkampusStart;
      const approximateDate = ApproximateDate.Exact;

      await prisma.teamHistory.create({
        data: { teamId: team.id, eventType, approximateDate, eventDate: new Date(), tenantScopeId: tenant.id },
      });

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
        if (teamData.bankInfo && !teamData.parent) {
          const { geoapifyId, ...bankInfoData } = teamData.bankInfo;

          const bankCode = Number.parseInt(teamData.bankInfo.iban.slice(4, 9));
          const bank = banks.find((bank) => bank.bankCode === bankCode);
          if (!bank) throw new Error(`Bank with code ${bankCode} not found`);

          try {
            const address = await getAddress(geoapifyId);
            const bankInfo = await prisma.bankInfo.create({
              data: {
                bankId: bank.id,
                branchAddressId: address.geoapifyId,
                actorId: team.actorId,
                ...bankInfoData,
                tenantScopeId: tenant.id,
              },
            });
            const bankAccount = await prisma.bankAccount.create({
              data: {
                bankInfoId: bankInfo.id,
                teamId: team.id,
                tenantScopeId: tenant.id,
              },
            });

            accounts.push(bankAccount);

            if (teamData.initialSubvention) {
              await prisma.transaction.create({
                data: {
                  bankAccountId: bankAccount.id,
                  amount: teamData.initialSubvention,
                  payedAt: new Date(),
                  method: PaymentMethod.Transfer,
                  category: TransactionCategory.Subvention,
                  payedById: tenant.actorId,
                  processedByType: ProcessedByType.Automatic,
                  receivedById: team.actorId,
                  state: TransactionState.Completed,
                  tenantScopeId: tenant.id,
                },
              });
            }
          } catch (error) {
            console.error(error);
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
        const childAccount = await prisma.bankAccount.create({
          data: { parentId: parent.id, teamId: team.id, tenantScopeId: tenant.id },
        });
        accounts.push(childAccount);
      }),
  );

  return teams;
}
