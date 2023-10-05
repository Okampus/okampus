import { isNonNullObject } from '@okampus/shared/utils';

type RHFError = { message?: string };
export type ErrorMessageProps = {
  errors?: RHFError | RHFError[] | Record<string, RHFError>;
} & React.HTMLAttributes<HTMLDivElement>;

function getErrors(errors?: RHFError | RHFError[] | Record<string, RHFError>) {
  if (!errors) return [];
  if (Array.isArray(errors)) return errors;
  if (isNonNullObject(errors)) return Object.values(errors);
  return [errors];
}

export default function ErrorMessage({ errors, ...props }: ErrorMessageProps) {
  if (!errors) return null;

  const errorList = getErrors(errors).filter((error) => error?.message);
  if (errorList.length === 0) return null;

  return (
    <div {...props}>
      {errorList.length > 1 ? (
        <ul>
          {errorList.map((error, idx) => (
            <li key={idx} className="text-[var(--danger)] font-medium">
              • {error.message}
            </li>
          ))}
        </ul>
      ) : (
        <span className="text-[var(--danger)] font-medium">• {errorList[0].message}</span>
      )}
    </div>
  );
}
