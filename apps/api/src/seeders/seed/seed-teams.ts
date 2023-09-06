import { getTeamsData } from './data/teams.data';
import { ActorImage, BankAccount, BankInfo, Social, Team, TeamHistory, Transaction } from '@okampus/api/dal';
import {
  ActorImageType,
  ApproximateDate,
  BucketNames,
  EntityName,
  InitiatedByType,
  PaymentMethod,
  TeamHistoryEventType,
  TransactionCategory,
  TransactionState,
} from '@okampus/shared/enums';

import type { GeocodeService, UploadsService } from '@okampus/api/bll';
import type { Tag, Tenant, LegalUnit } from '@okampus/api/dal';

import type { S3Client } from '@aws-sdk/client-s3';
import type { EntityManager } from '@mikro-orm/core';

type TeamContext = { categories: Tag[]; tenant: Tenant; banks: LegalUnit[] };
export async function seedTeams(
  s3Client: S3Client | null,
  em: EntityManager,
  geocodeService: GeocodeService,
  uploadService: UploadsService,
  context: TeamContext,
): Promise<Team[]> {
  const teamsData = await getTeamsData(s3Client, context);
  const tenantOptions = { createdBy: null, tenantScope: context.tenant };

  const teams = await Promise.all(
    teamsData.map(async (teamData) => {
      const team = new Team({
        ...teamData,
        managersCategoryName: 'Bureau étendu',
        directorsCategoryName: 'Bureau restreint',
        membersCategoryName: 'Membres',
        parent: null,
        ...tenantOptions,
      });

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

        const creation = new TeamHistory({ team, eventType, approximateDate, eventDate, ...tenantOptions });
        team.history.add(creation);
      }

      const eventType = TeamHistoryEventType.OkampusStart;
      const approximateDate = ApproximateDate.Exact;

      const teamHistory = { team, eventType, approximateDate, eventDate: new Date(), ...tenantOptions };
      team.history.add(new TeamHistory(teamHistory));

      const socials = teamData.socials.map(
        (social, order) => new Social({ order, actor: team.actor, ...social, ...tenantOptions }),
      );
      team.actor.socials.add(socials);

      if (teamData.bankInfo) {
        const { branchAddressGeoapifyId, ...bankInfoData } = teamData.bankInfo;

        const bankCode = Number.parseInt(teamData.bankInfo.iban.slice(4, 9));
        const bank = context.banks.find((bank) => bank.bankCode === bankCode);
        if (!bank) throw new Error(`Bank with code ${bankCode} not found`);

        const branchAddress = await geocodeService.getGeoapifyAddress(branchAddressGeoapifyId);
        if (!branchAddress) throw new Error(`Address with id ${branchAddressGeoapifyId} not found`);

        const bankInfo = new BankInfo({ bank, branchAddress, actor: team.actor, ...bankInfoData, ...tenantOptions });
        const bankAccount = new BankAccount({ bankInfo, team, ...tenantOptions });

        if (teamData.initialSubvention) {
          const subvention = new Transaction({
            bankAccount,
            amount: teamData.initialSubvention,
            payedAt: new Date(),
            method: PaymentMethod.Transfer,
            category: TransactionCategory.Subvention,
            payedBy: context.tenant.actor,
            initiatedByType: InitiatedByType.Automatic,
            initiatedBy: null,
            receivedBy: team.actor,
            state: TransactionState.Completed,
            ...tenantOptions,
          });

          team.actor.receivedTransactions.add(subvention);
          team.bankAccounts.add(bankAccount);

          em.persist([bankAccount, subvention]);
        }
      }

      em.persist(team);

      return { team, parent: teamData.parent, avatar: teamData.avatar };
    }),
  );

  console.log('crashes before');
  await em.flush();
  console.log('crashes after');

  for (const { team, avatar } of teams) {
    const slug = team.slug;
    if (avatar) {
      const createdTeam = await em.findOneOrFail(Team, { slug }, { populate: ['actor', 'actor.actorImages'] });
      const fileData = { buffer: avatar, size: avatar.length, filename: `${slug}.webp` };
      const file = { ...fileData, encoding: '7bit', mimetype: 'image/webp', fieldname: slug };
      const image = await uploadService.createUpload(file, BucketNames.ActorImages, {
        entityName: EntityName.Team,
        entityId: team.id,
        ...tenantOptions,
      });

      const actorImage = new ActorImage({ actor: team.actor, image, type: ActorImageType.Avatar, ...tenantOptions });
      createdTeam.actor.actorImages.add(actorImage);
      createdTeam.actor.avatar = actorImage.image.url;

      em.persist(actorImage);
    }
  }

  const teamWithParents = teams.map(({ team, parent }) => {
    if (parent) {
      const parentTeam = teams.find(({ team }) => team.slug === parent);
      if (parentTeam) {
        team.parent = parentTeam.team;
        const bankAccount = parentTeam.team.bankAccounts.getItems().at(0);

        if (bankAccount) {
          const childBankAccount = new BankAccount({ parent: bankAccount, bankInfo: null, team, ...tenantOptions });
          bankAccount.children.add(childBankAccount);
          team.bankAccounts.add(childBankAccount);
        }
      }
    }
    return team;
  });

  console.log('crashes before');

  await em.flush();
  console.log('crashes after');
  return teamWithParents;
}
