import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDictionary } from '$lib/stores';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
  const dictionary = await getDictionary();
  const entries = dictionary.filter(
    item => item.tags?.includes(params.tag) ?? false
  );

  if (!entries) throw error(404, { message: 'Tag not found.' });

  setHeaders({
      'Cache-Control': 'public, max-age=604800'
  });

  return {
      tag: params.tag,
      entries: entries,
  };
};
