<script lang="ts">
import '../app.css';
import Header from '../components/Header.svelte';
import { writable } from 'svelte/store';
import { onMount } from 'svelte';
import { afterNavigate } from '$app/navigation';
import { searchIndex, searchIndexLoading, getSearchIndex } from '$lib/stores';
import Fuse from 'fuse.js';

let { children } = $props();

let searchQuery = writable('');
let searchResults = writable([]);
let showSearchResults = writable(false);
let segmentedWords = writable<string[]>([]);
let selectedWordIndex = writable(0);
let isSegmentMode = writable(false);
let fuse: Fuse<any>;

interface TrieNode {
  isWord: boolean;
  children: Map<string, TrieNode>;
}

let pinyinTrie: TrieNode;

function buildPinyinTrie(dictionary: any[]) {
  const root: TrieNode = { isWord: false, children: new Map() };
  
  for (const entry of dictionary) {
    const word = entry.simplified;
    let node = root;
    
    // Add each character to the trie
    for (const char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, { isWord: false, children: new Map() });
      }
      node = node.children.get(char)!;
    }
    node.isWord = true;
  }
  
  return root;
}

function segmentChinese(text: string): string[] {
  const segments: string[] = [];
  let start = 0;
  
  while (start < text.length) {
    let end = start;
    let lastWordEnd = start;
    let node = pinyinTrie;
    
    // Try to match the longest possible word
    while (end < text.length && node.children.has(text[end])) {
      node = node.children.get(text[end])!;
      end++;
      if (node.isWord) {
        lastWordEnd = end;
      }
    }
    
    // If we found a word, add it to segments
    if (lastWordEnd > start) {
      segments.push(text.slice(start, lastWordEnd));
      start = lastWordEnd;
    } else {
      // If no word found, take one character as a segment
      segments.push(text.slice(start, start + 1));
      start++;
    }
  }
  
  return segments;
}

// Load dictionary on component mount
onMount(async () => {
  try {
    const data = await getSearchIndex();
    searchIndex.set(data);
    
    // Build the trie from the dictionary
    pinyinTrie = buildPinyinTrie(data);
    
    fuse = new Fuse(data, {
      keys: [
        { name: 'simplified', weight: 2 },
        { name: 'traditional', weight: 2 },
        { name: 'pinyin', weight: 1.5 },
        { 
          name: 'pinyinNormalized',
          weight: 1.5,
          getFn: (obj) => obj.pinyin
            .map(p => p.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))
            .join('')
        },
        { 
          name: 'pinyinJoined',
          weight: 1.5,
          getFn: (obj) => obj.pinyin.join(' ')
        },
        {
          name: 'definitions',
          weight: 1,
          getFn: (obj) => obj.definitions.map(d => d.definition).join(' ')
        },
      ],
      threshold: 0.3,
      includeScore: true
    });
    
    searchIndexLoading.set(false);
  } catch (error) {
    console.error('Failed to load search index:', error);
    searchIndexLoading.set(false);
  }
});

function handleInputChange(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  searchQuery.set(value);
  
  // Check if input contains Chinese characters
  if (/[\u4e00-\u9fff]/.test(value)) {
    const words = segmentChinese(value);
    segmentedWords.set(words);
    isSegmentMode.set(true);
    selectedWordIndex.set(0);
    // Search for the first word automatically
    // searchQuery.set(words[0]);
    handleSearch();
  } else {
    isSegmentMode.set(false);
    handleSearch();
  }
}

function handleSearch() {
  showSearchResults.set(true);
  if ($searchIndexLoading) return;
  
  const query = $searchQuery.toLowerCase().trim();
  if (!query) {
    searchResults.set([]);
    return;
  }

  const results = fuse.search(query)
    .slice(0, 20)
    .map(result => result.item);

  searchResults.set(results);
}

afterNavigate(() => {
  showSearchResults.set(false);
});
</script>

<div class="w-full pb-4 mb-4">
    <div class="relative">
    <input 
        type="search"
        placeholder="Search for words..."
        class="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        value={$searchQuery}
        oninput={handleInputChange}
        onfocus={(e) => e.target.select()}
        disabled={$searchIndexLoading}
    />
    <button class="absolute right-3 top-1/2 -translate-y-1/2" aria-label="Search">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
        </svg>
    </button>

    <div class="search-results {$showSearchResults ? "show" : ""} bg-gray-100 bg-opacity-95 rounded-lg max-h-screen overscroll-auto overflow-hidden">
        {#if $searchResults.length > 0}
        <ul class="divide-y divide-gray-300">
            {#each $searchResults as result}
            <li class="block">
                <a href="/word/{result.simplified}" class="block py-2 px-2 hover:bg-gray-50/50">
                    <h2 class="text-lg font-medium text-gray-900">{result.simplified}</h2>
                    <p class="text-sm text-gray-600">{result.pinyin.join(' ')}</p>
                    <p class="text-base text-gray-900">{result.definitions[0].definition}</p>
                </a>
            </li>
            {/each}
        </ul>
        {/if}
    </div>

    </div>
</div>