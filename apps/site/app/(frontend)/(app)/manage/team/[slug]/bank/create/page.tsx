'use client';

import BankForm from '../../../../../../../../components/forms/BankForm';
import MultiStepPageLayout from '../../../../../../../../components/atoms/Layout/MultiStepPageLayout';
import AvatarImage from '../../../../../../../../components/atoms/Image/AvatarImage';
import BankPreview from '../../../../../../../../components/atoms/Preview/BankPreview';

import TextInput from '../../../../../../../../components/molecules/Input/TextInput';
import ActionButton from '../../../../../../../../components/molecules/Button/ActionButton';

import { useMe, useTeamManage, useTenant } from '../../../../../../../../context/navigation';
import { useTranslation } from '../../../../../../../../hooks/context/useTranslation';

import { useInsertAccountMutation, useInsertBankMutation } from '@okampus/shared/graphql';
import { FinanceCategory, PaymentMethod } from '@okampus/shared/enums';
import { ActionType } from '@okampus/shared/types';

import { useRouter } from 'next/navigation';

import type { MultiStepPageStep } from '../../../../../../../../components/atoms/Layout/MultiStepPageLayout';
import type { LegalUnitLocationMinimalInfo } from '../../../../../../../../types/features/legal-unit-location.info';

export default function TeamManageBankCreatePage({ params }: { params: { slug: string } }) {
  const { teamManage } = useTeamManage(params.slug);
  const { format } = useTranslation();
  const router = useRouter();

  const me = useMe();
  const { tenant } = useTenant();

  const [insertBank] = useInsertBankMutation();
  const [insertAccount] = useInsertAccountMutation();

  if (!teamManage || !tenant) return null;

  const initialData = {
    bankLocation: null as null | LegalUnitLocationMinimalInfo,
    bicSwift: '',
    iban: '',
    holderName: '',
    balance: '',
    accountAllocates: teamManage.teams.map((team) => ({ actorId: team.actor.id, teamId: team.id, balance: '' })),
  };

  const onSubmit = (values: typeof initialData) => {
    if (!teamManage.actor || !values.bankLocation) return;

    const balance = Number.parseFloat(values.balance.replace(',', '.'));
    const accountAllocates = values.accountAllocates.map((accountAllocate) => ({
      ...accountAllocate,
      balance: Number.parseFloat(accountAllocate.balance.replace(',', '.')),
    }));

    const remaining = balance - accountAllocates.reduce((acc, accountAllocate) => acc + accountAllocate.balance, 0);

    const bank = {
      actorId: teamManage.actor.id,
      bankId: values.bankLocation.id,
      bicSwift: values.bicSwift,
      iban: values.iban,
      holderName: values.holderName,
    };
    insertBank({
      variables: { object: bank },
      onCompleted: ({ insertBankOne }) => {
        if (!insertBankOne) return;

        insertAccount({
          variables: {
            object: {
              bankId: insertBankOne.id,
              name: 'Compte principal',
              teamId: teamManage.id,
              finances: {
                data: [
                  {
                    tenantId: tenant.id,
                    createdById: me.user.individual.id,
                    amount: remaining,
                    method: PaymentMethod.Transfer,
                    category: FinanceCategory.Subvention,
                    payedById: tenant.adminTeam?.actor.id,
                    receivedById: teamManage.actor.id,
                    payedAt: new Date().toISOString(),
                    teamId: teamManage.id,
                  },
                ],
              },
              children: {
                data: accountAllocates.map((accountAllocate) => ({
                  tenantId: tenant.id,
                  createdById: me.user.individual.id,
                  teamId: accountAllocate.teamId,
                  name: 'Compte principal',
                  finances: {
                    data: [
                      {
                        tenantId: tenant.id,
                        createdById: me.user.individual.id,
                        amount: accountAllocate.balance,
                        method: PaymentMethod.Transfer,
                        category: FinanceCategory.Subvention,
                        payedById: tenant.adminTeam?.actor.id,
                        receivedById: accountAllocate.actorId,
                        payedAt: new Date().toISOString(),
                        teamId: accountAllocate.teamId,
                      },
                    ],
                  },
                })),
              },
            },
          },
          onCompleted: () => router.push(`/manage/team/${teamManage.actor?.slug}/bank`),
        });
      },
    });
  };

  const teamsString =
    teamManage.teams.length > 0
      ? ` (incluant les soldes de ${teamManage.teams.map((team) => team.actor?.name).join(', ')})`
      : '';

  const steps: MultiStepPageStep<typeof initialData>[] = [
    {
      title: 'RIB',
      subtitle: 'Pour identifier votre compte et recevoir vos subventions et remboursements',
      render: ({ values, goToNextStep, setValues }) => {
        if (!teamManage.actor) return null;
        return (
          <BankForm
            actor={teamManage.actor}
            onSubmit={async ({ bankLocation, bicSwift, holderName, iban }) => {
              setValues({ ...values, bankLocation, bicSwift, holderName, iban });
              goToNextStep();
            }}
          />
        );
      },
    },
    {
      title: 'Solde',
      subtitle: `Indiquez votre solde total actuel${teamsString}`,
      render: ({ values, onSubmit, setValues }) => {
        const balance = Number.parseFloat(values.balance.replace(',', '.'));
        const allocates = values.accountAllocates.map((accountAllocate) => ({
          ...accountAllocate,
          balance: Number.parseFloat(accountAllocate.balance.replace(',', '.')),
        }));

        const remaining =
          balance - allocates.reduce((total, { balance }) => total + (Number.isNaN(balance) ? 0 : balance), 0);

        return (
          <div className="grid grid-cols-1 lg:grid-cols-[36rem_1fr] gap-10">
            <BankPreview
              bankLocation={values.bankLocation}
              bicSwift={values.bicSwift}
              iban={values.iban}
              holderName={values.holderName}
            />
            <div className="flex flex-col gap-6 lg:max-w-[30rem]">
              <div className="page-subtitle">Quel est le solde total de votre compte{teamsString} ?</div>
              <TextInput
                name="balance"
                value={values.balance}
                textAlign="right"
                onChange={(event) => setValues({ ...values, balance: event.target.value })}
                placeholder="Solde total (XXXX,XX)"
                endContent={<div className="ml-2">€</div>}
              />
              {teamManage.teams.length > 0 && (
                <>
                  <div className="page-subtitle">Quel est le solde alloué à vos clubs ?</div>
                  {teamManage.teams.map((team) => (
                    <div key={team.id} className="flex items-center gap-4">
                      <AvatarImage actor={team.actor} type="team" />
                      <TextInput
                        name={`balance-${team.actor.slug}`}
                        endContent={<div className="ml-2">€</div>}
                        placeholder={`Solde de ${team.actor?.name} (XXXX,XX)`}
                        textAlign="right"
                        onChange={(event) =>
                          setValues({
                            ...values,
                            accountAllocates: values.accountAllocates.map((accountAllocate) => {
                              if (accountAllocate.teamId === team.id)
                                return { ...accountAllocate, balance: event.target.value };
                              return accountAllocate;
                            }),
                          })
                        }
                      />
                    </div>
                  ))}
                  {!Number.isNaN(balance) && (
                    <>
                      <hr className="border border-color-2" />
                      <div className="flex items-center gap-4">
                        <AvatarImage actor={teamManage.actor} type="team" />
                        <div className="grow font-semibold flex justify-between gap-4 items-center">
                          <span>Solde restant</span>
                          {format('euro', remaining)}
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
              {!Number.isNaN(balance) &&
                allocates.every((accountAllocate) => !Number.isNaN(accountAllocate.balance)) && (
                  <ActionButton
                    action={{
                      type: ActionType.Success,
                      label: 'Valider',
                      linkOrActionOrMenu: () => onSubmit(values),
                    }}
                  />
                )}
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <MultiStepPageLayout
      header="Créer votre compte bancaire"
      initialData={initialData}
      steps={steps}
      onSubmit={onSubmit}
    />
  );
}
