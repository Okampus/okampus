import { Link } from 'react-router-dom';

export function ErrorPage() {
  return (
    <div className="w-full h-full flex justify-center items-center flex-col gap-6">
      <div className="text-2xl text-red-500">404 NOT FOUND</div>
      <Link to="/" className="rounded-lg gray-button px-3 py-2">
        Go back home
      </Link>
    </div>
  );
}
