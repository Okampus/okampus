// import comingSoonDark from '@okampus/assets/images/empty-state/coming-soon-dark.webp';
// import comingSoonLight from '@okampus/assets/images/empty-state/coming-soon-light.webp';
// import connectionLostDark from '@okampus/assets/images/empty-state/connection-lost-dark.webp';
// import connectionLostLight from '@okampus/assets/images/empty-state/connection-lost-light.webp';
// import deletedDark from '@okampus/assets/images/empty-state/deleted-dark.webp';
// import deletedLight from '@okampus/assets/images/empty-state/deleted-light.webp';
// import emptyDark from '@okampus/assets/images/empty-state/empty-dark.webp';
// import emptyLight from '@okampus/assets/images/empty-state/empty-light.webp';
// import errorDark from '@okampus/assets/images/empty-state/error-dark.webp';
// import errorLight from '@okampus/assets/images/empty-state/error-light.webp';
// import noImageDark from '@okampus/assets/images/empty-state/no-image-dark.webp';
// import noImageLight from '@okampus/assets/images/empty-state/no-image-light.webp';
// import notFoundDark from '@okampus/assets/images/empty-state/not-found-dark.webp';
// import notFoundLight from '@okampus/assets/images/empty-state/not-found-light.webp';
// import nothingNewDark from '@okampus/assets/images/empty-state/nothing-new-dark.webp';
// import nothingNewLight from '@okampus/assets/images/empty-state/nothing-new-light.webp';
// import sentDark from '@okampus/assets/images/empty-state/sent-dark.webp';
// import sentLight from '@okampus/assets/images/empty-state/sent-light.webp';
// import successDark from '@okampus/assets/images/empty-state/success-dark.webp';
// import successLight from '@okampus/assets/images/empty-state/success-light.webp';

export enum EmptyStateType {
  COMING_SOON = 'coming-soon',
  CONNECTION_LOST = 'connection-lost',
  DELETED = 'deleted',
  EMPTY = 'empty',
  ERROR = 'error',
  NO_IMAGE = 'no-image',
  NOT_FOUND = 'not-found',
  NOTHING_NEW = 'nothing-new',
  SENT = 'sent',
  SUCCESS = 'success',
}

export function getImagesFromEmptyState(type?: EmptyStateType) {
  // switch (type) {
  //   case EmptyStateType.COMING_SOON: {
  //     return { dark: comingSoonDark, light: comingSoonLight };
  //   }
  //   case EmptyStateType.CONNECTION_LOST: {
  //     return { dark: connectionLostDark, light: connectionLostLight };
  //   }
  //   case EmptyStateType.DELETED: {
  //     return { dark: deletedDark, light: deletedLight };
  //   }
  //   case EmptyStateType.EMPTY: {
  //     return { dark: emptyDark, light: emptyLight };
  //   }
  //   case EmptyStateType.ERROR: {
  //     return { dark: errorDark, light: errorLight };
  //   }
  //   case EmptyStateType.NO_IMAGE: {
  //     return { dark: noImageDark, light: noImageLight };
  //   }
  //   case EmptyStateType.NOT_FOUND: {
  //     return { dark: notFoundDark, light: notFoundLight };
  //   }
  //   case EmptyStateType.NOTHING_NEW: {
  //     return { dark: nothingNewDark, light: nothingNewLight };
  //   }
  //   case EmptyStateType.SENT: {
  //     return { dark: sentDark, light: sentLight };
  //   }
  //   case EmptyStateType.SUCCESS: {
  //     return { dark: successDark, light: successLight };
  //   }
  //   default: {
  //     return { dark: emptyDark, light: emptyLight };
  //   }
  // }
  return {
    dark: '',
    light: '',
  };
}

export type EmptyStateProps = { type?: EmptyStateType; title?: string; footer?: React.ReactNode };
export function EmptyState({ type, title, footer }: EmptyStateProps) {
  const { dark, light } = getImagesFromEmptyState(type);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-4">
      <img src={dark} alt={title} className="min-w-[20rem] h-[60%] aspect-square rounded-3xl" />
      <div className="title mt-6">{title}</div>
      <div className="title-sm">{footer}</div>
      {/* <div style={{
        backgroundImage: `url(${dark})`,
      }} className="min-w-[20rem] w-7/10 dark:backgrou"></div> */}
      {/* <img src={dark} alt={title} className="w-48 h-48" />
      <h3 className="mt-4 text-2xl font-bold text-center text-gray-600 dark:text-gray-400">{title}</h3>
      <div className="mt-4 text-center text-gray-500">{footer}</div> */}
    </div>
  );
}
