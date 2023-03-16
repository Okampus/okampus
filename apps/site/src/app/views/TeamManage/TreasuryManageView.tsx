import { ControlType, FinanceCategory, PaymentMethod } from '@okampus/shared/enums';
import {
  createFinanceMutation,
  documentUploadFragment,
  financeFragment,
  getFragmentData,
} from '@okampus/shared/graphql';
import { Dashboard, DynamicForm } from '@okampus/ui/organisms';

import { FileGroup } from '@okampus/ui/molecules';
import { NavigationContext, useTeamManage } from '@okampus/ui/hooks';

import { isNotNull } from '@okampus/shared/utils';
import { useMutation } from '@apollo/client';
import { clsx } from 'clsx';
import { useContext } from 'react';

import type { DynamicFieldData } from '@okampus/ui/organisms';
import type { FinanceInfoFragment } from '@okampus/shared/graphql';

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
            files={value.receipts
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
              .filter(isNotNull)}
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

export function TreasuryManageView() {
  const { teamManage } = useTeamManage();
  const { showModal, hideModal } = useContext(NavigationContext);

  const [createFinance] = useMutation(createFinanceMutation, {
    onCompleted: () => {
      hideModal();
    },
  });

  const fields: DynamicFieldData[] = [
    {
      fieldName: 'transaction',
      inputType: ControlType.Text,
      label: 'Nom de la transaction',
      defaultValue: '',
      placeholder: 'Nom de la transaction',
    },
    {
      fieldName: 'paymentDate',
      inputType: ControlType.DatetimeLocal,
      label: 'Début de paiement',
      placeholder: 'Date de paiement',
    },
    {
      fieldName: 'amountDue',
      inputType: ControlType.Number,
      label: 'Montant dû',
      placeholder: 'Montant dû',
    },
    {
      fieldName: 'amountPayed',
      inputType: ControlType.Number,
      label: 'Montant payé',
      placeholder: 'Montant payé',
    },
    {
      fieldName: 'paymentMethod',
      inputType: ControlType.Select,
      label: 'Méthode de paiement',
      options: Object.entries(PaymentMethod).map(([value, label]) => ({ label, value })),
      fullWidth: true,
      placeholder: 'Méthode de paiement',
    },
    {
      fieldName: 'category',
      inputType: ControlType.Select,
      label: 'Catégorie de dépense',
      options: Object.entries(FinanceCategory).map(([value, label]) => ({ label, value })),
      fullWidth: true,
      placeholder: 'Catégorie de dépense',
    },
  ];

  const finances = teamManage?.finances.map((finance) => getFragmentData(financeFragment, finance)) ?? [];

  return (
    <div className="p-view flex flex-col text-2 gap-10 pb-4">
      <div>
        <div className="flex justify-between items-center">
          <pre className="text-4xl font-semibold text-0 tracking-tight pt-2">{teamManage?.currentFinance} €</pre>
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
                  if (teamManage) {
                    createFinance({
                      variables: {
                        finance: {
                          ...data,
                          amountDue: Number.parseInt(data.amountDue, 10),
                          amountPayed: Number.parseInt(data.amountPayed, 10),
                          teamId: teamManage.id,
                        },
                      },
                    });
                  }
                }}
              />
            ),
          })
        }
      >
        Ajouter une transaction
      </button>
      <Dashboard columns={columns} data={finances} />
    </div>
  );
}
