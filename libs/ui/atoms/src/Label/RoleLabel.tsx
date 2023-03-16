export type RoleLabelProps = {
  label: string;
  color: string;
};

export function RoleLabel({ label, color }: RoleLabelProps) {
  return (
    <div className="flex items-center gap-1 bg-2 button-rounded py-0.5 px-2 w-fit">
      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color }}></div>
      <div className="font-semibold text-2 text-sm font-heading">{label}</div>
    </div>
  );
}
