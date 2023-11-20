'use client';

import Form from '../../_components/molecules/Form/Form';
import SelectorInput from '../../_components/molecules/Input/Controlled/Select/SelectorInput';

import { useTranslation } from '../../_hooks/context/useTranslation';
import { ActorType } from '@prisma/client';
import { z } from 'zod';

// TODO: system to automatically retrieve errors in fields.
export type CounterPartyFormProps = {
  onSubmit: ({ actorId, counterPartyName }: { actorId: bigint; counterPartyName: string }) => void;
};

const counterPartyFormSchema = z.object({
  type: z.nativeEnum(ActorType).optional(),
  actorId: z.bigint().optional(),
  counterPartyName: z.string().optional(),
});

export function CounterPartyForm({ onSubmit }: CounterPartyFormProps) {
  const { t } = useTranslation();

  return (
    <Form
      submit={({ data, methods }) => {
        if (!data.actorId) {
          methods.setError('actorId', { type: 'required' });
          return;
        }
        if (!data.counterPartyName) {
          methods.setError('counterPartyName', { type: 'required' });
          return;
        }
        // if (!data.actorId || !data.counterPartyName) {
        //   methods.setError()
        //   return;
        // }

        onSubmit({ actorId: data.actorId, counterPartyName: data.counterPartyName });
      }}
      zodSchema={counterPartyFormSchema}
      render={(state, methods) => {
        const type = methods.watch('type');

        return (
          <div>
            <SelectorInput
              control={methods.control}
              name="type"
              options={Object.values(ActorType).map((type) => ({
                label: t('enums', `ActorType.${type}`),
                value: type,
              }))}
            />
          </div>
        );
      }}
    />
  );
}
