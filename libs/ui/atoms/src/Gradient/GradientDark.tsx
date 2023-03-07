type GradientDarkProps = {
  className?: string;
  children?: React.ReactNode;
};

export function GradientDark({ className, children }: GradientDarkProps) {
  return (
    <div className={className}>
      {children}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent dark:to-[#00000090] to-[#ffffff35]" />
    </div>
  );
}
