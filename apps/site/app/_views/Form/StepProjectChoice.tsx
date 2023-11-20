'use client';

import Choice from '../../_components/molecules/Choice';

import { COLORS } from '@okampus/shared/consts';
import { useFormContext } from 'react-hook-form';

import { Plus } from '@phosphor-icons/react';
import type { TeamWithProjects } from '../../../types/prisma/Team/team-with-projects';
import type { FormStepContext } from '../../_components/templates/MultiStepFormView';

export default function StepProjectChoice({ context, goToNextStep }: FormStepContext<TeamWithProjects>) {
  const { setValue } = useFormContext();
  return (
    <div className="divide-y divide-[var(--border-0)]">
      {context.projects.map((project) => (
        <Choice
          key={project.id}
          action={() => {
            setValue('project', project.id);
            goToNextStep();
          }}
          prefix={<div className="rounded-[50%] w-5 h-5" style={{ backgroundColor: COLORS[project.color] }} />}
        >
          {project.name}
        </Choice>
      ))}
      <Choice
        action={() => {
          setValue('project', null);
          goToNextStep();
        }}
        prefix={<Plus className="w-5 h-5" />}
      >
        Créer un nouveau projet
      </Choice>
    </div>
  );
}
