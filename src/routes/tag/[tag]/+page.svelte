<script lang="ts">
  /** @type {import('./$types').PageData} */
  export let data;
  export const prerender = true;
</script>

<svelte:head>
    <title>{data.tag} ChineseDict</title>
</svelte:head>

<h1 class="text-3xl pb-4 mb-4">
    Tag:
    <span class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">{data.tag}</span>
</h1>

<ul class="grid grid-cols-2 md:grid-cols-4 gap-4">
    {#each data.entries as entry}
        <li>
            <div class="">
                <a class="text-3xl" href="/word/{entry.simplified}">{entry.simplified}</a>
            </div>
            <div class="text-xs text-gray-500 mb-1">{entry.pinyin}</div>
            <div class="text-sm text-gray-700 dark:text-gray-300">{entry.definitions[0].definition}</div>
        </li>
    {/each}
</ul>
