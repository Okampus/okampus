export type Status = 'archived' | 'info' | 'success' | 'failure' | 'warning';

export type StatusLabelProps = {
  status?: Status;
  label: string;
};

export function StatusLabel({ status = 'info', label }: StatusLabelProps) {
  return (
    <div className="py-1 px-3 status background rounded-lg w-fit text-sm" {...{ status }}>
      <span className="title">{label}</span>
    </div>
  );
}
