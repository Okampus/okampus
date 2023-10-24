import TeamLabeled from '../Labeled/TeamLabeled';
import BannerImage from '../../atoms/Image/BannerImage';
import EventLabeled from '../Labeled/EventLabeled';

import Link from 'next/link';

import type { ProjectDetailsInfo } from '../../../../types/features/project.info';

export type ProjectCardProps = { project: ProjectDetailsInfo };
export default function ProjectCard({ project }: ProjectCardProps) {
  // const start =
  //   typeof project.eventOrganizes?.min?.start === 'string' && project.eventsAggregate.aggregate?.min?.start;
  // const end =
  //   typeof project.eventOrganizes.aggregate?.max?.end === 'string' && project.eventsAggregate.aggregate?.max?.end;

  // const events = project.events;
  // const participantsCount = events.reduce(
  //   (curr, event) => curr + (event?.eventJoinsAggregate.aggregate?.count || 0),
  //   0
  // );
  // const supervisorsCount = project.projectSupervisors.length;

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

  // const missing = missingRoles.slice(0, 2);
  // const remaining = missingRoles.slice(3).reduce((curr, [, roles]) => curr + roles.length, 0);

  // const helpWanted = missingRoles.length > 0;
  // const createdAtDate = new Date(project.createdAt as string).getTime();
  // const isNew = createdAtDate > Date.now() - 1000 * 60 * 60 * 24 * 7;

  // const badges = [
  //   ...(isNew ? [<TextBadge key="new" prefix="🔥" label="Nouveau" />] : []),
  //   ...(helpWanted
  //     ? [
  //         <TextBadge
  //           color="green"
  //           key="help-wanted"
  //           label={`${missingRoles.length} rôle${missingRoles.length > 1 ? 's' : ''} à remplir`}
  //         />,
  //       ]
  //     : []),
  // ];

  return (
    <div className="cursor-pointer text-1 p-4 bg-0">
      <div className="relative pb-6">
        <div className="flex xl-max:flex-col gap-8">
          <BannerImage className="xl:h-[16rem] rounded-xl" src={project.banner?.url} name={project.name} />
          <div className="flex flex-col gap-1">
            <span className="title">
              <span>{project.name}</span>
            </span>
            <div className="relative z-30 mt-2 w-fit flex gap-2 items-center">
              <TeamLabeled team={project.team} /> •
              {/* <div className="font-semibold text-lg">
                {start && end ? (
                  <div>{formatDateRangeSimple(start, end)}</div>
                ) : start ? (
                  <div>{formatDateSimple(start)}</div>
                ) : null}
              </div> */}
            </div>
            <div className="mt-6 line-clamp-3 text-lg">{project.description}</div>
          </div>
        </div>
        <Link href={`/project/${project.slug}`} className="card-link" />
      </div>

      <div className="flex flex-col gap-4">
        {project.eventOrganizes.map(({ event }) => {
          return <EventLabeled key={event.id} event={event} />;
        })}
      </div>
    </div>
  );
  // return (
  //   <motion.div
  //     initial="rest"
  //     whileHover="hover"
  //     className={clsx('relative bg-1 bg-2-hover card-md cursor-pointer', helpWanted && 'border-2 border-red-600')}
  //   >
  //     {helpWanted && (
  //       <div className="absolute bottom-0 right-0 text-xl font-semibold pr-5 pl-6 py-2 bg-red-600 rounded-tl-xl">
  //         Rejoignez-nous !
  //       </div>
  //     )}
  //     <Link to={PROJECT_ROUTE(project.slug)} className="card-link" />
  //     <div className="flex gap-6">
  //       <Banner className="h-56 !w-fit" aspectRatio={1} src={project.banner?.url} name={project.name} rounded={5} />
  //       <div className="flex flex-col justify-between py-1">
  //         <div className="flex flex-col gap-2">
  //           <div className="flex flex-col gap-1">
  //             <div className="text-0 text-2xl font-semibold leading-none">{project.name}</div>
  //             <div className="flex gap-3 text-primary font-medium">
  //               <div>{participantsCount + supervisorsCount} participants</div>
  //               <div className="text-blue-400">{events.length} événements prévus</div>
  //             </div>
  //           </div>
  //           <div>
  //             {helpWanted ? (
  //               <div>
  //                 <div className="label">Nous recherchons</div>
  //                 <div>
  //                   {missing.map(([id, roles]) => (
  //                     <div key={id} className="font-medium flex gap-2 items-center">
  //                       <div className="font-semibold text-lg text-1">{roles[0].name}</div>
  //                       <div className="text-blue-400">x{roles.length} événements</div>
  //                     </div>
  //                   ))}
  //                   {remaining > 0 && (
  //                     <div className="font-medium flex gap-2 items-center">
  //                       <div className="text-2">... et {remaining} autres</div>
  //                     </div>
  //                   )}
  //                 </div>
  //               </div>
  //             ) : (
  //               <div className="text-1 line-clamp-3">{project.description}</div>
  //             )}
  //           </div>
  //         </div>
  //         <div className="flex items-center gap-4">
  //           <div className="flex items-center gap-3">
  //             <Avatar
  //               rounded={AVATAR_TEAM_ROUNDED}
  //               size={12}
  //               name={project.team.actor?.name}
  //             />
  //             <div className="text-0 text-lg font-medium">{project.team.actor?.name}</div>
  //           </div>
  //           <div className="flex gap-2 items-center">
  //             {/* <Tag label="En préparation" backgroundClass="bg-yellow-600" />{' '}
  //             <Tag label="Help wanted" backgroundClass="bg-red-500" /> */}
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </motion.div>
  // );
}
