import { getPage } from '@/lib/vendure';
import OpengraphImage from 'components/opengraph-image';

export default async function Image({ params }: { params: { page: string } }) {
  const page = await getPage(params.page);
  const title = page?.seo?.title || page?.title;

  return await OpengraphImage({ title });
}
