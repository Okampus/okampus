import { getTeamsData } from './data/teams.data';
import { ActorImage, BankAccount, BankInfo, LegalUnit, Social, Team, TeamHistory, Transaction } from '@okampus/api/dal';
import {
  ActorImageType,
  ApproximateDate,
  BankAccountType,
  BucketNames,
  EntityName,
  InitiatedByType,
  PaymentMethod,
  TeamHistoryEventType,
  TransactionCategory,
  TransactionState,
} from '@okampus/shared/enums';
import type { GeocodeService, UploadsService } from '@okampus/api/bll';
import type { Tag, Tenant } from '@okampus/api/dal';

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
  const teams = await Promise.all(
    teamsData.map(async (teamData) => {
      const team = new Team({
        ...teamData,
        managersCategoryName: 'Bureau étendu',
        directorsCategoryName: 'Bureau restreint',
        membersCategoryName: 'Membres',
        parent: null,
        createdBy: null,
        tenantScope: context.tenant,
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

        const creation = new TeamHistory({
          team,
          eventType,
          approximateDate,
          eventDate,
          createdBy: null,
          tenantScope: context.tenant,
        });

        team.history.add(creation);
      }

      const eventType = TeamHistoryEventType.OkampusStart;
      const approximateDate = ApproximateDate.Exact;

      const teamHistory = {
        team,
        eventType,
        approximateDate,
        eventDate: new Date(),
        createdBy: null,
        tenantScope: context.tenant,
      };
      team.history.add(new TeamHistory(teamHistory));

      team.actor.socials.add(
        teamData.socials.map((social, order) => {
          const teamSocial = new Social({
            actor: team.actor,
            order,
            ...social,
            createdBy: null,
            tenantScope: context.tenant,
          });
          return teamSocial;
        }),
      );

      // const category = PoleCategory.Administration;
      // const pole = new Pole({ name: 'Bureau', description, team: team, required: true, category, ...scopedOptions });
      // team.poles.add(pole);

      if (teamData.bankInfo) {
        const bankCode = Number.parseInt(teamData.bankInfo.iban.slice(4, 9));
        const bank = context.banks.find((bank) => bank.bankCode === bankCode);
        if (!bank) throw new Error(`Bank with code ${bankCode} not found`);

        const branchAddress = await geocodeService.getGeoapifyAddress(teamData.bankInfo.branchAddressGeoapifyId);
        if (!branchAddress) throw new Error(`Address with id ${teamData.bankInfo.branchAddressGeoapifyId} not found`);

        const bankInfo = new BankInfo({
          bank,
          branchAddress,
          actor: team.actor,
          bicSwift: teamData.bankInfo.bicSwift,
          iban: teamData.bankInfo.iban,
          createdBy: null,
          tenantScope: context.tenant,
        });

        const bankAccount = new BankAccount({
          type: BankAccountType.Primary,
          bankInfo,
          team,
          createdBy: null,
          tenantScope: context.tenant,
        });

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
            createdBy: null,
            state: TransactionState.Completed,
            tenantScope: context.tenant,
          });

          team.actor.receivedTransactions.add(subvention);
          team.bankAccounts.add(bankAccount);

          await em.persistAndFlush([bankAccount, subvention]);
        }
      }

      await em.persistAndFlush([team]);
      const createdTeam = await em.findOneOrFail(
        Team,
        { slug: team.slug },
        { populate: ['actor', 'actor.actorImages'] },
      );

      if (teamData.avatar) {
        const fileData = { buffer: teamData.avatar, size: teamData.avatar.length, filename: `${teamData.name}.webp` };
        const file = { ...fileData, encoding: '7bit', mimetype: 'image/webp', fieldname: teamData.name };
        const image = await uploadService.createUpload(file, BucketNames.ActorImages, {
          entityName: EntityName.Team,
          entityId: createdTeam.id,
          createdBy: null,
          tenantScope: context.tenant,
        });

        const type = ActorImageType.Avatar;
        const actorImage = new ActorImage({
          actor: createdTeam.actor,
          image,
          type,
          createdBy: null,
          tenantScope: context.tenant,
        });
        createdTeam.actor.avatar = actorImage.image.url;
        createdTeam.actor.actorImages.add(actorImage);
        await em.persistAndFlush([createdTeam, actorImage]);
      }

      return { team, parent: teamData.parent };
    }),
  );

  return teams.map(({ team, parent }) => {
    if (parent) {
      const parentTeam = teams.find(({ team }) => team.slug === parent);
      if (parentTeam) {
        team.parent = parentTeam.team;
        const bankAccount = parentTeam.team.bankAccounts.getItems()[0];

        if (bankAccount) {
          const childBankAccount = new BankAccount({
            type: BankAccountType.Primary,
            parent: bankAccount,
            bankInfo: null,
            team,
            createdBy: null,
            tenantScope: context.tenant,
          });

          bankAccount.children.add(childBankAccount);
          team.bankAccounts.add(childBankAccount);
        }
      }
    }
    return team;
  });
}
