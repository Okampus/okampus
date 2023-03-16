import { Link } from 'react-router-dom';

type ExpectedError = '404' | '403';

export function ErrorPage({ error }: { error: ExpectedError }) {
  return (
    <div className="w-full h-full flex justify-center items-center flex-col gap-6">
      <div className="text-2xl text-red-500">
        {error === '404' ? "404 - Cette page n'existe pas" : "403 - Vous n'êtes pas autorisé à consulter cette page"}
      </div>
      <Link to="/clubs" className="rounded-lg gray-button px-3 py-2">
        Go back home
      </Link>
    </div>
  );
}
