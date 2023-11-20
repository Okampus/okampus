import { searchCompanies } from '../../../../server/services/legalUnit';
import { withAuth } from '../../../../server/utils/withAuth';

export async function GET(request: Request) {
  await withAuth();

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const results = await searchCompanies(search);

  return Response.json(results);
}
