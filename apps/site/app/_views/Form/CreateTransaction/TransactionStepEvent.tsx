'use client';

import Choice from '../../../_components/molecules/Choice';
import IHelpText from '../../../_components/atoms/Inline/IHelpText';

import { COLORS } from '@okampus/shared/consts';

import { useFormContext } from 'react-hook-form';
import { SkipForward, Wallet } from '@phosphor-icons/react';

import type { TeamWithMoneyAccounts } from '../../../../types/prisma/Team/team-with-money-accounts';
import type { FormStepContext } from '../../../_components/templates/MultiStepFormView';

export default function TransactionStepEvent({ context, goToNextStep }: FormStepContext<TeamWithMoneyAccounts>) {
  const { setValue } = useFormContext();
  return (
    <div>
      {context.projects.flatMap((project) =>
        project.eventOrganizes.map((eventOrganize) => (
          <Choice
            key={eventOrganize.event.id}
            action={() => {
              setValue('event', eventOrganize.event.id);
              setValue('eventMissing', false);
              goToNextStep();
            }}
            prefix={<div className="rounded-[50%] w-5 h-5" style={{ backgroundColor: COLORS[project.color] }} />}
          >
            {eventOrganize.event.name}
          </Choice>
        )),
      )}
      <Choice
        action={() => {
          setValue('event', null);
          setValue('eventMissing', false);
          goToNextStep();
        }}
        prefix={<Wallet />}
      >
        Dépense générale (pas d&apos;événement particulier lié)
      </Choice>
      <Choice
        action={() => {
          setValue('event', null);
          setValue('eventMissing', true);
          goToNextStep();
        }}
        prefix={<SkipForward />}
      >
        Événément à ajouter plus tard
      </Choice>
      <IHelpText text="Si l'événement correspondant à cet transaction n'a pas encore été créé, sélectionnez Événément à ajouter plus tard. Vous recevrez une notification pour ajouter l'événement manquant depuis l'écran de détails de la transaction." />
    </div>
  );
}
