const QUERY_LIMIT = 25
let dictionary = []
const DICT_FILEPATH = '/cedict_parsed.csv.gz'

async function main() {
  document.querySelector('input#query').addEventListener('input', search)
  document.querySelector('form').addEventListener(
    'submit', e => e.preventDefault())

  const queryParams = new URLSearchParams(window.location.search);
  const query = queryParams.get('q');
  if (query) {
    document.querySelector('input#query').value = query
  }

  dictionary = await fetchDictionary()

  if (query) {
    search()
  }
}

async function fetchDictionary() {
  const response = await fetch(DICT_FILEPATH)
  const decompStream = response.body.pipeThrough( new DecompressionStream('gzip'))
  const decompResp = await new Response(decompStream);
  const blob = await decompResp.blob();
  const text = await blob.text();

  const data = text.split(/\r?\n/).map((row, i) => {
    let [simplified, pinyin, definition, percentile] = row.split('∙')
    if (pinyin) {
      pinyin = pinyin.split('_')
    } else {
      console.log('No pinyin for row:', row, i)
      pinyin = []
    }
    if (!definition) {
      console.log('No def for row:', row, i)
      definition = ''
    }
    const searchablePinyin = pinyin.join('').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    return {
      simplified: simplified,
      pinyin: pinyin,
      searchablePinyin: searchablePinyin,
      definition: definition.split('■').join('\n'),
      percentile: Number(percentile),
    }
  })
  return data
}

function searchDict(query) {
  const finalQuery = query.trim().toLowerCase()

  const results = dictionary.filter((entry) => {
    if (entry.simplified && entry.simplified.toLowerCase().includes(finalQuery)) {
      return true
    }
    else if (entry.searchablePinyin.includes(finalQuery)) {
      return true
    }
    else if (entry.definition && entry.definition.toLowerCase().includes(finalQuery)) {
      return true
    }
  })
  results.sort((a, b) => b.percentile - a.percentile)

  return results.slice(0, QUERY_LIMIT)
}

function search() {
  const query = document.querySelector('input#query').value
  const results = searchDict(query)
  document.querySelector('#results').innerHTML = ''
  const resultTemplate = document.querySelector('#search-result-li')
  results.forEach(result => {
    const node = resultTemplate.content.cloneNode(true)
    //node.querySelector('.simplified').innerText = result.simplified
    //node.querySelector('.pinyin').innerText = result.pinyin.join(' ')
    let commonClass = 'common'
    if (result.percentile == 0) {
      commonClass = 'uncommon'
    }

    const rubyEl = document.createElement('ruby')
    result.simplified.split('').forEach((character, i) => {
      const charEl = document.createElement('span')
      charEl.innerText = character
      rubyEl.appendChild(charEl)

      const rtEl = document.createElement('rt')
      rtEl.innerText = result.pinyin[i]
      rubyEl.appendChild(rtEl)
    })
    node.querySelector('.characters').appendChild(rubyEl)
    node.querySelector('.characters').classList.add(commonClass)

    node.querySelector('.definitions').innerText = result.definition
    let percentileText = '(uncommon)'
    if (result.percentile > 0) {
      percentileText = 'p' + result.percentile
    }
    node.querySelector('.percentile').innerText = percentileText

    document.querySelector('#results').appendChild(node)
  })
}

main()
