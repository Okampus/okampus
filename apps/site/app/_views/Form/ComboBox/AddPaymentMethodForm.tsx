import { insertPaymentMethodSchema } from '../../../../schemas/TeamPaymentMethod/insertPaymentMethodSchema';

import Section from '../../../_components/atoms/Container/Section';
import FormWithAction from '../../../_components/molecules/Form/FormWithAction';
import SelectorInput from '../../../_components/molecules/Input/Controlled/Select/SelectorInput';
import TextInput from '../../../_components/molecules/Input/Uncontrolled/String/TextInput';

import insertPaymentMethod from '../../../../server/actions/TeamPaymentMethod/insertPaymentMethod';

import { TeamPaymentMethodType } from '@prisma/client';
import type { RenderAddOptionWithContextProps } from '../../../_components/molecules/Input/Controlled/ComboBox/ComboBoxInput';

export default function AddPaymentMethodForm(props: RenderAddOptionWithContextProps<bigint, { teamId: bigint }>) {
  return (
    <FormWithAction
      action={insertPaymentMethod}
      defaultValues={{ teamId: props.context.teamId }}
      zodSchema={insertPaymentMethodSchema}
      render={(state, methods) => {
        return (
          <Section title="Ajouter une méthode de paiement" border={false} paddingMode="none">
            <TextInput label="Nom" name="name" />
            <SelectorInput
              label="Type"
              name="type"
              control={methods.control}
              options={[
                { label: 'Carte', value: TeamPaymentMethodType.Card },
                { label: 'Application de paiement', value: TeamPaymentMethodType.Mobile },
                { label: 'Autre', value: TeamPaymentMethodType.Other },
              ]}
            />
          </Section>
        );
      }}
    />
  );
}
