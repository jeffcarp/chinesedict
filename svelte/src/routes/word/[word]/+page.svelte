<script lang="ts">
    /** @type {import('./$types').PageData} */
    export let data;

    // Preprocess examples to create paired characters with their pinyin
    const processedExamples = data.entry.examples.map(example => ({
        ...example,
        pairs: example.example.split('').map((char) => {
            const isChinese = /[\u4e00-\u9fff]/.test(char);
            return {
                char,
                pinyin: isChinese ? example.pinyin[example.example.slice(0, example.example.indexOf(char))
                    .split('')
                    .filter(c => /[\u4e00-\u9fff]/.test(c))
                    .length] : ''
            };
        })
    }));
</script>

<svelte:head>
    <title>{data.entry.simplified} ChineseDict</title>
</svelte:head>

<style>
    rt {
        font-size: 0.5em;
        /* text-align: center; */
        user-select: none;  /* Make ruby text non-selectable */
        -webkit-user-select: none;  /* Safari support */
        -moz-user-select: none;     /* Firefox support */
        -ms-user-select: none;      /* IE/Edge support */
    }
    
    /* Optional: add some spacing between characters */
    ruby a {
        text-decoration: none;
    }
</style>

<section class="flex text-5xl mb-8">
    {#each data.entry.simplified.split('') as char, i}
        <div class="flex flex-col items-center">
            <ruby>
                <a class="text-bold" href="/word/{char}">{char}</a>
                <rt class="text-xs text-gray-400">{data.entry.pinyin[i]}</rt>
            </ruby>
            <span class="text-gray-600 text-3xl mt-1">{data.entry.traditional[i]}</span>
            {#if data.entry.characters}
                <span class="text-gray-600 text-sm mt-1">{data.entry.characters[i]}</span>
            {/if}
        </div>
    {/each}
</section>

<ol class="list-decimal list-inside">
    {#each data.entry.definitions as def}
        <li class="pb-6">
            <span class="text-lg font-bold">{def.definition}</span>
                {#if def.example}
                    <div class="px-4 py-2">
                        <ruby>
                            {#each def.example.example.split('') as char}
                                <span>{char}</span>
                                <rt class="text-xs text-gray-400">{def.example.pinyin[def.example.example.slice(0, def.example.example.indexOf(char)).split('').filter(c => /[\u4e00-\u9fff]/.test(c)).length]}</rt>
                            {/each}
                        </ruby>
                        <div class="text-gray-700 dark:text-gray-300">{def.example.translation}</div>
                    </div>
                {/if}
        </li>
    {/each}
</ol>

{#if data.entry.examples && data.entry.examples.length > 0}
    <div class="my-8">
        <h3 class="text-2xl mb-6 font-bold">Examples</h3>
        {#each processedExamples as example}
            <div class="mb-6">
                <div class="text-2xl">
                    <ruby>
                        {#each example.pairs as pair}
                            <span>{pair.char}</span>
                            <rt class="text-xs text-gray-400">{pair.pinyin}</rt>
                        {/each}
                    </ruby>
                </div>
                <div class="text-gray-700 dark:text-gray-300">{example.translation}</div>
            </div>
        {/each}
    </div>
{/if}

<section class="my-8">
    <h3 class="text-2xl mb-6 font-bold">Resources</h3>

    <ul class="list- list-inside">
        <li><a href="https://en.wiktionary.org/wiki/{data.entry.simplified}">Wiktionary: {data.entry.simplified}</a></li>
        <li><a href="https://www.mdbg.net/chinese/dictionary?wdqb={data.entry.simplified}">MDBG: {data.entry.simplified}</a></li>
        <li>Examples with {data.entry.simplified} on <a href="https://tatoeba.org/en/sentences/search?from=cmn&query={data.entry.simplified}&to=eng">Tatoeba</a></li>
    </ul>
</section>

{#if data.entry.tags && data.entry.tags.length > 0}
    <div class="my-8">
        <h3 class="text-2xl mb-6 font-bold">Tags</h3>
        <div class="flex gap-2">
            {#each data.entry.tags as tag}
                <a href="/tag/{tag}" class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">{tag}</a>
            {/each}
        </div>
    </div>
{/if}