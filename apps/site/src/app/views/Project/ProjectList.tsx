import { projectWithTeamInfo, useTypedQuery } from '@okampus/shared/graphql';
import { Skeleton } from '@okampus/ui/atoms';
import { ProjectCard } from '@okampus/ui/molecules';
import { BaseView } from '@okampus/ui/templates';

export function ProjectList() {
  const { data } = useTypedQuery({
    project: [
      {
        where: {
          _not: {
            events: {
              eventRoles: { userId: { _isNull: true } },
            },
          },
        },
      },
      projectWithTeamInfo,
    ],
  });
  const { data: helpWanted } = useTypedQuery({
    project: [
      {
        where: {
          events: {
            eventRoles: { userId: { _isNull: true } },
          },
        },
      },
      projectWithTeamInfo,
    ],
  });
  const helpWantedProjects = helpWanted?.project;
  const otherProjects = data?.project;

  const sections = [
    ['À la recherche de volontaires', helpWantedProjects],
    ['Projets futurs', otherProjects],
  ] as const;

  return (
    <BaseView topbar={<div className="title">Projets</div>}>
      <div className="large-heading">Projets</div>
      <div className="flex flex-col gap-10 pt-6">
        {otherProjects && otherProjects.length === 0 && helpWantedProjects && helpWantedProjects.length === 0 ? (
          <div>Aucun projet pour le moment.</div>
        ) : (
          <>
            {sections.map(([title, projects], idx) =>
              projects ? (
                projects.length > 0 ? (
                  <div className="flex flex-col gap-4" key={idx}>
                    <div className="title text-1">{title}</div>
                    <div className="flex flex-col gap-8">
                      {projects.map((project) => (
                        <ProjectCard key={project.id as string} project={project} />
                      ))}
                    </div>
                  </div>
                ) : null
              ) : (
                <div className="flex flex-col gap-4" key={idx}>
                  <Skeleton height={32} width={200} />
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(30rem,1fr))] gap-4">
                    {Array.from({ length: 6 }).map((_, idx) => (
                      <Skeleton key={idx} height={100} width="full" />
                    ))}
                  </div>
                </div>
              )
            )}
          </>
        )}
      </div>
    </BaseView>
  );
}
