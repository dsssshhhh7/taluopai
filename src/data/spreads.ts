import type { SpreadConfig } from '../types/tarot';

// 牌阵配置集中管理，后续新增凯尔特十字等牌阵时只需要扩展这里。
export const spreads: SpreadConfig[] = [
  {
    id: 'single',
    name: '单张牌',
    description: '适合每日指引、快速提问，帮助你抓住当下最重要的讯息。',
    positions: ['今日指引'],
  },
  {
    id: 'three',
    name: '三牌阵',
    description: '从时间线理解问题，观察过去、现在与未来之间的流动。',
    positions: ['过去', '现在', '未来'],
  },
  {
    id: 'hexagram',
    name: '六芒星牌阵',
    description: '适合更完整地审视一个问题，包含阻碍、潜意识与建议。',
    positions: ['问题核心', '阻碍', '潜意识', '过去影响', '未来趋势', '建议'],
  },
];

export const getSpreadById = (id: SpreadConfig['id']) =>
  spreads.find((spread) => spread.id === id) ?? spreads[0];
