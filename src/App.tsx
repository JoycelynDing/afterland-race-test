import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Compass, RefreshCw, ChevronRight, Moon, Sun } from 'lucide-react';
import { QUIZ_DATA, Option } from './constants';
import pageBackground from './assets/afterland-reading-table.jpg';

type AppState = 'intro' | 'quiz' | 'result';

export default function App() {
  const [step, setStep] = useState<AppState>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({
    "天狼族": 0, "林狲族": 0, "鲸族": 0, "翼族": 0, "金族": 0, "魑族": 0, "血族": 0, "Silens_counter": 0
  });
  const [history, setHistory] = useState<{ index: number, scores: Record<string, number> }[]>([]);

  const handleStart = () => {
    setStep('quiz');
    setCurrentIdx(0);
    setScores({
      "天狼族": 0, "林狲族": 0, "鲸族": 0, "翼族": 0, "金族": 0, "魑族": 0, "血族": 0, "Silens_counter": 0
    });
    setHistory([]);
  };

  const handleSelect = (option: Option) => {
    // Save state to history
    setHistory(prev => [...prev, { index: currentIdx, scores: { ...scores } }]);

    const newScores = { ...scores };
    Object.entries(option.score).forEach(([race, value]) => {
      newScores[race] = (newScores[race] || 0) + value;
    });
    setScores(newScores);

    if (currentIdx < QUIZ_DATA.questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setStep('result');
    }
  };

  const handleBack = () => {
    if (history.length === 0) return;
    const lastState = history[history.length - 1];
    setCurrentIdx(lastState.index);
    setScores(lastState.scores);
    setHistory(prev => prev.slice(0, -1));
  };

  const finalRace = useMemo(() => {
    if (step !== 'result') return '';

    // Check Silens threshold
    const silensThreshold = QUIZ_DATA.test_metadata.scoring_logic.silens_trigger_threshold;
    if (scores["Silens_counter"] >= silensThreshold) {
      return "Silens";
    }

    // Filter out counter
    const raceScores = Object.entries(scores).filter(([k]) => k !== "Silens_counter");
    
    // Find max score
    const scoresList = raceScores.map(([, v]) => v) as number[];
    const maxScore = scoresList.length > 0 ? Math.max(...scoresList) : 0;
    const winners = raceScores.filter(([, v]) => v === maxScore).map(([k]) => k);

    // Tie breaker
    if (winners.length > 1 && QUIZ_DATA.test_metadata.scoring_logic.tie_breaker === 'random') {
      return winners[Math.floor(Math.random() * winners.length)];
    }

    return winners[0] || '未知种族';
  }, [step, scores]);

  const progressMessage = useMemo(() => {
    const progress = currentIdx + 1;
    if (progress >= 18) return "保持最初的直觉。";
    if (progress >= 12) return "继续选择吧 拼凑属于你的林魂";
    if (progress >= 5) return "即将加入后土世界";
    return "灵魂构建中……";
  }, [currentIdx]);

  const totalQuestions = QUIZ_DATA.test_metadata.total_questions;
  const progressRatio = (currentIdx + 1) / totalQuestions;
  const progressPercent = Math.round(progressRatio * 100);
  const activeDot = Math.min(7, Math.floor(currentIdx / (totalQuestions / 8)));
  const currentQuestion = QUIZ_DATA.questions[currentIdx];
  const isIntroStep = step === 'intro';
  const isQuizStep = step === 'quiz';
  const hasCenteredShell = isIntroStep || isQuizStep;
  const shellClassName = hasCenteredShell
    ? 'relative z-10 mx-auto flex min-h-[calc(100vh-2rem)] w-full items-center justify-center sm:min-h-[calc(100vh-3rem)] md:min-h-[calc(100vh-5rem)]'
    : 'relative z-10 mx-auto flex w-full justify-center md:min-h-[calc(100vh-5rem)] md:items-center';
  const pageBackgroundStyle = {
    backgroundImage: `linear-gradient(180deg, rgba(17, 10, 6, 0.84) 0%, rgba(44, 26, 15, 0.56) 38%, rgba(17, 10, 6, 0.84) 100%), url(${pageBackground})`,
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
  };

  return (
    <div
      className="relative min-h-screen overflow-x-hidden px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-10"
      style={pageBackgroundStyle}
    >
      <>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(249,220,156,0.16),transparent_30%),radial-gradient(circle_at_bottom,rgba(31,17,10,0.62),transparent_44%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(16,9,6,0.38)_0%,transparent_16%,transparent_84%,rgba(16,9,6,0.4)_100%)]" />
      </>

      <div className={shellClassName}>
        <AnimatePresence mode="wait">
          {step === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="archive-container archive-container--immersive flex min-h-[500px] w-full max-w-[900px] flex-col items-center justify-center px-5 py-14 text-center sm:px-8 sm:py-16 md:min-h-[600px] md:px-10 md:py-20"
            >
              <Moon className="absolute left-5 top-5 h-5 w-5 text-ink opacity-20 sm:left-8 sm:top-8 sm:h-6 sm:w-6" />
              <Sun className="absolute right-5 top-5 h-5 w-5 text-ink opacity-20 sm:right-8 sm:top-8 sm:h-6 sm:w-6" />
              <Moon className="absolute bottom-5 left-5 h-5 w-5 -rotate-90 text-ink opacity-20 sm:bottom-8 sm:left-8 sm:h-6 sm:w-6" />
              <Sun className="absolute bottom-5 right-5 h-5 w-5 text-ink opacity-20 sm:bottom-8 sm:right-8 sm:h-6 sm:w-6" />

              <div className="relative z-10 flex w-full max-w-xl flex-col items-center gap-8 sm:gap-10">
                <div className="space-y-5 px-2">
                  <h1 className="font-display text-3xl leading-tight tracking-[0.22em] text-ink uppercase sm:text-4xl md:text-5xl">
                    {QUIZ_DATA.test_metadata.title}
                  </h1>
                  <p className="font-serif text-base leading-relaxed text-ink/80 md:text-lg">
                    欢迎来到后土世界的边界。为了让你在后土世界中找到最契合的种族，我们需要确认你灵魂的底色。
                  </p>
                  <p className="font-serif text-sm italic opacity-60">
                    请抛开既定的期待，跟随最直觉的判断。
                  </p>
                </div>

                <motion.button
                  onClick={handleStart}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mystic-button flex items-center gap-2"
                >
                  开启测试
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="archive-container archive-container--immersive relative flex min-h-[620px] w-full max-w-[900px] flex-col px-5 py-6 sm:px-8 sm:py-8 md:min-h-[700px] md:px-12 md:py-10"
            >
              <Sparkles className="absolute left-5 top-5 h-4 w-4 text-ink opacity-10 sm:left-6 sm:top-6" />
              <Sparkles className="absolute right-5 top-5 h-4 w-4 text-ink opacity-10 sm:right-6 sm:top-6" />
              <Moon className="absolute bottom-5 left-5 h-4 w-4 rotate-45 text-ink opacity-10 sm:bottom-6 sm:left-6" />

              <div className="relative z-10 flex h-full flex-col">
                <div className="w-full border-b border-ink/5 pb-5 sm:pb-6 md:pb-8">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-h-6 items-center">
                      {history.length > 0 && (
                        <button
                          onClick={handleBack}
                          className="inline-flex w-fit items-center gap-1 text-[11px] text-ink/40 transition-colors hover:text-ink sm:text-xs"
                        >
                          <ChevronRight className="h-3 w-3 rotate-180" />
                          <span className="font-serif italic">上一决策</span>
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col items-start gap-2 sm:items-end">
                      <span className="font-serif text-[10px] font-bold uppercase tracking-[0.3em] text-ink/40 md:text-xs">
                        第 {currentIdx + 1} / {totalQuestions} 题 · 进度 {progressPercent}%
                      </span>
                      <div className="relative h-1.5 w-[150px] overflow-hidden rounded-full bg-ink/5 sm:w-[180px]">
                        <motion.div
                          className="h-full rounded-full bg-ink/40"
                          initial={false}
                          animate={{ width: `${progressRatio * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 max-w-2xl font-serif text-xs italic tracking-[0.12em] text-ink/45 sm:text-sm">
                    {progressMessage}
                  </p>
                </div>

                <div className="flex flex-1 flex-col justify-center py-6 md:py-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentIdx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="flex flex-col gap-8 md:gap-10"
                    >
                      <h3 className="font-serif text-xl leading-relaxed text-ink/90 sm:text-2xl md:text-3xl">
                        {currentQuestion.text}
                      </h3>

                      <div className="flex w-full flex-col gap-2.5 md:gap-4">
                        {currentQuestion.options.map((option, i) => (
                          <motion.button
                            key={i}
                            onClick={() => handleSelect(option)}
                            className="option-card option-card--quiz"
                            whileTap={{ x: 5 }}
                          >
                            <span className="min-w-0 flex-1 text-left font-serif text-base leading-relaxed text-ink/80 md:text-lg">
                              {option.text}
                            </span>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="w-full border-t border-ink/5 pt-5 sm:pt-6">
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: Math.min(totalQuestions, 8) }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 w-1.5 rounded-full ${activeDot === i ? 'bg-ink' : 'bg-ink/10'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="archive-container archive-container--immersive relative flex w-full max-w-[950px] flex-col items-center px-5 py-6 sm:px-6 sm:py-8 md:px-14 md:py-14"
            >
              <Sun className="absolute left-5 top-5 h-5 w-5 text-ink opacity-10 sm:left-6 sm:top-6" />
              <Moon className="absolute right-5 top-5 h-5 w-5 text-ink opacity-10 sm:right-6 sm:top-6" />
              <Sparkles className="absolute bottom-5 left-5 h-5 w-5 text-ink opacity-10 sm:bottom-6 sm:left-6" />
              <Sparkles className="absolute bottom-5 right-5 h-5 w-5 text-ink opacity-10 sm:bottom-6 sm:right-6" />

              <div className="pointer-events-none absolute inset-4 rounded-[1.75rem] border border-ink/5 sm:inset-6 sm:rounded-[2rem]" />

              <div className="relative z-10 flex w-full flex-col items-center">
                <div className="w-full max-w-4xl space-y-10 py-4 sm:space-y-12 sm:py-6">
                  <div className="border-b border-ink/5 pb-10 text-center sm:pb-12">
                    <h3 className="mb-4 font-display text-[10px] uppercase tracking-[0.3em] opacity-40 md:text-sm">
                      解析完毕，您的血脉为
                    </h3>
                    <motion.h2
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 1 }}
                      className="mb-6 font-display text-4xl text-ink sm:text-5xl md:text-8xl"
                    >
                      {finalRace}
                    </motion.h2>
                    <p className="px-2 font-serif text-lg italic leading-relaxed text-ink/60 sm:px-4 md:text-2xl">
                      “{QUIZ_DATA.race_analyses[finalRace]?.tagline}”
                    </p>
                  </div>

                  <div className="space-y-10 sm:space-y-12">
                    <section>
                      <h4 className="mb-4 flex items-center gap-3 font-display text-[10px] uppercase tracking-widest text-ink/30 md:text-xs">
                        <span className="h-[1px] w-6 bg-ink/10" /> 核心人格
                      </h4>
                      <p className="font-serif text-xl font-medium leading-relaxed text-ink/90 md:text-3xl">
                        {QUIZ_DATA.race_analyses[finalRace]?.core}
                      </p>
                    </section>

                    <section className="border-l-[1px] border-ink/20 bg-black/5 p-5 sm:p-6 md:p-10">
                      <h4 className="mb-4 font-display text-[10px] uppercase tracking-widest text-ink/30 md:text-xs">性格解析</h4>
                      <p className="font-serif text-base leading-relaxed text-ink/70 text-justify md:text-xl md:leading-loose">
                        {QUIZ_DATA.race_analyses[finalRace]?.personality}
                      </p>
                    </section>

                    <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
                      <section>
                        <h4 className="mb-4 font-display text-[10px] uppercase tracking-widest text-ink/30 md:text-xs">底层驱动</h4>
                        <p className="font-serif text-base italic leading-relaxed text-ink/60 md:text-xl">
                          {QUIZ_DATA.race_analyses[finalRace]?.drive}
                        </p>
                      </section>
                      <section>
                        <h4 className="mb-4 font-display text-[10px] uppercase tracking-widest text-ink/30 md:text-xs">天赋与局限</h4>
                        <ul className="space-y-4 font-serif text-base md:text-lg">
                          <li className="flex items-start gap-3">
                            <span className="mt-2 text-xs text-ink/20">○</span>
                            <span className="text-ink/70">
                              <strong className="font-medium tracking-wide text-ink/90">优势 / </strong>
                              {QUIZ_DATA.race_analyses[finalRace]?.pros}
                            </span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="mt-2 text-xs text-ink/20">○</span>
                            <span className="text-ink/70">
                              <strong className="font-medium tracking-wide text-ink/90">劣势 / </strong>
                              {QUIZ_DATA.race_analyses[finalRace]?.cons}
                            </span>
                          </li>
                        </ul>
                      </section>
                    </div>

                    <section className="border-t border-ink/5 pt-8 opacity-80">
                      <div className="flex items-start gap-4 p-4 italic sm:p-6">
                        <div className="mt-1 shrink-0">
                          <Compass className="h-6 w-6 text-ink/20" />
                        </div>
                        <div>
                          <h4 className="mb-2 font-display text-[9px] uppercase tracking-widest text-ink/30 md:text-[10px]">予旅行者的真名指引</h4>
                          <p className="font-serif text-base leading-relaxed text-ink/50 md:text-xl">
                            {QUIZ_DATA.race_analyses[finalRace]?.advice}
                          </p>
                        </div>
                      </div>
                    </section>

                    <div className="border-t border-ink/5 pt-10 text-center sm:pt-12">
                      <button
                        onClick={handleStart}
                        className="group inline-flex items-center gap-2 p-4 font-serif text-xs uppercase tracking-[0.3em] text-ink/40 transition-all hover:text-ink"
                      >
                        <RefreshCw className="h-4 w-4 transition-transform duration-700 group-hover:rotate-180" />
                        再次测试
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
