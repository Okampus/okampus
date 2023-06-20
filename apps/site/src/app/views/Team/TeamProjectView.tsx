import { useTeam } from '@okampus/ui/hooks';
import { projectDetailsInfo, useTypedQuery } from '@okampus/shared/graphql';
import { ProjectCard } from '@okampus/ui/molecules';
import type { TeamBaseInfo } from '@okampus/shared/graphql';

export function TeamProjectView() {
  const { team } = useTeam();

  if (!team) return null;
  return <TeamProjectViewWrapper team={team} />;
}

export function TeamProjectViewWrapper({ team }: { team: TeamBaseInfo }) {
  const { data } = useTypedQuery({
    project: [{ where: { team: { id: { _eq: team.id } } } }, projectDetailsInfo],
  });

  return (
    <div className="px-content py-content">
      {data?.project ? (
        data.project.length > 0 ? (
          <div className="flex flex-col gap-4">
            {data.project.map((project) => (
              <ProjectCard key={project.id as string} project={{ ...project, team }} />
            ))}
          </div>
        ) : (
          <div className="text-0 text-7xl w-full h-full flex justify-center mt-32">Aucun projet pour le moment</div>
        )
      ) : null}
    </div>
  );
  // const start =
  //   typeof project.content_masters_aggregate.aggregate?.min?.start === 'string' &&
  //   project.content_masters_aggregate.aggregate?.min?.start;
  // const end =
  //   typeof project.content_masters_aggregate.aggregate?.max?.end === 'string' &&
  //   project.content_masters_aggregate.aggregate?.max?.end;

  // return (
  //   <div className="w-full relative" style={{ aspectRatio: BANNER_ASPECT_RATIO }}>
  //     <GradientDark>
  //       <Banner
  //         aspectRatio={BANNER_ASPECT_RATIO}
  //         src={project.banner?.url}
  //         name={project.name}
  //         className="absolute inset-0"
  //       />
  //     </GradientDark>
  //     <div className="absolute bottom-4 px-view text-white">
  //       {start && end ? (
  //         <div className="card-label">{formatDateRangeSimple(start, end)}</div>
  //       ) : start ? (
  //         <div>
  //           <div className="card-label text-2xl">{formatDateSimple(start)}</div>
  //         </div>
  //       ) : null}
  //       <div className="title lg-max:!text-5xl line-clamp-1">{project.name}</div>
  //     </div>
  //   </div>
  //   // <ProfileBase
  //   //   switchTabRoute={(tab) => PROJECT_ROUTE(project.slug)}
  //   //   tabs={menus}
  //   //   avatar={avatar}
  //   //   banner={banner}
  //   //   color={color}
  //   //   name={user.actor.name}
  //   //   details={user.actor.bio && <div className="tagline">{user.actor.bio}</div>}
  //   //   buttonList={buttonList}
  //   // />
  //   // <div className="flex flex-col text-0">
  //   //   <div className="flex flex-col gap-6 pt-6">
  //   //     <div className="grid grid-cols-[repeat(auto-fill,minmax(24rem,1fr))] gap-4">{JSON.stringify(project)}</div>
  //   //   </div>
  //   // </div>
  // );
}
