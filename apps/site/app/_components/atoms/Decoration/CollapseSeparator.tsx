export type CollapseSeparatorProps = { offset?: string; borderColor?: string };
export default function CollapseSeparator({ offset = '50%', borderColor = 'var(--border-2)' }: CollapseSeparatorProps) {
  return (
    <div className="relative w-full h-[1rem] flex my-2">
      <div
        className="h-full rounded-l-lg absolute left-0 top-0 transform -translate-y-1/2 border-t-2"
        style={{ width: `calc(${offset} - 1rem)`, transform: 'translateY(0.75rem)', borderColor }}
      />
      <div
        className="absolute w-[2rem] h-full border-r-2 border-b-2 rounded-br-md -top-[calc(1.5rem-2px)]"
        style={{ left: `calc(${offset} - 1rem)`, transform: 'translateY(1.25rem)', borderColor }}
      />
      <div
        className="absolute w-[2rem] h-full border-l-2 border-b-2 rounded-bl-md -top-[calc(1.5rem-2px)]"
        style={{ left: `calc(${offset} + 1rem - 2px)`, transform: 'translateY(1.25rem)', borderColor }}
      />
      <div
        className="h-full rounded-r-lg absolute right-0 top-0 transform -translate-y-1/2 border-t-2"
        style={{ width: `calc(100% - ${offset} - 1.5rem)`, transform: 'translateY(0.75rem)', borderColor }}
      />
    </div>
  );
}
