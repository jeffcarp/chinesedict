import MiniSearch from 'minisearch';
import fs from 'fs/promises';
import path from 'path';

async function buildSearchIndex() {
  try {
    // Read the dictionary data
    const dictionaryPath = path.join(process.cwd(), 'static', 'full_dictionary.json');
    const data = JSON.parse(await fs.readFile(dictionaryPath, 'utf-8'));

    // Create and configure MiniSearch
    const miniSearch = new MiniSearch({
      fields: ['simplified', 'traditional', 'pinyin', 'pinyinNormalized', 'pinyinJoined', 'definitions'],
      storeFields: ['simplified', 'traditional', 'pinyin', 'definitions', 'percentile'],
      searchOptions: {
        boost: {
          percentile: 3,
          simplified: 2,
          traditional: 2,
          pinyin: 1.5,
          pinyinNormalized: 1.5,
          pinyinJoined: 1.5,
          definitions: 1,
        },
        fuzzy: 0.2
      },
      extractField: (document, fieldName) => {
        if (fieldName === 'pinyinNormalized') {
          return document.pinyin
            .map(p => p.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))
            .join('');
        }
        if (fieldName === 'pinyinJoined') {
          return document.pinyin.join(' ');
        }
        if (fieldName === 'definitions') {
          return document.definitions.map(d => d.definition).join(' ');
        }
        return document[fieldName];
      }
    });

    // Add documents to the index
    miniSearch.addAll(data.map((doc, index) => ({ ...doc, id: index })));

    // Serialize the index
    const serializedIndex = miniSearch.toJSON();

    // Write the serialized index to the static directory
    const outputPath = path.join(process.cwd(), 'static', 'search-index.json');
    await fs.writeFile(outputPath, JSON.stringify(serializedIndex));

    console.log('Search index built successfully!');
    console.log(`Original data size: ${(JSON.stringify(data).length / 1024 / 1024).toFixed(2)}MB`);
    console.log(`Index size: ${(JSON.stringify(serializedIndex).length / 1024 / 1024).toFixed(2)}MB`);

  } catch (error) {
    console.error('Error building search index:', error);
    process.exit(1);
  }
}

buildSearchIndex(); 