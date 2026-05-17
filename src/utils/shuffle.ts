import type { DrawnCard, Orientation, SpreadConfig, TarotCardData } from '../types/tarot';

// Fisher-Yates 洗牌算法，返回新数组，避免修改原始牌组数据。
export const shuffleDeck = <T,>(items: T[]): T[] => {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
};

const randomOrientation = (): Orientation => (Math.random() > 0.5 ? 'upright' : 'reversed');

// 每次抽牌前都会先洗牌，再按当前牌阵需要的数量取牌。
export const drawCards = (deck: TarotCardData[], spread: SpreadConfig): DrawnCard[] =>
  shuffleDeck(deck)
    .slice(0, spread.positions.length)
    .map((card, index) => ({
      card,
      orientation: randomOrientation(),
      position: spread.positions[index],
      isRevealed: false,
    }));
