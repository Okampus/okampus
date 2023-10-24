import { N_DEFAULT_TEAMS } from './defaults';
import { parseSeedYaml } from './from-yaml';
import { prisma } from '../db';
import { getAddress } from '../services/geoapify';

import { seedingBucket } from '../../../config/secrets';
import { readS3File } from '../../../server/utils/read-s3-file';

import { fakeText } from '../fakers/faker-utils';

import { createActorImage } from '../services/upload';
import { toSlug, pickRandom, isNotNull, pickOneRandom, uniqueSlug } from '@okampus/shared/utils';

import { faker } from '@faker-js/faker';
import {
  TeamType,
  TeamHistoryType,
  ApproximateDate,
  TransactionType,
  PaymentMethod,
  ProcessedByType,
  ApprovalState,
  ActorImageType,
  ActorType,
} from '@prisma/client';

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
  bankInfo?: { bicSwift: string; geoapifyId: string; iban: string };
  initialSubvention?: number;
};

function fakeTeamsData(categorieSlugs: { slug: string }[], tenant: { domain: string }): TeamData[] {
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
    return { bio: fakeText(), email, name, parent, slug, socials: [], status, categories, type };
  });
}

export type SeedTeamsOptions = {
  s3Client: S3Client | null;
  categories: { id: bigint; name: string; slug: string }[];
  banks: { id: bigint; bankCode: number }[];
  tenant: { id: bigint; actorId: bigint; domain: string };
  useFaker?: boolean;
};

export async function seedTeams({ s3Client, categories, tenant, banks, useFaker }: SeedTeamsOptions) {
  const faker = useFaker ? () => fakeTeamsData(categories, tenant) : () => [];
  const teamsData = await parseSeedYaml(s3Client, `${tenant.domain}/teams.yaml`, faker);

  const scope = { tenantScopeId: tenant.id };
  const teams = await Promise.all(
    teamsData.map(async (teamData) => {
      console.log({ teamData });
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
              type: ActorType.Tenant,
              ...scope,
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

        await prisma.teamHistory.create({
          data: { teamId: team.id, type, approximateDate, happenedAt, ...scope },
        });
      }

      const type = TeamHistoryType.OkampusStart;
      const approximateDate = ApproximateDate.Exact;

      await prisma.teamHistory.create({
        data: { teamId: team.id, type, approximateDate, happenedAt: new Date(), ...scope },
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
          const bankCode = Number.parseInt(teamData.bankInfo.iban.slice(4, 9));
          const bank = banks.find((bank) => bank.bankCode === bankCode);
          if (!bank) throw new Error(`Bank with code ${bankCode} not found`);

          try {
            const { geoapifyId, bicSwift, iban } = teamData.bankInfo;
            const address = await getAddress(geoapifyId);

            const bankInfoData = { bankId: bank.id, branchAddressId: address.geoapifyId, actorId: team.actorId };
            const bankInfo = await prisma.bankInfo.create({ data: { ...bankInfoData, bicSwift, iban, ...scope } });

            const bankAccountData = { bankInfoId: bankInfo.id, teamId: team.id, ...scope };
            const bankAccount = await prisma.bankAccount.create({ data: bankAccountData });

            accounts.push(bankAccount);

            if (teamData.initialSubvention) {
              await prisma.transaction.create({
                data: {
                  bankAccountId: bankAccount.id,
                  amount: teamData.initialSubvention,
                  payedAt: new Date(),
                  method: PaymentMethod.Transfer,
                  payedById: tenant.actorId,
                  processedByType: ProcessedByType.Automatic,
                  receivedById: team.actorId,
                  state: ApprovalState.Approved,
                  type: TransactionType.Subvention,
                  ...scope,
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

        const data = { parentId: parent.id, teamId: team.id, ...scope };
        const childAccount = await prisma.bankAccount.create({ data });
        accounts.push(childAccount);
      }),
  );

  return teams.map((team) => [team, accounts.find(({ teamId }) => teamId === team.id)] as const);
}
