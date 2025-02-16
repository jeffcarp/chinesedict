import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const dictionary = writable<any[]>([]);
export const dictionaryLoading = writable(true);
export const searchIndex = writable<any[]>([]);
export const searchIndexLoading = writable(true);

export const searchQuery = writable('');
export const searchResults = writable([]);
export const showSearchResults = writable(false);


export const getDictionary = async () => {
    if (browser) {
        /*
        const response = await fetch(new URL('/full_dictionary.json', window.location.origin));
        const data = await response.json();
        */
        const data = []
        dictionary.set(data);
        dictionaryLoading.set(false);
        return data;
    } else {
        try {
            const data = await import('../../static/full_dictionary.json');
            return data.default;
        } catch (e) {
            console.error('Failed to load dictionary on server:', e);
            return [];
        }
    }
};

export const getSearchIndex = async () => {
    if (browser) {
        const response = await fetch(new URL('/full_search_index.json', window.location.origin));
        const data = await response.json();
        searchIndex.set(data);
        searchIndexLoading.set(false);
        return data;
    } else {
        try {
            const data = await import('../../static/full_search_index.json');
            return data.default;
        } catch (e) {
            console.error('Failed to load search index on server:', e);
            return [];
        }
    }
};