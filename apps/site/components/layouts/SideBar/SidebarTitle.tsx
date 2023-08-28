export default function SideBarTitle({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="px-4 w-full line-clamp-1 text-0 font-semibold text-lg flex items-center h-[var(--h-topbar)]">
        {children}
      </div>
      <hr className="border-color-1 mb-3" />
    </div>
  );
}
