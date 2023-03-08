type GradientTransparentProps = {
  className?: string;
  children?: React.ReactNode;
};

export function GradientTransparent({ className, children }: GradientTransparentProps) {
  return (
    <div className={className}>
      {children}
      <div className="absolute inset-0 bg-gradient-to-b dark:from-[#000000aa] from-[#ffffff90] !to-[var(--bg-main)]" />
    </div>
  );
}
