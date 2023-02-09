import { FinanceCategory, PaymentMethod } from '@okampus/shared/enums';
import {
  createFinanceMutation,
  documentUploadFragment,
  financeFragment,
  getFragmentData,
} from '@okampus/shared/graphql';
import { Dashboard, DynamicForm } from '@okampus/ui/organisms';

import { FileGroup } from '@okampus/ui/molecules';
import { NavigationContext, useCurrentContext } from '@okampus/ui/hooks';

import { useMutation } from '@apollo/client';
import { clsx } from 'clsx';
import { useContext } from 'react';

import type { FileLike } from '@okampus/shared/types';
import type { DynamicFieldData } from '@okampus/ui/organisms';
import type { FinanceInfoFragment } from '@okampus/shared/graphql';
import type { CreateFinanceDto } from '@okampus/shared/dtos';

const columns = [
  {
    label: 'Transaction',
    render: (value: FinanceInfoFragment) => <div className="text-0">{value.transaction}</div>,
  },
  {
    label: 'Méthode',
    render: (value: FinanceInfoFragment) => <div className="text-0">{value.paymentMethod}</div>,
  },
  {
    label: 'Catégorie',
    render: (value: FinanceInfoFragment) => <div className="text-0">{value.category}</div>,
  },
  {
    label: 'Date',
    render: (value: FinanceInfoFragment) => <div className="text-0">{value.paymentDate}</div>,
  },
  {
    label: 'Justificatif',
    render: (value: FinanceInfoFragment) => (
      <div
        className={clsx(
          'rounded-lg px-2 py-1 text-sm flex justify-center',
          value.receipts.length === 0 ? 'bg-gray-200 text-gray-800' : 'bg-green-300 text-green-700'
        )}
      >
        {value.receipts.length === 0 ? (
          'Manquant'
        ) : (
          <FileGroup
            files={
              value.receipts
                .map((document) => {
                  if (!document || document.__typename !== 'DocumentUploadModel') return null;
                  const file = getFragmentData(documentUploadFragment, document);
                  return {
                    name: file.name,
                    size: file.size,
                    type: file.mime,
                    src: file.url,
                  };
                })
                .filter(Boolean) as FileLike[]
            }
          />
        )}
      </div>
    ),
  },
  {
    classes: 'text-right',
    label: 'Montant',
    render: (value: FinanceInfoFragment) => (
      <div className={clsx(value.amountPayed > 0 ? 'dark:text-green-300 text-green-500' : 'text-0')}>
        {value.amountPayed > 0 ? `+${value.amountPayed}` : value.amountPayed} EUR
      </div>
    ),
  },
];

export function FinanceManageView() {
  const { showModal, hideModal } = useContext(NavigationContext);
  const [{ org }, update] = useCurrentContext();

  // const { data } = useQuery(getFinancesQuery, {
  //   variables: {
  //     teamId: org?.id ?? '',
  //   },
  // });

  const [createFinance] = useMutation(createFinanceMutation, {
    onCompleted: () => {
      hideModal();
      update();
      // refetch();
      // addNotification({
      //   id: nanoid(21),
      //   message: 'La transaction a été ajoutée',
      //   type: 'success',
      // });
    },
  });

  const fields: DynamicFieldData[] = [
    {
      fieldName: 'transaction',
      inputType: 'text',
      label: 'Nom de la transaction',
      defaultValue: '',
      placeholder: 'Nom de la transaction',
    },
    {
      fieldName: 'paymentDate',
      inputType: 'datetime-local',
      label: 'Début de paiement',
      placeholder: 'Date de paiement',
    },
    {
      fieldName: 'amountDue',
      inputType: 'number',
      label: 'Montant dû',
      placeholder: 'Montant dû',
    },
    {
      fieldName: 'amountPayed',
      inputType: 'number',
      label: 'Montant payé',
      placeholder: 'Montant payé',
    },
    {
      fieldName: 'paymentMethod',
      inputType: 'select',
      label: 'Méthode de paiement',
      options: Object.keys(PaymentMethod).map((key) => ({
        element: PaymentMethod[key as keyof typeof PaymentMethod],
        value: key,
      })),
      fullWidth: true,
      placeholder: 'Méthode de paiement',
    },
    {
      fieldName: 'category',
      inputType: 'select',
      label: 'Catégorie de dépense',
      options: Object.keys(FinanceCategory).map((key) => ({
        element: FinanceCategory[key as keyof typeof FinanceCategory],
        value: key,
      })),
      fullWidth: true,
      placeholder: 'Catégorie de dépense',
    },
  ];

  const finances = org?.finances.map((finance) => getFragmentData(financeFragment, finance)) ?? [];
  // if (data) finances = data.financesByTeam.edges?.map?.((edge) => getFragmentData(financeFragment, edge.node)) ?? [];

  return (
    <div className="flex flex-col text-2 gap-10 h-full pb-4">
      <div>
        <div className="flex justify-between items-center">
          <pre className="text-4xl font-semibold text-0 tracking-tight pt-2">{org?.currentFinance} €</pre>
          <div className="flex gap-2 font-medium">
            <button className="py-2.5   px-3.5 hover:cursor-pointer rounded-lg bg-0 text-0 font-medium border border-color-2">
              Détails du compte
            </button>
            <button className="py-2.5  px-3.5 hover:cursor-pointer rounded-lg bg-opposite text-opposite font-medium">
              Export
            </button>
          </div>
        </div>
        <div>Total restant</div>
      </div>
      <button
        className="button bg-opposite text-opposite"
        onClick={() =>
          showModal({
            title: "Ajout d'une transaction",
            content: (
              <DynamicForm
                fields={fields}
                onSubmit={(data) => {
                  if (org && org.id) {
                    createFinance({
                      variables: {
                        finance: {
                          ...(data as CreateFinanceDto),
                          amountDue: Number.parseInt((data as { amountDue: string }).amountDue as string, 10),
                          amountPayed: Number.parseInt((data as { amountPayed: string }).amountPayed as string, 10),
                          teamId: org.id,
                        },
                      },
                    });
                  }
                }}
              />
              // <motion.div layoutId={currentId}>
              //   <div>{currentId}</div>
              //   {/* <CreateEventForm
              //     onSubmit={() => {
              //       // setNewEvents([...newEvents, { ...(event as ITenantEvent), key: currentId }]);
              //       hideModal();
              //       // refetch();
              //       addNotification({
              //         id: nanoid(21),
              //         type: 'success',
              //         message:
              //           "Événement soumis ! L'équipe de gestion de la vie associative validera l'évènement sous peu.",
              //         timeout: 6000,
              //       });
              //     }}
              //   /> */}
              // </motion.div>
            ),
          })
        }
      >
        Ajouter une transaction
      </button>
      {/* {JSON.stringify(finances)} */}
      <Dashboard columns={columns} data={finances} />
    </div>
  );
}
