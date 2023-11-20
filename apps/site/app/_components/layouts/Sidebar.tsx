import TabBar from './TabBar/TabBar';
import Backdrop from '../atoms/Layout/Backdrop';
// import CurrentUserBar from '../../_views/CurrentUserBar';

export type SidebarProps = { children?: React.ReactNode; header?: React.ReactNode };

const sidebarClass =
  'h-full flex shrink-0 bg-[var(--bg-main)] overflow-hidden md-max:absolute md-max:top-0 md-max:left-0 md-max:z-[-1] md-max:[&.active]:z-[103] md:relative md-max:[&.active+div]:block';

export default async function Sidebar({ children, header }: SidebarProps) {
  // const router = useRouter();
  // const logout = trpcClient.logout.useMutation({
  //   onSettled: () => router.push('/signin'),
  // });

  // const currentWindowSize = useCurrentBreakpoint();
  // const isMobile = currentWindowSize === 'mobile';

  // useEffect(() => {
  //   if (!isMobile && !isSidebarOpen) setIsSideBarOpen(true);
  // }, [isMobile, isSidebarOpen, setIsSideBarOpen]);

  // useEffect(() => {
  //   if (isMobile) setIsSideBarOpen(false);
  // }, [isMobile, setIsSideBarOpen]);

  // const width = children ? 'var(--w-sidepanel)' : 'var(--w-tabbar)';
  // const initial = { x: -width, width: 0 };
  // const animate = { x: 0, width };

  return (
    <>
      <aside id="sidebar" className={sidebarClass}>
        <TabBar smallMode={!!children} />
        {children && (
          <div className="h-full flex flex-col justify-between border-r border-[var(--border-1)] w-[var(--w-sidebar)]">
            <nav className="md-max:h-full md:h-[calc(100%-4rem)] flex flex-col">
              {header}
              <div className="h-full overflow-y-scroll min-h-0 scrollbar">{children}</div>
            </nav>
          </div>
        )}
      </aside>
      <Backdrop className="hidden" activeElementSelector="#sidebar" />
    </>
  );
}
