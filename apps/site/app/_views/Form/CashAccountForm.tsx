import FormWithAction from '../../_components/molecules/Form/FormWithAction';

import { insertCashAccountSchema } from '../../../schemas/BankAccount/insertCashAccountSchema';

import insertCashAccount from '../../../server/actions/MoneyAccount/insertCashAccount';
import SelectorInput from '../../_components/molecules/Input/Controlled/Select/SelectorInput';
import NumberInput from '../../_components/molecules/Input/Controlled/Number/NumberInput';

export type CashAccountFormProps = { teamId: bigint };
export function CashAccountForm({ teamId }: CashAccountFormProps) {
  return (
    <FormWithAction
      action={insertCashAccount}
      defaultValues={{ teamId, balance: 0, balanceShouldRenewFrequency: 'P1Y' }}
      render={(state, methods) => {
        return (
          <div>
            <NumberInput name="balance" control={methods.control} />
            <SelectorInput
              name="balanceShouldRenewFrequency"
              options={[
                { label: 'Tous les ans', value: 'P1Y' },
                { label: 'Tous les 6 mois', value: 'P1Y' },
                { label: 'Tous les 3 mois', value: 'P1Y' },
              ]}
              control={methods.control}
            />
          </div>
        );
      }}
      zodSchema={insertCashAccountSchema}
    />
  );
}
