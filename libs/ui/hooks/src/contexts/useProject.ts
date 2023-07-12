import { PROJECT_SLUG_PARAM } from '@okampus/shared/consts';
import { projectWithTeamInfo, useTypedLazyQuery } from '@okampus/shared/graphql';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export function useProject() {
  const projectSlug = useParams()[PROJECT_SLUG_PARAM];
  const [getProject, { data, error }] = useTypedLazyQuery({
    project: [{ where: { slug: { _eq: projectSlug } }, limit: 1 }, projectWithTeamInfo],
  });

  useEffect(() => {
    projectSlug && getProject();
  }, [projectSlug, useParams]);

  if (!projectSlug || error) return { project: undefined, error: 404 }; // TODO: standardize error codes
  return { project: data?.project?.[0], error: undefined };
}
