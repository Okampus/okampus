import Section from '../../../_components/atoms/Container/Section';
import FormWithAction from '../../../_components/molecules/Form/FormWithAction';
import SelectorInput from '../../../_components/molecules/Input/Controlled/Select/SelectorInput';
import TextInput from '../../../_components/molecules/Input/Uncontrolled/String/TextInput';

import insertTransactionType from '../../../../server/actions/TeamTransactionType/insertTransactionType';
import { insertTransactionTypeSchema } from '../../../../schemas/TeamTransactionType/insertTransactionTypeSchema';

import type { RenderAddOptionWithContextProps } from '../../../_components/molecules/Input/Controlled/ComboBox/ComboBoxInput';

export default function AddTransactionTypeForm(
  props: RenderAddOptionWithContextProps<bigint, { teamId: bigint; isIncome?: boolean }>,
) {
  return (
    <FormWithAction
      action={insertTransactionType}
      defaultValues={{ teamId: props.context.teamId, isIncome: props.context.isIncome }}
      zodSchema={insertTransactionTypeSchema}
      render={(state, methods) => {
        return (
          <Section title="Ajouter une catégorie de transaction" border={false} paddingMode="none">
            <TextInput label="Nom" name="name" />
            <SelectorInput
              label="Type"
              name="isIncome"
              disabled={props.context.isIncome !== undefined}
              control={methods.control}
              options={[
                { label: 'Dépense', value: false },
                { label: 'Revenu', value: true },
              ]}
            />
          </Section>
        );
      }}
    />
  );
}
