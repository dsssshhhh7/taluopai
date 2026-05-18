import { useMemo, useRef, useState } from 'react';
import { RotateCcw, Sparkle } from 'lucide-react';
import { CardCarousel } from './components/CardCarousel';
import { Header } from './components/Header';
import { QuestionInput } from './components/QuestionInput';
import { ReadingResult } from './components/ReadingResult';
import { SpreadSelector } from './components/SpreadSelector';
import { tarotDeck } from './data/tarotDeck';
import { getSpreadById, spreads } from './data/spreads';
import type { DrawnCard, Orientation, SpreadType, TarotCardData } from './types/tarot';
import { shuffleDeck } from './utils/shuffle';

const guideTexts = [
  '请静下心来，听从内在的声音。',
  '答案不在牌中，而在你如何理解它。',
  '命运给出的不是结论，而是方向。',
  '先允许问题存在，答案才会慢慢靠近。',
  '看见当下，就是改变的开始。',
];

const randomOrientation = (): Orientation => (Math.random() > 0.5 ? 'upright' : 'reversed');

function App() {
  const [question, setQuestion] = useState('');
  const [selectedSpreadId, setSelectedSpreadId] = useState<SpreadType>('single');
  const [previewDeck, setPreviewDeck] = useState(() => shuffleDeck(tarotDeck));
  const [selectedCards, setSelectedCards] = useState<DrawnCard[]>([]);
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [guideText, setGuideText] = useState(guideTexts[0]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

  const summaryScrollTimerRef = useRef<number | null>(null);
  const selectedSpread = useMemo(() => getSpreadById(selectedSpreadId), [selectedSpreadId]);
  const requiredCount = selectedSpread.cardCount;

  const resetReadingState = () => {
    setSelectedCards([]);
    setDrawnCards([]);
    setGuideText(guideTexts[Math.floor(Math.random() * guideTexts.length)]);
  };

  const scrollToSummary = () => {
    if (summaryScrollTimerRef.current) {
      window.clearTimeout(summaryScrollTimerRef.current);
    }

    summaryScrollTimerRef.current = window.setTimeout(() => {
      document.getElementById('reading-summary')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 180);
  };

  const handleShuffle = () => {
    setIsShuffling(true);
    setIsSelecting(false);
    setPreviewDeck(shuffleDeck(tarotDeck));
    resetReadingState();
    window.setTimeout(() => setIsShuffling(false), 780);
  };

  const handleStartSelecting = () => {
    if (!question.trim()) return;

    setIsShuffling(true);
    setIsSelecting(false);
    resetReadingState();

    window.setTimeout(() => {
      setPreviewDeck(shuffleDeck(tarotDeck));
      setIsShuffling(false);
      setIsSelecting(true);
    }, 820);
  };

  const handleSpreadChange = (spreadId: SpreadType) => {
    setSelectedSpreadId(spreadId);
    setIsSelecting(false);
    resetReadingState();
  };

  const handleDrawMoment = (card: TarotCardData) => {
    if (!isSelecting || selectedCards.some((item) => item.card.id === card.id)) return;

    const nextIndex = selectedCards.length;
    const nextSelectedCards: DrawnCard[] = [
      ...selectedCards,
      {
        card,
        orientation: randomOrientation(),
        position: selectedSpread.positions[nextIndex],
        isRevealed: true,
      },
    ];

    setSelectedCards(nextSelectedCards);

    if (nextSelectedCards.length === requiredCount) {
      window.setTimeout(() => {
        setDrawnCards(nextSelectedCards);
        setIsSelecting(false);
        scrollToSummary();
      }, 720);
    }
  };

  const handleReveal = (index: number) => {
    setDrawnCards((cards) =>
      cards.map((item, itemIndex) => (itemIndex === index ? { ...item, isRevealed: true } : item)),
    );
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="page-texture" aria-hidden="true" />
      <Header />

      <section className="mx-auto max-w-7xl px-4 pb-10 pt-8 sm:pt-12 lg:px-8">
        <div className="mb-8">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[rgb(var(--color-accent-rgb)/0.35)] bg-[rgb(var(--color-panel-rgb)/0.58)] px-4 py-2 text-sm text-[var(--color-muted)]">
            <Sparkle size={15} aria-hidden="true" />
            78 张完整塔罗牌组 · 8 种牌阵
          </p>
          <h2 className="font-display text-4xl font-semibold leading-tight sm:text-6xl">
            在牌面翻开前，
            <span className="text-[var(--color-accent)]">先听见自己。</span>
          </h2>
        </div>

        <SpreadSelector spreads={spreads} selectedSpreadId={selectedSpreadId} onSelect={handleSpreadChange} />

        <QuestionInput
          value={question}
          isShuffling={isShuffling}
          onChange={setQuestion}
          onStart={handleStartSelecting}
        />

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
          <div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                data-testid="shuffle-button"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-[rgb(var(--color-line-rgb)/0.75)] px-5 font-medium transition hover:border-[rgb(var(--color-accent-rgb)/0.75)]"
                onClick={handleShuffle}
              >
                <RotateCcw size={18} aria-hidden="true" />
                重新洗牌
              </button>
            </div>

            {drawnCards.length > 0 ? (
              <ReadingResult
                cards={drawnCards}
                spread={selectedSpread}
                question={question.trim()}
                guideText={guideText}
                onReveal={handleReveal}
              />
            ) : (
              <CardCarousel
                deck={previewDeck}
                selectedCards={selectedCards}
                requiredCount={requiredCount}
                isActive={isSelecting}
                isShuffling={isShuffling}
                onDraw={handleDrawMoment}
              />
            )}
          </div>

          <aside className="rounded-lg border border-[rgb(var(--color-line-rgb)/0.66)] bg-[rgb(var(--color-panel-rgb)/0.68)] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-xl font-semibold">{selectedSpread.name}</h3>
                <p className="mt-1 text-xs text-[var(--color-accent)]">{selectedSpread.cardCount} 张牌</p>
              </div>
              <span className="rounded-full bg-[rgb(var(--color-accent-rgb)/0.14)] px-3 py-1 text-xs text-[var(--color-accent)]">
                当前牌阵
              </span>
            </div>

            <p className="mt-4 text-sm leading-6 text-[var(--color-muted)]">{selectedSpread.description}</p>
            <div className="mt-5">
              <p className="text-sm font-semibold">适用范围</p>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{selectedSpread.suitableFor}</p>
            </div>

            {selectedSpread.modes && (
              <div className="mt-5">
                <p className="text-sm font-semibold">支持解释模式</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedSpread.modes.map((mode) => (
                    <span
                      key={mode}
                      className="rounded-full bg-[rgb(var(--color-soft-rgb)/0.62)] px-3 py-1 text-xs text-[var(--color-muted)]"
                    >
                      {mode}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5">
              <p className="text-sm font-semibold">牌位含义</p>
              <div className="mt-3 grid gap-2">
                {selectedSpread.positions.map((item) => (
                  <div key={item.index} className="rounded-md bg-[rgb(var(--color-soft-rgb)/0.62)] px-3 py-2 text-sm">
                    <div className="flex items-center gap-3">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[rgb(var(--color-accent-rgb)/0.16)] text-xs text-[var(--color-accent)]">
                        {item.index}
                      </span>
                      <span>{item.name}</span>
                    </div>
                    <p className="mt-1 pl-9 text-xs leading-5 text-[var(--color-muted)]">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <p className="text-sm font-semibold">问题示例</p>
              <ul className="mt-2 space-y-2 text-sm leading-6 text-[var(--color-muted)]">
                {selectedSpread.examples.map((example) => (
                  <li key={example}>· {example}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        {isShuffling && (
          <div className="pointer-events-none fixed inset-x-0 bottom-8 z-40 mx-auto w-fit rounded-full border border-[rgb(var(--color-accent-rgb)/0.42)] bg-[rgb(var(--color-panel-rgb)/0.88)] px-5 py-3 text-sm shadow-glow backdrop-blur">
            正在洗牌...
          </div>
        )}
      </section>

      <footer className="border-t border-[rgb(var(--color-line-rgb)/0.5)] px-4 py-6 text-center text-sm text-[var(--color-muted)]">
        塔罗结果仅供娱乐与自我探索参考
      </footer>
    </main>
  );
}

export default App;
