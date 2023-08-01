import ViewLayout from '../../../components/atoms/Layout/ViewLayout';
import { ReactComponent as NotFoundEmptyState } from '@okampus/assets/svg/empty-state/404.svg';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="bg-main text-1 w-full h-full flex items-stretch overflow-hidden">
      <ViewLayout>
        <h1 className="page-title">Oups, cette ressource n&apos;existe pas.</h1>
        <NotFoundEmptyState className="h-64" />
        <Link href="/">Retourner à l&apos;accueil</Link>
      </ViewLayout>
    </main>
  );
}
