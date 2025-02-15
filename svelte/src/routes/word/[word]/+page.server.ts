import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDictionary } from '$lib/stores';

export const load: PageServerLoad = async ({ params }) => {
    let dictionary = await getDictionary();
    // TODO: replace this with more efficient lookup (maybe map or prebuilt Fuse index?)
    const entry = dictionary.find(item => item.simplified === params.word);
    console.log('entry', entry);
    
    if (!entry) {
        throw error(404, {
            message: 'Word not found in dictionary'
        });
    }

    return {
        entry
    };
}; 