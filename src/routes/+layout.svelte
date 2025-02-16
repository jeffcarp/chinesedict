<script lang="ts">
	import '../app.css';
  import Header from '../components/Header.svelte';
  import Search from '../components/Search.svelte';
  import { writable } from 'svelte/store';
  import { onMount } from 'svelte';
  import { afterNavigate } from '$app/navigation';
  import { dictionary, dictionaryLoading, getDictionary, searchQuery, searchResults, showSearchResults } from '$lib/stores';

	let { children } = $props();

  // Load dictionary on component mount
  onMount(async () => {
    try {
      const data = await getDictionary();
      dictionary.set(data);
      dictionaryLoading.set(false);
    } catch (error) {
      console.error('Failed to load dictionary:', error);
      dictionaryLoading.set(false);
    }
  });
</script>

<svelte:head>
    <title>ChineseDict</title>
    <meta name="description" content="Chinese-English Dictionary" />
</svelte:head>

<div class="min-h-screen flex flex-col">
  <Header />

  <div class="flex-1">
    <Search />

    <main>
      {@render children()}
    </main>
  </div>

  <footer class="text-xs text-gray-500 py-4 flex justify-between min-h-[5rem]">
    <div>
      Data via <a href="/about">CC-EDICT and others</a>.<br/>
      Provide feedback <a href="https://github.com/jeffcarp/chinesedict/issues/new">here</a>.<br/>
    </div>
    <div>
      Dictionary loaded: {!$dictionaryLoading}
    </div>
  </footer>
</div>
