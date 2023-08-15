export default function SideBarTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className={'px-4 w-full line-clamp-1 text-0 font-bold text-lg flex items-center h-[var(--h-topbar)]'}>
      {children}
    </div>
  );
}
