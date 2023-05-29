// import { ControlType } from '@okampus/shared/enums';
import {
  // insertProject,
  projectDetailsInfo,
  useTypedQuery,
} from '@okampus/shared/graphql';
// import { ActionType } from '@okampus/shared/types';
// import { toSlug } from '@okampus/shared/utils';

import {
  // NavigationContext,
  useTeamManage,
} from '@okampus/ui/hooks';
import {
  // ActionButton,
  ProjectCard,
} from '@okampus/ui/molecules';
// import { FormSchemaRender, MultiStepForm, getDefaultFormData } from '@okampus/ui/organisms';

// import { useMutation } from '@apollo/client';
// import { useContext } from 'react';

import type { TeamManageInfo } from '@okampus/shared/graphql';
// import type { Submission } from '@okampus/shared/types';

export function TeamProjectManageView() {
  const { teamManage } = useTeamManage();
  if (!teamManage) return null;
  return <TeamProjectManageViewWrapper team={teamManage} />;
}

function TeamProjectManageViewWrapper({ team }: { team: TeamManageInfo }) {
  // const {
  //   // showOverlay,
  //   hideOverlay,
  // } = useContext(NavigationContext);

  // const [createProject] = useMutation(insertProject, { onCompleted: hideOverlay });

  const { data } = useTypedQuery({ project: [{ where: { team: { id: { _eq: team.id } } } }, projectDetailsInfo] });
  const projects = data?.project;

  // const fields = [
  //   {
  //     name: 'name',
  //     type: ControlType.Text,
  //     label: 'Nom du projet',
  //     placeholder: 'Nom du projet',
  //   },
  //   {
  //     name: 'description',
  //     type: ControlType.Markdown,
  //     label: 'Description',
  //     placeholder: 'Description du projet',
  //   },
  //   {
  //     name: 'isPrivate',
  //     type: ControlType.MultiCheckbox,
  //     label: 'Projet privé?',
  //     placeholder: 'Projet privé?',
  //   },
  //   {
  //     name: 'expectedBudget',
  //     type: ControlType.Number,
  //     label: 'Budget estimé',
  //     placeholder: 'Budget estimé',
  //   },
  // ] as const;

  return (
    <div className="flex flex-col gap-6 px-content py-content">
      {projects ? (
        projects.length > 0 ? (
          <>
            <div className="flex items-start justify-between">
              <div className="title">Projets en cours</div>
              {/* <ActionButton
                action={{
                  type: ActionType.Primary,
                  label: 'Créer un projet',
                  linkOrActionOrMenu: () =>
                    showOverlay(
                      <MultiStepForm
                        defaultValues={getDefaultFormData(fields)}
                        onClose={hideOverlay}
                        title="Créer un projet"
                        steps={[
                          {
                            label: 'Informations',
                            render: ({ values, setValues }) => (
                              <FormSchemaRender
                                schema={fields}
                                data={values as Submission<typeof fields>}
                                onChange={setValues}
                              />
                            ),
                          },
                        ]}
                        onSubmit={(values) => {
                          const data = values as Submission<typeof fields>;
                          createProject({
                            variables: {
                              insert: {
                                ...data,
                                slug: toSlug(data.name),
                                teamId: team.id,
                                tenantId: team.tenantId,
                              },
                            },
                          });
                        }}
                      />
                    ),
                }}
              /> */}
            </div>
            <div className="flex flex-col gap-4">
              {projects.map((project) => (
                <ProjectCard key={project.id as string} project={{ ...project, team }} />
              ))}
            </div>
          </>
        ) : (
          <div>Aucun projet pour le moment.</div>
        )
      ) : null}
    </div>
  );
}
