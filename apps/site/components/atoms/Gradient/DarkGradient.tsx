type DarkGradientProps = { className?: string; children?: React.ReactNode };
export default function DarkGradient({ className, children }: DarkGradientProps) {
  return (
    <div className={className}>
      {children}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent dark:to-[#00000060] to-[#ffffff35]" />
    </div>
  );
}
