import OpengraphImage from 'components/opengraph-image';
import { getPage } from 'lib/vendure';

export const runtime = 'edge';

export default async function Image({ params }: { params: { page: string } }) {
  const page = {
    title: 'Test',
    seo: { title: 'Test' }
  };
  const title = page.seo?.title || page.title;

  return await OpengraphImage({ title });
}
