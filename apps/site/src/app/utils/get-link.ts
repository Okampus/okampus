import { RouteParamStrings } from '../menus';
import { enumKeys } from '@okampus/shared/utils';

export type LinkContext = {
  [key in keyof typeof RouteParamStrings]?: string;
};

const error = (ressourceType: string, link: string) => {
  console.error(`AppLink: no ${ressourceType} found for link ${link}`);
  return '/';
};

export function getLink(link: string, context: LinkContext = {}) {
  for (const routeKey of enumKeys(RouteParamStrings)) {
    const ressourceRoute = RouteParamStrings[routeKey];
    if (link.includes(ressourceRoute)) {
      if (!context[routeKey]) return error(ressourceRoute, link);
      link = link.replace(ressourceRoute, `${context[routeKey]}`);
    }
  }
  return link;
}
