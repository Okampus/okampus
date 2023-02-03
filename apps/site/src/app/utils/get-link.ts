interface LinkContext {
  orgSlug?: string;
  userSlug?: string;
}

export function getLink(link: string, context?: LinkContext) {
  if (link.includes(':orgId')) {
    if (!context?.orgSlug) {
      console.error('AppLink: no orgId found for link', link);
      return '/';
    }
    link = link.replace(':orgId', context?.orgSlug);
  }

  if (link.includes(':userId')) {
    if (!context?.userSlug) {
      console.error('AppLink: no userId found for link', link);
      return '/';
    }
    link = link.replace(':userId', context.userSlug);
  }

  return link;
}
