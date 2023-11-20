import BankForm from '../BankForm';
import AvatarImage from '../../../_components/atoms/Image/AvatarImage';
import MultiStepPageLayout from '../../../_components/atoms/Layout/MultiStepPageLayout';
import IBANContainer from '../../IBANContainer';
import Button from '../../../_components/molecules/Button/Button';
import TextInput from '../../../_components/molecules/Input/Uncontrolled/String/TextInput';

// import { useTenant } from '../../../_components/../_context/navigation';
import { useTranslation } from '../../../_components/../_hooks/context/useTranslation';

import IMoney from '../../../_components/atoms/Inline/IMoney';
import { ActionType } from '@okampus/shared/enums';
import type { BankMinimal } from '../../../../types/prisma/Bank/bank-minimal';
import type { AddressMinimal } from '../../../../types/prisma/Address/address-minimal';
// import { useInsertBankAccountInfoMutation, useInsertBankAccountMutation } from '@okampus/shared/graphql';
// import { PaymentMethod, TransactionType } from '@prisma/client';
import type { MultiStepPageStep } from '../../../_components/atoms/Layout/MultiStepPageLayout';
import type { TeamDetails } from '../../../../types/prisma/Team/team-details';

export type OnboardBankFormProps = {
  teamManage: TeamDetails;
  onCompleted?: () => void;
};
export default function OnboardBankForm({ teamManage, onCompleted }: OnboardBankFormProps) {
  const { format } = useTranslation();
  // const { data: tenant } = useTenant();

  // const [insertBankAccountInfo] = useInsertBankAccountInfoMutation();
  // const [insertBankAccount] = useInsertBankAccountMutation();

  if (
    !teamManage
    // || !tenant
  )
    return null;

  const initialData = {
    bank: null as BankMinimal | null,
    branchAddress: null as AddressMinimal | null,
    bicSwift: '',
    iban: '',
    ownerName: '',
    balance: '',
    moneyAccountAllocates: teamManage.children.map((team) => ({
      actorId: team.actor.id,
      teamId: team.id,
      balance: '',
    })),
  };

  const onSubmit = (values: typeof initialData) => {
    if (!teamManage.actor || !values.branchAddress) return;

    const balance = Number.parseFloat(values.balance.replace(',', '.'));
    const moneyAccountAllocates = values.moneyAccountAllocates.map((moneyAccountAllocate) => ({
      ...moneyAccountAllocate,
      balance: Number.parseFloat(moneyAccountAllocate.balance.replace(',', '.')),
    }));

    const remaining =
      balance - moneyAccountAllocates.reduce((acc, moneyAccountAllocate) => acc + moneyAccountAllocate.balance, 0);

    const bankAccountInfo = {
      actorId: teamManage.actor.id,
      branchAddress: { data: values.branchAddress },
      bankId: values.bank?.goCardLessInstitutionId,
      bicSwift: values.bicSwift,
      iban: values.iban,
      ownerName: values.ownerName,
    };
    // TODO: mutate
    // insertBankAccountInfo({
    //   variables: { object: bankAccountInfo },
    //   onCompleted: ({ insertBankAccountInfoOne }) => {
    //     if (!insertBankAccountInfoOne) return;

    //     insertBankAccount({
    //       variables: {
    //         object: {
    //           bankAccountInfoId: insertBankAccountInfoOne.id,
    //           name: 'Compte principal',
    //           teamId: teamManage.id,
    //           transactions: {
    //             data: [
    //               {
    //                 amount: remaining,
    //                 method: PaymentMethod.Transfer,
    //                 type: TransactionType.Subvention,
    //                 // payedById: tenant.actor.id,
    //                 receivedById: teamManage.actor.id,
    //                 payedAt: new Date().toISOString(),
    //               },
    //             ],
    //           },
    //           children: {
    //             data: moneyAccountAllocates.map((moneyAccountAllocate) => ({
    //               teamId: moneyAccountAllocate.teamId,
    //               name: 'Compte principal',
    //               transactions: {
    //                 data: [
    //                   {
    //                     amount: moneyAccountAllocate.balance,
    //                     method: PaymentMethod.Transfer,
    //                     category: TransactionType.Subvention,
    //                     // payedById: tenant.actor.id,
    //                     receivedById: moneyAccountAllocate.actorId,
    //                     payedAt: new Date().toISOString(),
    //                     teamId: moneyAccountAllocate.teamId,
    //                   },
    //                 ],
    //               },
    //             })),
    //           },
    //         },
    //       },
    //       onCompleted,
    //     });
    //   },
    // });
  };

  const teamsString =
    teamManage.children.length > 0
      ? ` (incluant les soldes de ${teamManage.children.map((team) => team.actor?.name).join(', ')})`
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
            onSubmit={async ({ bicSwift, ownerName, iban }) => {
              setValues({ ...values, bicSwift, ownerName, iban });
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
        const allocates = values.moneyAccountAllocates.map((moneyAccountAllocate) => ({
          ...moneyAccountAllocate,
          balance: Number.parseFloat(moneyAccountAllocate.balance.replace(',', '.')),
        }));

        const remaining =
          balance - allocates.reduce((total, { balance }) => total + (Number.isNaN(balance) ? 0 : balance), 0);

        return (
          <div className="grid grid-cols-1 lg:grid-cols-[36rem_1fr] gap-10">
            <IBANContainer
              branchAddress={values.branchAddress}
              bicSwift={values.bicSwift}
              iban={values.iban}
              ownerName={values.ownerName}
            />
            <div className="flex flex-col gap-6 lg:max-w-[30rem]">
              <div className="font-semibold text-3xl text-[var(--text-1)] ">
                Quel est le solde total de votre compte{teamsString} ?
              </div>
              <TextInput
                name="balance"
                defaultValue={values.balance}
                textAlign="right"
                placeholder="Solde total (XXXX,XX)"
                end={<div className="ml-2">€</div>}
              />
              {teamManage.children.length > 0 && (
                <>
                  <div className="font-semibold text-3xl text-[var(--text-1)] ">
                    Quel est le solde alloué à vos clubs ?
                  </div>
                  {teamManage.children.map((team) => (
                    <div key={team.id} className="flex items-center gap-4">
                      <AvatarImage actor={team.actor} />
                      <TextInput
                        name={`balance-${team.slug}`}
                        end={<div className="ml-2">€</div>}
                        placeholder={`Solde de ${team.actor?.name} (XXXX,XX)`}
                        textAlign="right"
                        // onChange={(value) =>
                        //   setValues({
                        //     ...values,
                        //     moneyAccountAllocates: values.moneyAccountAllocates.map((moneyAccountAllocate) => {
                        //       if (moneyAccountAllocate.teamId === team.id)
                        //         return { ...moneyAccountAllocate, balance: value };
                        //       return moneyAccountAllocate;
                        //     }),
                        //   })
                        // }
                      />
                    </div>
                  ))}
                  {!Number.isNaN(balance) && (
                    <>
                      <hr className="border border-[var(--border-2)]" />
                      <div className="flex items-center gap-4">
                        <AvatarImage actor={teamManage.actor} />
                        <div className="grow font-semibold flex justify-between gap-4 items-center">
                          <span>Solde restant</span>
                          <IMoney amount={remaining} />
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
              {!Number.isNaN(balance) &&
                allocates.every((moneyAccountAllocate) => !Number.isNaN(moneyAccountAllocate.balance)) && (
                  <Button action={() => onSubmit(values)} type={ActionType.Success}>
                    Valider
                  </Button>
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
