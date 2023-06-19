import { ProjectEventListView } from './ProjectEventListView';
import { TabsTopbarView } from '@okampus/ui/templates';
import { PROJECT_ROUTE, PROJECT_ROUTES } from '@okampus/shared/consts';
// import { capitalize, formatDateDayOfWeek } from '@okampus/shared/utils';

import { useProject } from '@okampus/ui/hooks';
// import { ActionButton } from '@okampus/ui/molecules';

import type { ProjectDetailsInfo } from '@okampus/shared/graphql';

export function ProjectView() {
  const { project } = useProject();

  if (!project) return null;
  return <ProjectViewWrapper project={project} />;
}

export function ProjectViewWrapper({ project }: { project: ProjectDetailsInfo }) {
  // const start =
  //   typeof project.eventsAggregate.aggregate?.min?.start === 'string' && project.eventsAggregate.aggregate?.min?.start;
  // const end =
  //   typeof project.eventsAggregate.aggregate?.max?.end === 'string' && project.eventsAggregate.aggregate?.max?.end;

  // const events = project.eventsAggregate.nodes;
  // eslint-disable-next-line unicorn/no-array-reduce
  // const missingRoles: [string, EventRoleBaseInfo[]][] = [];
  // for (const event of events) {
  //   for (const role of event.eventRoles) {
  //     const id = role.projectRole.id as string;
  //     const existing = missingRoles.find((r) => r[0] === id);
  //     if (existing) {
  //       existing[1].push(role);
  //     } else {
  //       missingRoles.push([id, [role]]);
  //     }
  //   }
  // }

  // const helpWanted = missingRoles.length > 0;

  const menus = [
    {
      key: PROJECT_ROUTES.OVERVIEW,
      label: "Vue d'ensemble",
      element: () => (
        <div className="flex flex-col gap-4 px-content py-content">
          <div className="flex flex-col gap-4">
            <div className="title text-1">À propos</div>
            <div className="text-2 font-medium leading-7">{project.description}</div>
          </div>
        </div>
      ),
    },
    {
      key: PROJECT_ROUTES.ROLES,
      label: 'Rôles',
      element: () => null,
      // helpWanted ? (
      //   <div className="flex flex-col gap-10">
      //     <div className="title text-1">Nous recherchons des volontaires</div>
      //     <div className="flex flex-col">
      //       {missingRoles.map(([id, roles], i) => (
      //         <div className="flex flex-col gap-8" key={i}>
      //           <div>
      //             <div className="subtitle text-0">
      //               {roles[0].name} <span className="text-blue-400 text-lg">({roles.length} événement)</span>
      //             </div>
      //             <div className="text-2">{roles[0].description}</div>
      //           </div>
      //           <div className="flex flex-col gap-2">
      //             {roles.map((role, i) => (
      //               <div className="flex p-3 items-center gap-6 text-0 bg-1-hover rounded-xl" key={i}>
      //                 {/* <DateCard date={role.event.start as string} small={true} className="flex-0" /> */}
      //                 <div className="flex-1 w-full text-lg font-bold">
      //                   {role.event?.name && capitalize(role.event.name)}
      //                 </div>
      //                 <div className="flex-1 w-full text-lg text-center font-medium">
      //                   {formatDateDayOfWeek(role.event.start as string)}
      //                 </div>
      //                 <div className="flex-1 w-full text-lg text-center font-medium">
      //                   {role.rewardMinimum as number} à {role.rewardMaximum as number} points LXP
      //                 </div>
      //                 <ActionButton
      //                   action={{
      //                     linkOrActionOrMenu: () => console.log(id),
      //                     label: 'Candidater pour le poste',
      //                   }}
      //                 />
      //               </div>
      //             ))}
      //             <hr className="border-color-3 my-8" />
      //           </div>
      //         </div>
      //       ))}
      //     </div>
      //   </div>
      // ) : null,
    },
    {
      key: PROJECT_ROUTES.EVENTS,
      label: 'Événements',
      element: () => ProjectEventListView({ project }),
    },
  ];

  return <TabsTopbarView menus={menus} basePath={PROJECT_ROUTE(project.slug)} />;
}
