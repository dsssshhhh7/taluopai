import { useMemo, useRef, useState } from 'react';
import { RotateCcw, Sparkle, WandSparkles } from 'lucide-react';
import { Header } from './components/Header';
import { ReadingResult } from './components/ReadingResult';
import { SpreadSelector } from './components/SpreadSelector';
import { TarotCard } from './components/TarotCard';
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
  const [selectedSpreadId, setSelectedSpreadId] = useState<SpreadType>('single');
  const [previewDeck, setPreviewDeck] = useState(() => shuffleDeck(tarotDeck));
  const [selectedCards, setSelectedCards] = useState<DrawnCard[]>([]);
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [guideText, setGuideText] = useState(guideTexts[0]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const shuffleAudioRef = useRef<HTMLAudioElement | null>(null);
  const flipAudioRef = useRef<HTMLAudioElement | null>(null);
  const selectedSpread = useMemo(() => getSpreadById(selectedSpreadId), [selectedSpreadId]);
  const requiredCount = selectedSpread.positions.length;

  const playSound = (type: 'shuffle' | 'flip') => {
    if (!soundEnabled) return;

    const audioRef = type === 'shuffle' ? shuffleAudioRef : flipAudioRef;
    audioRef.current?.pause();
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      // 占位音频不存在时浏览器会拒绝播放，catch 可避免影响抽牌流程。
      void audioRef.current.play().catch(() => undefined);
    }
  };

  const resetReadingState = () => {
    setSelectedCards([]);
    setDrawnCards([]);
    setGuideText(guideTexts[Math.floor(Math.random() * guideTexts.length)]);
  };

  const handleShuffle = () => {
    setIsShuffling(true);
    setIsSelecting(false);
    setPreviewDeck(shuffleDeck(tarotDeck));
    resetReadingState();
    playSound('shuffle');
    window.setTimeout(() => setIsShuffling(false), 780);
  };

  const handleStartSelecting = () => {
    setIsShuffling(true);
    setIsSelecting(false);
    resetReadingState();
    playSound('shuffle');

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

  const handleSelectCard = (card: TarotCardData) => {
    if (!isSelecting || selectedCards.some((item) => item.card.id === card.id)) return;

    const nextIndex = selectedCards.length;
    const nextSelectedCards = [
      ...selectedCards,
      {
        card,
        orientation: randomOrientation(),
        position: selectedSpread.positions[nextIndex],
        isRevealed: false,
      },
    ];

    setSelectedCards(nextSelectedCards);
    playSound('flip');

    // 选满后稍作停顿，让最后一张牌的选中特效完整出现，再进入翻牌结果区。
    if (nextSelectedCards.length === requiredCount) {
      window.setTimeout(() => {
        setDrawnCards(nextSelectedCards);
        setIsSelecting(false);
      }, 620);
    }
  };

  const handleReveal = (index: number) => {
    playSound('flip');
    setDrawnCards((cards) =>
      cards.map((item, itemIndex) => (itemIndex === index ? { ...item, isRevealed: true } : item)),
    );
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <audio ref={shuffleAudioRef} src="./sounds/shuffle.mp3" preload="none" />
      <audio ref={flipAudioRef} src="./sounds/flip.mp3" preload="none" />

      <div className="page-texture" aria-hidden="true" />
      <Header soundEnabled={soundEnabled} onToggleSound={() => setSoundEnabled((value) => !value)} />

      <section className="mx-auto max-w-7xl px-4 pb-10 pt-8 sm:pt-12 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
          <div>
            <div className="mb-8">
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[rgb(var(--color-accent-rgb)/0.35)] bg-[rgb(var(--color-panel-rgb)/0.58)] px-4 py-2 text-sm text-[var(--color-muted)]">
                <Sparkle size={15} aria-hidden="true" />
                78 张完整塔罗牌组
              </p>
              <h2 className="font-display text-4xl font-semibold leading-tight sm:text-6xl">
                在牌面翻开前，
                <span className="text-[var(--color-accent)]">先听见自己。</span>
              </h2>
            </div>

            <SpreadSelector spreads={spreads} selectedSpreadId={selectedSpreadId} onSelect={handleSpreadChange} />

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                data-testid="shuffle-button"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-[rgb(var(--color-line-rgb)/0.75)] px-5 font-medium transition hover:border-[rgb(var(--color-accent-rgb)/0.75)]"
                onClick={handleShuffle}
              >
                <RotateCcw size={18} aria-hidden="true" />
                重新洗牌
              </button>
              <button
                type="button"
                data-testid="start-selecting-button"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 font-semibold text-[var(--color-accent-text)] shadow-glow transition hover:brightness-110"
                onClick={handleStartSelecting}
              >
                <WandSparkles size={18} aria-hidden="true" />
                洗牌并选取{selectedSpread.name}
              </button>
            </div>
          </div>

          <aside className="rounded-lg border border-[rgb(var(--color-line-rgb)/0.66)] bg-[rgb(var(--color-panel-rgb)/0.68)] p-5">
            <h3 className="font-display text-xl font-semibold">当前牌阵</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{selectedSpread.description}</p>
            <div className="mt-4 grid gap-2">
              {selectedSpread.positions.map((position, index) => (
                <div
                  key={position}
                  className="flex items-center gap-3 rounded-md bg-[rgb(var(--color-soft-rgb)/0.62)] px-3 py-2 text-sm"
                >
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-[rgb(var(--color-accent-rgb)/0.16)] text-xs text-[var(--color-accent)]">
                    {index + 1}
                  </span>
                  {position}
                </div>
              ))}
            </div>
          </aside>
        </div>

        {drawnCards.length > 0 ? (
          <ReadingResult cards={drawnCards} spreadId={selectedSpreadId} guideText={guideText} onReveal={handleReveal} />
        ) : (
          <section className="mt-10">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="font-display text-2xl font-semibold">
                  {isSelecting ? `请亲手选择 ${requiredCount} 张牌` : '完整牌组'}
                </h3>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  {isSelecting
                    ? `已选择 ${selectedCards.length} / ${requiredCount}。选中的牌会带着光环进入你的牌阵。`
                    : '这里展示完整塔罗牌组。开始选牌后，牌面会翻为牌背，由你亲手完成抽牌。'}
                </p>
              </div>
              <span className="text-sm text-[var(--color-muted)]">{tarotDeck.length} / 78</span>
            </div>

            <div className={`deck-grid ${isShuffling ? 'is-shuffling' : ''} ${isSelecting ? 'selecting-mode' : ''}`}>
              {previewDeck.map((card) => {
                const isSelected = selectedCards.some((item) => item.card.id === card.id);
                const selectionFull = selectedCards.length >= requiredCount;

                return (
                  <TarotCard
                    key={card.id}
                    previewCard={card}
                    compact
                    showBackOnly={isSelecting}
                    isSelected={isSelected}
                    disabled={isSelecting && (isSelected || selectionFull)}
                    onSelect={isSelecting ? () => handleSelectCard(card) : undefined}
                  />
                );
              })}
            </div>
          </section>
        )}

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
