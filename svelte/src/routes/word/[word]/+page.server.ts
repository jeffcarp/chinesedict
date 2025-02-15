import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDictionary } from '$lib/stores';

export const load: PageServerLoad = async ({ params }) => {
    const dictionary = await getDictionary();
    const entry = dictionary.find(item => item.simplified === params.word);
    
    if (!entry) {
        throw error(404, {
            message: 'Word not found in dictionary'
        });
    }

    return {
        entry
    };
}; 