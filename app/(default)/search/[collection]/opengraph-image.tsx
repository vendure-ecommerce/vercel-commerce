import OpengraphImage from 'components/opengraph-image';
import { getCollection } from 'lib/vendure';

export const runtime = 'edge';

export default async function Image({ params }: { params: { collection: string } }) {
  const collection = await getCollection(params.collection);
  const title = collection?.name;

  return await OpengraphImage({ title });
}
