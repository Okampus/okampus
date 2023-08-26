import { ErrorMessage } from '@hookform/error-message';

function InlineErrors({
  message,
  messages,
}: {
  message: string;
  messages?: { [key: string]: string | undefined | boolean | string[] };
}) {
  return messages ? (
    <ul>
      {Object.entries(messages).map(([key, message]) => (
        <li key={key} className="text-[var(--danger)] font-medium">
          • {message}
        </li>
      ))}
    </ul>
  ) : message ? (
    <span className="text-[var(--danger)] font-medium">• {message}</span>
  ) : null;
}

export default function FormErrors({
  errors,
  ...props
}: (typeof ErrorMessage)['arguments'] & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props}>
      <ErrorMessage errors={errors} name="root" render={InlineErrors} />
    </div>
  );
}
