import { SidepanelButton } from '../layouts/SidepanelButton';
import Skeleton from '../atoms/Skeleton/Skeleton';
import SidebarButton from '../layouts/SidebarButton';
import clsx from 'clsx';

const headerClassName = 'pr-1 font-semibold text-[var(--text-0)] tracking-tighter tabular-nums line-clamp-1';
const topbarClassName =
  'flex justify-between gap-8 w-full md-max:min-h-[var(--h-topbar)] px-[var(--px-content)] z-20 border-[var(--border-1)] md-max:border-b md-max:sticky items-center md-max:top-0 md-max:bg-[var(--bg-main)] md:mt-10';

export type BaseViewProps = {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  contentMode?: 'default' | 'centered-6xl' | 'centered-7xl';
  hasCta?: boolean;
  header?: React.ReactNode;
  headerSmall?: React.ReactNode;
  actionButtons?: React.ReactNode[];
  actionButtonsSmall?: React.ReactNode[];
  sidePanelButton?: React.ReactNode;
  sidePanelButtonSmall?: React.ReactNode;
  hasSidebar?: boolean;
  unscrollable?: boolean;
  paddingMode?: 'default' | 'none' | 'large';
};

const paddingModes = {
  default: 'px-[var(--px-content)] py-[var(--py-content)]',
  none: 'px-0 py-0',
  large: 'md:px-[var(--px-content)] md:py-[var(--py-content)]',
};

const contentModes = {
  default: '',
  'centered-6xl': 'max-w-6xl mx-auto',
  'centered-7xl': 'max-w-7xl mx-auto',
};

export default function BaseView({
  children,
  className,
  innerClassName,
  contentMode = 'default',
  hasCta,
  header,
  headerSmall,
  actionButtons,
  actionButtonsSmall,
  sidePanelButton,
  sidePanelButtonSmall,
  hasSidebar = true,
  unscrollable,
  paddingMode = 'default',
}: BaseViewProps) {
  const actions = <>{actionButtons?.map((action, idx) => action ?? <Skeleton key={idx} className="w-24 h-12" />)}</>;

  const actionsSmall = actionButtonsSmall ? (
    <>{actionButtonsSmall.map((action, idx) => action ?? <Skeleton key={idx} className="w-7 h-7" />)}</>
  ) : null;

  const showButtonTopbar =
    sidePanelButton || sidePanelButtonSmall || actionButtons?.length || actionButtonsSmall?.length;

  return (
    <section
      className={clsx(
        className,
        'w-full min-w-0 flex flex-col border-[var(--border-1)] md-max:border-b md:h-full',
        hasCta
          ? 'md-max:h-[calc(100%-(var(--h-bottombar)+var(--h-input)+2rem))]'
          : 'md-max:h-[calc(100%-(var(--h-bottombar)))]',
        !unscrollable && 'scrollbar overflow-x-hidden overflow-y-scroll',
      )}
    >
      <nav className={clsx(topbarClassName, contentModes[contentMode])}>
        <div className="flex items-center gap-6">
          {hasSidebar && <SidebarButton />}
          <div className={clsx('md-max:hidden text-4xl', headerClassName)}>{header}</div>
          <div className={clsx('md:hidden text-xl', headerClassName)}>{headerSmall || header}</div>
        </div>
        {showButtonTopbar && (
          <div className="flex items-center gap-6">
            <div className="md-max:hidden flex items-center gap-6">{actions}</div>
            <div className="md:hidden flex items-center gap-6">{actionsSmall || actions}</div>
            {sidePanelButton || (
              <div>
                <SidepanelButton className="md-max:hidden">{sidePanelButton}</SidepanelButton>
                <SidepanelButton className="md:hidden">{sidePanelButtonSmall || sidePanelButton}</SidepanelButton>
              </div>
            )}
          </div>
        )}
      </nav>
      <div
        className={clsx(
          'w-full mt-4 md:mt-10 relative',
          paddingModes[paddingMode],
          contentModes[contentMode],
          innerClassName,
          !unscrollable && '[&>:last-child]:mb-[var(--pb-app)]',
        )}
      >
        {children}
      </div>
    </section>
  );
}
