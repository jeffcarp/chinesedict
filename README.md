# chinesedict

## Overview

ChineseDict aims to be a fast Chinese-English dictionary. Its main goal is
providing instant-search to enable looking up words rapidly during discussion
or watching a video.

## Development

Tasks:

- [x] Load full dictionary with real data
    - [x] Adapt current dictionary to new format
- [x] Implement word page (only to parity)
- [x] Implement random page
- [ ] Implement full search
    - [x] simplified
    - [x] pinyin
    - [x] definitions
    - [ ] segmentation
- [x] Implement lists (requires indexes)
- [ ] Add GA (disable when running locally)

## Developing

```bash
npm run dev
```

## Deploying

```bash
# Build for prod
npm run build

# Preview prod
npm run preview
```

## Acknowledgements

- Dictionary data from the [CC-CEDICT](https://cc-cedict.org/) project.
- Style inspiration from [jisho.org](https://jisho.org).
- Chengyu from: https://github.com/chujiezheng/ChID-Dataset/

## Learning Resources

- [mdbg.net](https://www.mdbg.net/)
- [hanzigraph.com](https://hanzigraph.com/)
