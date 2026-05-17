import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const majorCards = [
  ['愚者', 'The Fool', '☉', '#f7c873', '#5b1f3a'],
  ['魔术师', 'The Magician', '∞', '#d9a74f', '#173b58'],
  ['女祭司', 'The High Priestess', '☾', '#c7b6ff', '#172149'],
  ['女皇', 'The Empress', '✿', '#e6b45e', '#4d2d1f'],
  ['皇帝', 'The Emperor', '♜', '#e2a33a', '#3b1d15'],
  ['教皇', 'The Hierophant', '✦', '#d7bb72', '#26324d'],
  ['恋人', 'The Lovers', '♡', '#f0a6b2', '#43213f'],
  ['战车', 'The Chariot', '⚔', '#d1c07a', '#182c45'],
  ['力量', 'Strength', '♌', '#f1b85b', '#522918'],
  ['隐士', 'The Hermit', '✧', '#d9d1a1', '#1b2633'],
  ['命运之轮', 'Wheel of Fortune', '☸', '#f0c15f', '#2f2447'],
  ['正义', 'Justice', '⚖', '#d7c68b', '#1e2c33'],
  ['倒吊人', 'The Hanged Man', '◇', '#9fd3d0', '#213044'],
  ['死神', 'Death', '✚', '#d8d8d8', '#111111'],
  ['节制', 'Temperance', '♒', '#bde0ff', '#243555'],
  ['恶魔', 'The Devil', '♑', '#e27b55', '#2a1014'],
  ['高塔', 'The Tower', '⚡', '#f0b14a', '#1b1525'],
  ['星星', 'The Star', '★', '#b9d7ff', '#121d45'],
  ['月亮', 'The Moon', '☽', '#d8c7ff', '#171438'],
  ['太阳', 'The Sun', '☀', '#ffd166', '#4b2509'],
  ['审判', 'Judgement', '☊', '#f3d9a4', '#26364a'],
  ['世界', 'The World', '◎', '#d7c878', '#20372c'],
];

const suits = [
  { cn: '权杖', en: 'Wands', symbol: '♈', color: '#f0a34a', dark: '#3c1d14' },
  { cn: '圣杯', en: 'Cups', symbol: '♢', color: '#7fc7ff', dark: '#152b47' },
  { cn: '宝剑', en: 'Swords', symbol: '†', color: '#d8dbe8', dark: '#1b2230' },
  { cn: '星币', en: 'Pentacles', symbol: '✪', color: '#c9b46a', dark: '#27351e' },
];

const ranks = [
  ['一', 'Ace'],
  ['二', 'Two'],
  ['三', 'Three'],
  ['四', 'Four'],
  ['五', 'Five'],
  ['六', 'Six'],
  ['七', 'Seven'],
  ['八', 'Eight'],
  ['九', 'Nine'],
  ['十', 'Ten'],
  ['侍从', 'Page'],
  ['骑士', 'Knight'],
  ['皇后', 'Queen'],
  ['国王', 'King'],
];

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const escapeXml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const cards = [
  ...majorCards.map(([nameCn, nameEn, symbol, color, dark], index) => ({
    nameCn,
    nameEn,
    label: String(index).padStart(2, '0'),
    symbol,
    color,
    dark,
    type: 'MAJOR',
  })),
  ...suits.flatMap((suit) =>
    ranks.map(([rankCn, rankEn], index) => ({
      nameCn: `${suit.cn}${rankCn}`,
      nameEn: `${rankEn} of ${suit.en}`,
      label: `${index + 1}`,
      symbol: suit.symbol,
      color: suit.color,
      dark: suit.dark,
      type: suit.en.toUpperCase(),
    })),
  ),
];

const makeSvg = (card, index) => {
  const cx = 150 + Math.sin(index) * 26;
  const cy = 210 + Math.cos(index * 1.7) * 24;
  const lineOpacity = card.type === 'MAJOR' ? 0.42 : 0.28;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="630" viewBox="0 0 420 630" role="img" aria-label="${escapeXml(card.nameCn)} Tarot Card">
  <defs>
    <radialGradient id="halo" cx="50%" cy="36%" r="62%">
      <stop offset="0%" stop-color="${card.color}" stop-opacity="0.92"/>
      <stop offset="42%" stop-color="${card.color}" stop-opacity="0.24"/>
      <stop offset="100%" stop-color="${card.dark}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="paper" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff3d0"/>
      <stop offset="42%" stop-color="#d9b76d"/>
      <stop offset="100%" stop-color="${card.dark}"/>
    </linearGradient>
  </defs>
  <rect width="420" height="630" rx="30" fill="${card.dark}"/>
  <rect x="18" y="18" width="384" height="594" rx="22" fill="url(#paper)" opacity="0.9"/>
  <rect x="28" y="28" width="364" height="574" rx="18" fill="${card.dark}" opacity="0.86"/>
  <rect x="42" y="42" width="336" height="546" rx="14" fill="none" stroke="${card.color}" stroke-width="2.4" opacity="0.72"/>
  <rect x="58" y="58" width="304" height="514" rx="8" fill="none" stroke="#fff3c4" stroke-width="1" opacity="0.34"/>
  <circle cx="210" cy="250" r="154" fill="url(#halo)"/>
  <path d="M82 435 C132 360 156 280 ${cx} ${cy} C262 306 292 358 338 435" fill="none" stroke="${card.color}" stroke-width="4" opacity="${lineOpacity}"/>
  <path d="M98 458 C154 424 268 424 324 458" fill="none" stroke="#fff5cf" stroke-width="2" opacity="0.28"/>
  <circle cx="210" cy="250" r="92" fill="none" stroke="${card.color}" stroke-width="2.5" opacity="0.74"/>
  <circle cx="210" cy="250" r="62" fill="none" stroke="#fff5cf" stroke-width="1.5" opacity="0.42"/>
  <text x="210" y="275" text-anchor="middle" font-family="Georgia, serif" font-size="88" fill="${card.color}">${escapeXml(card.symbol)}</text>
  <text x="210" y="92" text-anchor="middle" font-family="Georgia, serif" font-size="20" fill="#fff2c9" letter-spacing="3">${escapeXml(card.type)}</text>
  <text x="210" y="120" text-anchor="middle" font-family="'Noto Serif SC', serif" font-size="26" fill="${card.color}" font-weight="700">${escapeXml(card.nameCn)}</text>
  <text x="210" y="515" text-anchor="middle" font-family="Georgia, serif" font-size="22" fill="#fff2c9">${escapeXml(card.nameEn)}</text>
  <text x="210" y="548" text-anchor="middle" font-family="Georgia, serif" font-size="16" fill="${card.color}" letter-spacing="4">${escapeXml(card.label)}</text>
  <g opacity="0.58" fill="${card.color}">
    <circle cx="94" cy="94" r="4"/>
    <circle cx="326" cy="94" r="4"/>
    <circle cx="94" cy="536" r="4"/>
    <circle cx="326" cy="536" r="4"/>
  </g>
  <g opacity="0.08" stroke="#fff6d1" stroke-width="1">
    <path d="M60 160 H360"/>
    <path d="M60 472 H360"/>
    <path d="M126 58 V572"/>
    <path d="M294 58 V572"/>
  </g>
</svg>`;
};

const outputDir = join(process.cwd(), 'public', 'cards');
await mkdir(outputDir, { recursive: true });

await Promise.all(
  cards.map((card, index) => writeFile(join(outputDir, `${slugify(card.nameEn)}.svg`), makeSvg(card, index), 'utf8')),
);

console.log(`Generated ${cards.length} tarot card images.`);
