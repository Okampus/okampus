import { TeamProjectCreateForm } from './TeamProjectCreateForm';
// import { BANNER_ASPECT_RATIO } from '@okampus/shared/consts';
import { EventState } from '@okampus/shared/enums';
import { insertEventMutation, projectBaseInfo, useTypedQuery } from '@okampus/shared/graphql';
import { ActionType } from '@okampus/shared/types';
import { toSlug } from '@okampus/shared/utils';

import { BannerImage } from '@okampus/ui/atoms';
import { NavigationContext, useCurrentUser, useTeamManage } from '@okampus/ui/hooks';
import { ActionButton, ChoiceList } from '@okampus/ui/molecules';
import { MultiStepForm } from '@okampus/ui/organisms';

import { useMutation } from '@apollo/client';
import { useContext } from 'react';

const defaultValues = {
  project: { id: '', name: '' },
  name: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
};

export function TeamEventCreateForm() {
  const { tenant, showOverlay } = useContext(NavigationContext);
  const { teamManage } = useTeamManage();
  const { currentUser } = useCurrentUser();
  const [insertEvent] = useMutation(insertEventMutation);

  const { data } = useTypedQuery({ project: [{ where: { team: { id: { _eq: teamManage?.id } } } }, projectBaseInfo] });

  const projects = data?.project;

  return (
    <MultiStepForm
      defaultValues={defaultValues}
      initialStep={{
        header: "Projet de l'événement",
        onEnter: ({ values, setValues }) => {
          setValues({ ...values, project: { id: '', name: '' } });
        },
        content: ({ values, setValues, goToNextStep }) =>
          projects ? (
            <ChoiceList
              items={projects.map((project) => ({
                item: { label: project.name, value: project.id as string },
                prefix: <BannerImage name={project.name} src={project.fileUpload?.url} className="h-14 rounded-lg" />,
              }))}
              onClick={(id) => {
                const project = projects.find((project) => project.id === id);
                if (!project) return;
                setValues({ ...values, project: { id: project.id as string, name: project.name } });
                goToNextStep(0);
              }}
            />
          ) : (
            // <SelectInput
            //   items={projects.map((project) => ({ label: project.name, value: project.id as string }))}
            //   options={{ label: 'Projet', name: 'project' }}
            //   value={values.project?.id}
            //   onChange={(id) => {
            //     const project = projects.find((project) => project.id === id);
            //     if (!project) return;
            //     setValues({ ...values, project: { id: project.id as string, name: project.name } });
            //     goToNextStep(0);
            //   }}
            // />
            'Aucun projet disponible.'
          ),
        footer: () => (
          <div className="flex flex-col items-center gap-3">
            <div className="title-sm opacity-90 tracking-tight">Aucun projet correspondant ?</div>
            <ActionButton
              className="w-full"
              action={{
                type: ActionType.Action,
                label: 'Créer un nouveau projet',
                linkOrActionOrMenu: () => showOverlay(<TeamProjectCreateForm />),
              }}
            />
          </div>
        ),
        nextSteps: [
          {
            header: "Informations de l'événement",
            content: ({ values }) => {
              return (
                <div className="text-1 flex flex-col gap-6">
                  <div className="px-24">
                    Vous avez sélectionné le projet <span className="font-bold">{values.project?.name}</span>
                  </div>
                  {/* <TextInput
                    label="Nom de l'événement"
                    name="name"
                    value={values.name ?? ''}
                    onChange={(e) => setValues({ ...values, name: e.target.value })}
                  />
                  <div className="flex gap-4">
                    <TextInput
                      label="Date de début de l'événement"
                      type="date"
                      name="startDate"
                      value={values.startDate ?? ''}
                      onChange={(e) => setValues({ ...values, startDate: e.target.value })}
                    />
                    <TextInput
                      label="Heure de début"
                      type="time"
                      name="startTime"
                      value={values.startTime ?? ''}
                      onChange={(e) => setValues({ ...values, startTime: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-4">
                    <TextInput
                      label="Date de fin de l'événement"
                      type="date"
                      name="endDate"
                      value={values.endDate ?? ''}
                      onChange={(e) => setValues({ ...values, endDate: e.target.value })}
                    />
                    <TextInput
                      label="Heure de fin"
                      type="time"
                      name="endTime"
                      value={values.endTime ?? ''}
                      onChange={(e) => setValues({ ...values, endTime: e.target.value })}
                    />
                  </div> */}
                </div>
              );
            },
          },
        ],
      }}
      onSubmit={({ project, name, startDate, startTime, endDate, endTime }) => {
        const start = new Date(`${startDate}T${startTime}:00`);
        const end = new Date(`${endDate}T${endTime}:00`);

        insertEvent({
          variables: {
            object: {
              state: EventState.Submitted,
              contentMaster: { data: { name, slug: toSlug(name ?? '') } },
              teamEvents: { data: [{ teamId: teamManage?.id }] },
              addressId: tenant?.campuses[0]?.address?.id,
              projectId: project?.id,
              supervisorId: currentUser?.id,
              start,
              end,
            },
          },
        });
      }}
    />
  );
}
