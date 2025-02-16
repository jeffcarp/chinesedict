import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDictionary } from '$lib/stores';

export const load: PageServerLoad = async () => {
    const dictionary = await getDictionary();
    
    if (dictionary.length === 0) {
        throw new Error('Dictionary is empty');
    }

    const randomIndex = Math.floor(Math.random() * dictionary.length);
    const randomWord = dictionary[randomIndex].simplified;

    throw redirect(303, `/word/${randomWord}`);
};