'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { CheckCircle, XCircle, ArrowRight, Zap, BookOpen, AlignLeft, ToggleLeft, List, Edit3, Info } from 'lucide-react';
import type { Exercise } from '@/lib/exercise-generator';
import SpeakingExercise from './SpeakingExercise';
import EnhancedSpeakingExercise from './EnhancedSpeakingExercise';
import WordSearchExercise from './exercises/WordSearchExercise';
import CrosswordExercise from './exercises/CrosswordExercise';
import InteractiveDialogueExercise from './exercises/InteractiveDialogueExercise';
// Lazy: framer-motion en estos componentes causaba createContext/hydration en curso-b1
const FlashcardExercise = dynamic(() => import('./exercises/FlashcardExercise').then((m) => m.default), { ssr: false, loading: () => <div className="animate-pulse h-48 rounded-2xl bg-slate-100" /> });
const DragDropExercise = dynamic(() => import('./exercises/DragDropExercise').then((m) => m.default), { ssr: false, loading: () => <div className="animate-pulse h-48 rounded-2xl bg-slate-100" /> });
const MatchingExercise = dynamic(() => import('./exercises/MatchingExercise').then((m) => m.default), { ssr: false, loading: () => <div className="animate-pulse h-48 rounded-2xl bg-slate-100" /> });
import Markdown from './course/Markdown';
import { TranslatedText, TRANSLATION_TOOLTIP_SPACING } from './course/exercises/TranslatedText';
import { AudioPlayer } from './course/preview/AudioPlayer';
import { resolveListeningScript } from '@/lib/listening-script';
import { useGamification } from '@/lib/hooks/use-gamification';
import SpeakButton from './SpeakButton';
import {
  applyCourseBilingualText,
  applyCourseQuestionBilingual,
  shouldExpandWordPairsForExercise,
} from '@/lib/course/course-bilingual';
import { stripBilingualMarkupEs } from '@/lib/premium-utils';

interface ExerciseRendererProps {
  exercise: Exercise;
  vocabulary?: any[];
  onComplete: (result?: { success: boolean; score: number }) => void;
}

function resolvePublicAudioUrl(url?: string | null): string {
  if (!url) return '';
  return url.startsWith('/') ? url : `/${url}`;
}

const TYPE_LABELS: Record<string, { label: string; icon: typeof BookOpen }> = {
  'multiple-choice': { label: 'Opción múltiple', icon: List },
  'true-false': { label: 'Verdadero / Falso', icon: ToggleLeft },
  'fill-blank': { label: 'Completa la frase', icon: Edit3 },
  'reading': { label: 'Comprensión lectora', icon: BookOpen },
  'reading-comprehension': { label: 'Comprensión lectora', icon: BookOpen },
  'listening': { label: 'Comprensión auditiva', icon: BookOpen },
  'listening-comprehension': { label: 'Comprensión auditiva', icon: BookOpen },
  'spelling': { label: 'Deletreo', icon: Edit3 },
  'sentence-building': { label: 'Construye la frase', icon: Edit3 },
  'writing': { label: 'Escritura', icon: Edit3 },
  'default': { label: 'Ejercicio', icon: AlignLeft },
};

// Diseño homogéneo: un solo tema slate + coral para toda la tarjeta de ejercicio
const UNIFIED_BADGE = 'bg-slate-100 text-slate-600 border-slate-200';
const UNIFIED_BORDER = 'border-slate-300';
const TYPE_THEMES: Record<string, { badge: string; border: string; ring: string }> = {
  'multiple-choice': { badge: UNIFIED_BADGE, border: UNIFIED_BORDER, ring: 'ring-slate-200' },
  'true-false':      { badge: UNIFIED_BADGE, border: UNIFIED_BORDER, ring: 'ring-slate-200' },
  'fill-blank':      { badge: UNIFIED_BADGE, border: UNIFIED_BORDER, ring: 'ring-slate-200' },
  'reading':         { badge: UNIFIED_BADGE, border: UNIFIED_BORDER, ring: 'ring-slate-200' },
  'reading-comprehension': { badge: UNIFIED_BADGE, border: UNIFIED_BORDER, ring: 'ring-slate-200' },
  'listening':       { badge: UNIFIED_BADGE, border: UNIFIED_BORDER, ring: 'ring-slate-200' },
  'listening-comprehension': { badge: UNIFIED_BADGE, border: UNIFIED_BORDER, ring: 'ring-slate-200' },
  'spelling':        { badge: UNIFIED_BADGE, border: UNIFIED_BORDER, ring: 'ring-slate-200' },
  'sentence-building': { badge: UNIFIED_BADGE, border: UNIFIED_BORDER, ring: 'ring-slate-200' },
  'writing':         { badge: UNIFIED_BADGE, border: UNIFIED_BORDER, ring: 'ring-slate-200' },
  'default':         { badge: UNIFIED_BADGE, border: UNIFIED_BORDER, ring: 'ring-slate-200' },
};

function getTypeInfo(type: string) {
  return TYPE_LABELS[type] ?? TYPE_LABELS['default'];
}

function getTypeTheme(type: string) {
  return TYPE_THEMES[type] ?? TYPE_THEMES['default'];
}

function collapseAdjacentBlankMarkers(text: string): string {
  return text.replace(/(?:_{3,})(?:\s+_{3,})+/g, '____');
}

export default function ExerciseRenderer({ exercise, vocabulary, onComplete }: ExerciseRendererProps) {
  const { completeExercise } = useGamification();
  const [userAnswer, setUserAnswer] = useState<any>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const [showFinishButton, setShowFinishButton] = useState(false);
  const [finishScore, setFinishScore] = useState(0);
  const [showReadingText, setShowReadingText] = useState(true);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [evaluation, setEvaluation] = useState<{
    isCorrect: boolean;
    score: number;
    feedback: string;
  } | null>(null);

  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  /** Si alguna pregunta del bloque fue incorrecta, el callback final debe marcar fallo (p. ej. curso A1). */
  const hadAnyIncorrectRef = useRef(false);

  const exerciseContent = exercise.content || exercise;
  // Algunos ejercicios normalizados llegan con prompt/options en la raíz,
  // mientras que los ejercicios legacy usan content.questions[].
  const questions = Array.isArray(exerciseContent.questions)
    ? exerciseContent.questions
    : Array.isArray(exerciseContent.options)
      ? [{
          question: exerciseContent.question || exerciseContent.prompt || exerciseContent.text || '',
          options: exerciseContent.options,
          correctAnswer: exerciseContent.correctAnswer ?? exerciseContent.answer,
          explanation: exerciseContent.explanation,
        }]
      : [];
  const expandWordPairs = shouldExpandWordPairsForExercise(exercise.id);

  const longFormText =
    (typeof exercise.transcript === 'string' && exercise.transcript) ||
    (typeof exerciseContent.text === 'string' && exerciseContent.text) ||
    (typeof exerciseContent.passage === 'string' && exerciseContent.passage) ||
    '';

  const isReadingExercise = (
    exercise.type === 'reading' ||
    exercise.type === 'reading-comprehension' ||
    (
      (exercise.topicName?.toLowerCase().includes('reading') ||
       exercise.topic?.toLowerCase().includes('reading')) &&
      exercise.type !== 'multiple-choice'
    ) ||
    (
      !!exercise.transcript &&
      !exercise.audioUrl &&
      (exercise.topicName?.toLowerCase().includes('reading') ||
       exercise.topic?.toLowerCase().includes('reading'))
    )
  ) && !!longFormText;

  useEffect(() => {
    setUserAnswer(null);
    setSubmitted(false);
    setIsCorrect(false);
    setShowConfetti(false);
    setShowFinishButton(false);
    setFinishScore(0);
    setEvaluation(null);
    setIsAnimating(true);
    setShowReadingText(true);
    setCurrentQuestionIdx(0);
    setExerciseCompleted(false);
    hadAnyIncorrectRef.current = false;

    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [exercise.id]);

  const stripTags = (s: string) => s.replace(/\[\[(.*?)\|(.*?)\]\]/g, '$1');

  const buildFallbackExplanation = (q: any, ex: typeof exercise): string => {
    const correct = q.correctAnswer ?? q.answer;
    const type = q.type ?? ex.type;
    const topic = ex.topic ?? ex.topicName ?? '';

    if (type === 'true-false') {
      const answer = String(correct).toLowerCase();
      const isTrue = answer === 'true';
      return `[[The correct answer is|La respuesta correcta es]] **[[${isTrue ? 'True' : 'False'}|${isTrue ? 'Verdadero' : 'Falso'}]]**.`;
    }

    if (type === 'multiple-choice' && q.options && Array.isArray(q.options)) {
      const idx = typeof correct === 'number' ? correct : -1;
      if (idx >= 0 && q.options[idx]) {
        const opt = q.options[idx];
        const text = typeof opt === 'string' ? opt : opt.text ?? String(opt);
        return `[[The correct answer is|La respuesta correcta es]]: **${stripTags(text)}**.`;
      }
    }

    if (correct !== undefined && correct !== null && correct !== '') {
      const display = Array.isArray(correct) ? correct[0] : correct;
      const cleaned = stripTags(String(display));
      return `[[The correct answer is|La respuesta correcta es]]: **${cleaned}**${topic ? ` ([[${topic}|${topic}]])` : ''}.`;
    }

    return '';
  };

  const normalize = (s: string): string => stripTags(s)
    .toLowerCase()
    .trim()
    .replace(/\s*[\/\\]\s*/g, ' / ')
    .replace(/\s+/g, ' ');
  const toSpanishText = (text: unknown): string => {
    if (typeof text !== 'string') return '';
    return stripBilingualMarkupEs(text).trim();
  };

  const checkMultipleChoiceCorrect = (q: any, selectedIdx: number) => {
    const correctAnswer = q.correctAnswer ?? q.answer;
    if (correctAnswer === undefined) return false;

    if (typeof correctAnswer === 'number') {
      return correctAnswer === selectedIdx;
    }

    const answers = Array.isArray(correctAnswer)
      ? correctAnswer.map((a: any) => String(a).trim())
      : [String(correctAnswer).trim()];

    for (const answer of answers) {
      if (/^[A-D]$/i.test(answer)) {
        const answerIdx = answer.toUpperCase().charCodeAt(0) - 65;
        if (answerIdx === selectedIdx) return true;
      }

      const selectedOption = q.options[selectedIdx];
      const selectedText = typeof selectedOption === 'string' ? selectedOption : selectedOption.text;

      if (normalize(answer) === normalize(selectedText)) return true;
    }

    return false;
  };

  const handleSubmit = () => {
    setSubmitted(true);

    if (exercise.type === 'open-answer') {
      setIsCorrect(true);
      setEvaluation({
        isCorrect: true,
        score: 100,
        feedback: '[[Great! Compare your answer with the example.|¡Bien! Compara tu respuesta con el ejemplo.]]',
      });
      setShowConfetti(true);
      return;
    }

    if (questions && questions.length > 0) {
      const q = questions[currentQuestionIdx];
      let correct = false;

      const qCorrectAnswer = q.correctAnswer ?? q.answer;
      if (q.type === 'true-false' || exercise.type === 'true-false') {
        correct = String(qCorrectAnswer).toLowerCase() === String(userAnswer).toLowerCase();
      } else if (q.options && Array.isArray(q.options)) {
        correct = checkMultipleChoiceCorrect(q, userAnswer);
      } else {
        const userAnswerText = typeof userAnswer === 'string' ? userAnswer : '';
        const userAnswerNormalized = normalize(userAnswerText);
        const correctAnswers = [
          ...(Array.isArray(qCorrectAnswer) ? qCorrectAnswer : [qCorrectAnswer]),
          ...(Array.isArray(q.acceptableAnswers) ? q.acceptableAnswers : (q.acceptableAnswers ? [q.acceptableAnswers] : [])),
          ...(Array.isArray(q.acceptableAlternatives) ? q.acceptableAlternatives : (q.acceptableAlternatives ? [q.acceptableAlternatives] : []))
        ].filter(Boolean).map((a: any) => normalize(String(a)));

        correct = correctAnswers.includes(userAnswerNormalized);
      }

      if (!correct) hadAnyIncorrectRef.current = true;

      setIsCorrect(correct);
      const displayCorrectAnswer = Array.isArray(qCorrectAnswer) ? qCorrectAnswer[0] : qCorrectAnswer;
      setEvaluation({
        isCorrect: correct,
        score: correct ? 100 : 0,
        feedback: correct
          ? '[[Excellent! Correct answer.|¡Excelente! Respuesta correcta.]]'
          : `[[Incorrect. The correct answer was:|Respuesta incorrecta. La respuesta correcta era:]] **${toSpanishText(String(displayCorrectAnswer))}**`,
      });

      if (correct) setShowConfetti(true);
    } else {
      let correct = false;
      if (exerciseContent.options && Array.isArray(exerciseContent.options) && userAnswer !== null) {
        correct = checkMultipleChoiceCorrect(exerciseContent, userAnswer);
      } else {
        correct = userAnswer !== null && userAnswer !== '';
      }

      if (!correct) hadAnyIncorrectRef.current = true;

      setIsCorrect(correct);
      if (correct) {
        setShowConfetti(true);
        completeExercise(exercise.id, 1, 1);
      }
    }
  };

  const handleWritingComplete = () => {
    if (!userAnswer || typeof userAnswer !== 'string' || !userAnswer.trim()) return;
    onComplete({ success: true, score: 100 });
  };

  const handleNextQuestion = () => {
    if (questions && currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setUserAnswer(null);
      setSubmitted(false);
      setEvaluation(null);
      setShowConfetti(false);
      setIsCorrect(false);
    } else {
      setExerciseCompleted(true);
      completeExercise(exercise.id, 1, 1);
      const ok = !hadAnyIncorrectRef.current;
      onComplete({ success: ok, score: ok ? 100 : 0 });
    }
  };

  const handleFinishSingle = () => {
    onComplete({ success: isCorrect, score: isCorrect ? 100 : 0 });
  };

  const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

  const renderCurrentQuestion = (q: any, qIndex: number) => {
    const rawQuestion = String(q.question || q.text || q.prompt || '');
    const normalizedQuestion = collapseAdjacentBlankMarkers(rawQuestion);
    const questionForUi = applyCourseQuestionBilingual(exercise.id, normalizedQuestion);
    return (
      <div key={qIndex} className="space-y-4">
        {/* Image */}
        {q.imageUrl && (
          <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50 flex justify-center items-center" data-testid="exercise-image-container">
            <img
              src={q.imageUrl}
              alt="Exercise visual aid"
              className="max-h-[280px] object-contain w-full block"
            />
          </div>
        )}

        <div className={`relative pl-4 border-l-4 border-slate-300 rounded-r-sm mt-1 overflow-visible ${TRANSLATION_TOOLTIP_SPACING.blockWithTranslations}`}>
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-sm font-medium text-slate-500">Responde</p>
            <SpeakButton text={questionForUi} size="sm" />
          </div>
          <div className="text-lg md:text-xl text-slate-800 font-medium leading-snug">
            <TranslatedText text={questionForUi} expandWordPairs={expandWordPairs} />
          </div>
        </div>

        {/* Audio */}
        {q.audioUrl && (
          <div>
            <AudioPlayer
              audioUrl={q.audioUrl.startsWith('/') ? q.audioUrl : `/${q.audioUrl}`}
              className="!p-3"
            />
          </div>
        )}

        {/* Opciones: margen superior obligatorio para no solapar tooltips de la pregunta */}
        <div className={`overflow-visible ${TRANSLATION_TOOLTIP_SPACING.betweenOptions} ${TRANSLATION_TOOLTIP_SPACING.blockBelow}`}>
          {/* True/False */}
          {(q.type === 'true-false' || exercise.type === 'true-false') && (
            <div className="grid grid-cols-2 gap-3">
              {['True', 'False'].map((option) => {
                const isUserAnswer = userAnswer === option;
                const isCorrectAnswer = String(q.correctAnswer ?? q.answer).toLowerCase() === option.toLowerCase();
                const showAsCorrect = submitted && isCorrectAnswer;
                const showAsIncorrect = submitted && isUserAnswer && !isCorrectAnswer;

                return (
                  <button
                    key={option}
                    onClick={() => !submitted && setUserAnswer(option)}
                    disabled={submitted}
                    className={`relative p-5 rounded-2xl border-2 font-medium text-lg text-slate-800 transition-all duration-200 active:scale-95 ${
                      showAsCorrect
                        ? 'border-green-400 bg-green-50 text-green-700 shadow-green-100 shadow-lg'
                        : showAsIncorrect
                        ? 'border-red-400 bg-red-50 text-red-700'
                        : isUserAnswer
                        ? 'border-[#FF6B6B] bg-orange-50 text-[#FF6B6B] shadow-lg shadow-orange-100 scale-[1.02]'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:scale-[1.01]'
                    } disabled:cursor-not-allowed`}
                  >
                    <span className="block text-2xl mb-1">{option === 'True' ? '✅' : '❌'}</span>
                    <TranslatedText text={option === 'True' ? '[[True|Verdadero]]' : '[[False|Falso]]'} expandWordPairs={expandWordPairs} />
                    {showAsCorrect && <CheckCircle className="absolute top-3 right-3 w-5 h-5 text-green-500" />}
                    {showAsIncorrect && <XCircle className="absolute top-3 right-3 w-5 h-5 text-red-500" />}
                  </button>
                );
              })}
            </div>
          )}

          {/* Multiple Choice (including fill-blank with options) — no mostrar para true-false para evitar doble botón */}
          {q.options && Array.isArray(q.options) && !(q.type === 'true-false' || exercise.type === 'true-false') && (
            <div className={`${TRANSLATION_TOOLTIP_SPACING.betweenOptions} overflow-visible`}>
              {q.options.map((option: any, optIndex: number) => {
                const isUserAnswer = userAnswer === optIndex;
                const isCorrectAnswer = checkMultipleChoiceCorrect(q, optIndex);
                const showAsCorrect = submitted && isCorrectAnswer;
                const showAsIncorrect = submitted && isUserAnswer && !isCorrectAnswer;
                const letter = OPTION_LETTERS[optIndex] ?? String(optIndex + 1);

                return (
                  <button
                    key={optIndex}
                    onClick={() => !submitted && setUserAnswer(optIndex)}
                    disabled={submitted}
                    className={`relative w-full text-left p-4 pb-6 rounded-2xl border-2 transition-all duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B6B] focus-visible:ring-offset-2 overflow-visible min-h-[4rem] active:scale-[0.98] ${
                      showAsCorrect
                        ? 'border-green-400 bg-green-50 shadow-sm'
                        : showAsIncorrect
                        ? 'border-red-400 bg-red-50'
                        : isUserAnswer
                        ? 'border-[#FF6B6B] bg-orange-50 shadow-md shadow-orange-100 ring-2 ring-[#FF6B6B]/30'
                        : 'border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50 hover:shadow-md'
                    } disabled:cursor-not-allowed`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-semibold text-sm flex-shrink-0 transition-colors ${
                        showAsCorrect
                          ? 'bg-green-500 text-white'
                          : showAsIncorrect
                          ? 'bg-red-500 text-white'
                          : isUserAnswer
                          ? 'bg-[#FF6B6B] text-white'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                      }`}>
                        {showAsCorrect ? <CheckCircle size={18} /> : showAsIncorrect ? <XCircle size={18} /> : letter}
                      </div>
                      <span className={`text-base font-medium flex-1 leading-snug text-slate-700 ${
                        showAsCorrect ? '!text-green-800' : showAsIncorrect ? '!text-red-800' : isUserAnswer ? 'text-slate-900' : ''
                      }`}>
                        <TranslatedText
                          text={applyCourseBilingualText(exercise.id, typeof option === 'string' ? option : option.text)}
                          expandWordPairs={expandWordPairs}
                        />
                      </span>
                      <SpeakButton text={typeof option === 'string' ? option : option.text} size="sm" className="opacity-50 hover:opacity-100" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Fill Blank / Open Cloze (only if no options and not true-false) */}
          {(q.type === 'fill-blank' || exercise.type === 'fill-blank' || exercise.type === 'open-cloze') && exercise.type !== 'true-false' && exercise.type !== 'key-word-transformation' && (!q.options || !Array.isArray(q.options)) && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-500 pl-1">
                Escribe tu respuesta
              </label>
              <div className="relative">
              <input
                type="text"
                value={userAnswer || ''}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && userAnswer && !submitted && handleSubmit()}
                disabled={submitted}
                placeholder="Escribe aquí tu respuesta…"
                className={`w-full p-5 border-2 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B6B] focus-visible:ring-offset-2 text-lg font-medium text-slate-800 transition-colors ${
                  submitted
                    ? isCorrect
                      ? 'border-green-400 bg-green-50 text-green-800'
                      : 'border-red-400 bg-red-50 text-red-800'
                    : 'border-slate-200 focus:border-[#FF6B6B] bg-white'
                }`}
              />
              {submitted && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  {isCorrect ? <CheckCircle className="w-6 h-6 text-green-500" /> : <XCircle className="w-6 h-6 text-red-500" />}
                </div>
              )}
              </div>
            </div>
          )}

          {/* Open Answer (free production — no auto-check, self-evaluate) */}
          {exercise.type === 'open-answer' && (
            <div className="space-y-3">
              {q.exampleAnswer && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-sm text-amber-800 font-medium">
                  <span className="text-amber-500 text-xs block mb-1 font-semibold uppercase tracking-wide">Ejemplo de respuesta</span>
                  {q.exampleAnswer}
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-500 pl-1">Escribe tu respuesta libremente</label>
                <textarea
                  rows={4}
                  value={userAnswer || ''}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  disabled={submitted}
                  placeholder="Escribe tu respuesta en inglés…"
                  className={`w-full p-5 border-2 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B6B] focus-visible:ring-offset-2 text-base font-medium text-slate-800 transition-colors resize-none ${
                    submitted ? 'border-blue-300 bg-blue-50 text-blue-900' : 'border-slate-200 focus:border-[#FF6B6B] bg-white'
                  }`}
                />
              </div>
              {submitted && q.exampleAnswer && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-700">
                  <span className="text-slate-400 text-xs block mb-1 font-semibold uppercase tracking-wide">Compara con el ejemplo</span>
                  {q.exampleAnswer}
                </div>
              )}
            </div>
          )}

          {/* Key-Word Transformation */}
          {exercise.type === 'key-word-transformation' && (
            <div className="space-y-3">
              {q.keyWord && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Palabra clave:</span>
                  <span className="px-3 py-1 bg-violet-100 text-violet-800 rounded-lg font-bold text-sm tracking-widest">{q.keyWord}</span>
                </div>
              )}
              {q.startOfAnswer && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-600 font-medium">
                  <span className="text-slate-400 text-xs block mb-1">Inicio de la frase:</span>
                  <TranslatedText text={applyCourseBilingualText(exercise.id, q.startOfAnswer)} expandWordPairs={expandWordPairs} />
                  &nbsp;…
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-500 pl-1">
                  Completa la transformación
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={userAnswer || ''}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && userAnswer && !submitted && handleSubmit()}
                    disabled={submitted}
                    placeholder="Escribe la frase transformada completa…"
                    className={`w-full p-5 border-2 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 text-lg font-medium text-slate-800 transition-colors ${
                      submitted
                        ? isCorrect
                          ? 'border-green-400 bg-green-50 text-green-800'
                          : 'border-red-400 bg-red-50 text-red-800'
                        : 'border-violet-200 focus:border-violet-400 bg-white'
                    }`}
                  />
                  {submitted && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      {isCorrect ? <CheckCircle className="w-6 h-6 text-green-500" /> : <XCircle className="w-6 h-6 text-red-500" />}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {!submitted && (
          <div className="pt-1">
            <button
              onClick={handleSubmit}
              disabled={userAnswer === null || userAnswer === ''}
              data-testid="confirm-button"
              className="w-full bg-gradient-to-r from-[#FF6B6B] to-[#ff5252] text-white py-4 rounded-2xl font-semibold text-base shadow-lg shadow-orange-200 hover:-translate-y-0.5 hover:shadow-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none active:scale-[0.98]"
            >
              Comprobar respuesta
            </button>
          </div>
        )}

        {submitted && !exerciseCompleted && <div className="h-40" />}

        {/* Fixed bottom feedback panel (Duolingo style) */}
        {submitted && !exerciseCompleted && evaluation && (
          <div
            className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom-4 duration-300"
          >
            <div className={`border-t-4 bg-white shadow-2xl ${evaluation.isCorrect ? 'border-green-400' : 'border-red-400'}`}>
              <div className="max-w-2xl mx-auto px-5 pt-4 pb-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${evaluation.isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                    {evaluation.isCorrect
                      ? <CheckCircle className="w-6 h-6 text-green-600" />
                      : <XCircle className="w-6 h-6 text-red-600" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-semibold text-base leading-tight ${evaluation.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                      {evaluation.isCorrect ? 'Respuesta correcta' : 'Respuesta incorrecta'}
                    </div>
                    <div className={`text-sm mt-0.5 leading-snug ${evaluation.isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                      <Markdown content={toSpanishText(evaluation.feedback)} vocabulary={vocabulary} expandWordPairs={expandWordPairs} />
                    </div>
                  </div>
                </div>

                {(() => {
                  const hasRichExplanation = q.explanation && (q.explanation.length > 20 || q.explanation.includes('[['));
                  const explanationText = applyCourseBilingualText(
                    exercise.id,
                    toSpanishText(hasRichExplanation
                      ? q.explanation
                      : buildFallbackExplanation(q, exercise))
                  );
                  return explanationText ? (
                    <div className="bg-slate-50 rounded-2xl px-4 py-3 mb-3 border border-slate-100">
                      <p className="text-sm font-medium text-slate-500 mb-1">
                        Por qué
                      </p>
                      <div className="text-sm font-normal text-slate-700 leading-relaxed">
                        <Markdown content={explanationText} vocabulary={vocabulary} expandWordPairs={expandWordPairs} />
                      </div>
                    </div>
                  ) : null;
                })()}

                <button
                  onClick={handleNextQuestion}
                  data-testid="next-button"
                  className={`w-full py-4 rounded-2xl font-semibold text-base text-white shadow-lg transition-all hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2 ${
                    evaluation.isCorrect
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-green-200'
                      : 'bg-gradient-to-r from-slate-700 to-slate-800 shadow-slate-200'
                  }`}
                >
                  {currentQuestionIdx < questions.length - 1
                    ? 'Siguiente pregunta'
                    : 'Continuar'
                  }
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Dedicated Renderers
  if (exercise.type === 'speaking-analysis' && questions.length > 0) {
    return (
      <div className="space-y-4">
        <SpeakingExercise
          question={questions[0]}
          vocabulary={vocabulary}
          level={exercise.level}
          onComplete={(evalResult) => {
            setShowFinishButton(true);
            setFinishScore(evalResult.overallScore || 100);
          }}
        />
        {showFinishButton && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => onComplete({ success: finishScore >= 70, score: finishScore })}
              className="w-full bg-gradient-to-r from-[#FF6B6B] to-[#ff5252] text-white py-4 rounded-2xl font-semibold text-base shadow-lg flex items-center justify-center gap-2"
            >
              <TranslatedText text="[[Continue|Continuar]]" expandWordPairs={expandWordPairs} />
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    );
  }

  if (exercise.type === 'pronunciation') {
    const firstSpeakQ = questions[0];
    const phraseFromNested =
      (typeof firstSpeakQ?.targetPhrase === 'string' && firstSpeakQ.targetPhrase.trim()) ||
      (typeof firstSpeakQ?.question === 'string' && firstSpeakQ.question.trim()) ||
      '';
    const pronunciationQuestion = {
      id: exercise.id,
      prompt: exerciseContent.instructions || 'Repite la frase.',
      expectedResponse:
        exerciseContent.expectedResponse || exercise.transcript || phraseFromNested,
      hints: exerciseContent.evaluationCriteria || []
    };

    return (
      <div className="space-y-4">
        <EnhancedSpeakingExercise
          question={pronunciationQuestion}
          level={exercise.level}
          onComplete={(evalResult) => {
            setShowFinishButton(true);
            setFinishScore(evalResult.overallScore || 100);
          }}
        />
        {showFinishButton && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => onComplete({ success: finishScore >= 70, score: finishScore })}
              className="w-full bg-gradient-to-r from-[#FF6B6B] to-[#ff5252] text-white py-4 rounded-2xl font-semibold text-base shadow-lg flex items-center justify-center gap-2"
            >
              <TranslatedText text="[[Continue|Continuar]]" expandWordPairs={expandWordPairs} />
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    );
  }

  if (exercise.type === 'word-search') return <div className="bg-white p-8 rounded-3xl shadow-xl"><WordSearchExercise words={exerciseContent.words} gridSize={exerciseContent.gridSize ?? 10} onComplete={() => onComplete({ success: true, score: 100 })} /></div>;
  if (exercise.type === 'crossword') return <div className="bg-white p-8 rounded-3xl shadow-xl"><CrosswordExercise items={exerciseContent.items} onComplete={() => onComplete({ success: true, score: 100 })} /></div>;
  if (exercise.type === 'flashcard') return <FlashcardExercise content={exerciseContent as any} onComplete={() => onComplete({ success: true, score: 100 })} />;
  if (exercise.type === 'drag-drop' || exercise.type === 'sentence-building' || exercise.type === 'spelling') {
    return (
      <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 overflow-visible p-6 md:p-8">
        <DragDropExercise content={exerciseContent as any} onComplete={(success) => onComplete({ success, score: success ? 100 : 0 })} />
      </div>
    );
  }
  if (exercise.type === 'matching') return <MatchingExercise content={exerciseContent as any} onComplete={(success) => onComplete({ success, score: success ? 100 : 0 })} />;
  if (exercise.type === 'interactive-dialogue') return <InteractiveDialogueExercise content={exerciseContent as any} onComplete={(success) => onComplete({ success, score: success ? 100 : 0 })} />;

  // Default Renderer
  const typeInfo = getTypeInfo(exercise.type);
  const typeTheme = getTypeTheme(exercise.type);
  const TypeIcon = typeInfo.icon;
  const listeningTranscript = resolveListeningScript(exercise, exerciseContent);
  const isListeningExercise =
    exercise.type === 'listening' || exercise.type === 'listening-comprehension';
  const resolvedExerciseAudioUrl = resolvePublicAudioUrl(
    (exercise.audioUrl || exerciseContent.audioUrl) as string | undefined
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 overflow-visible">
        <div className="p-6 md:p-10 space-y-6">
          <div className="pb-4 overflow-visible">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${typeTheme.badge}`} aria-hidden>
                <TypeIcon size={14} aria-hidden />
                <span>{typeInfo.label}</span>
              </div>
            </div>
            <h2 className={`text-xl md:text-2xl font-semibold text-slate-900 leading-snug border-l-4 pl-4 ${typeTheme.border} rounded-r-sm`}>
              <TranslatedText
                text={applyCourseBilingualText(exercise.id, exerciseContent.title || 'Ejercicio')}
                expandWordPairs={expandWordPairs}
              />
            </h2>
          </div>
          {exerciseContent.instructions && (
            <div className="mt-1 flex gap-2.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <Info size={18} className="text-slate-500 flex-shrink-0 mt-0.5" aria-hidden />
              <div className="text-slate-700 text-base font-normal leading-relaxed">
                <TranslatedText
                  text={applyCourseBilingualText(exercise.id, exerciseContent.instructions)}
                  expandWordPairs={expandWordPairs}
                />
              </div>
            </div>
          )}

          {/* Audio estático (mismo patrón que podcasts: /public/audio/...) */}
          {resolvedExerciseAudioUrl && (
            <AudioPlayer
              audioUrl={resolvedExerciseAudioUrl}
              transcript={listeningTranscript || exercise.transcript}
            />
          )}

          {/* Listening sin MP3: TTS bajo demanda */}
          {isListeningExercise && !resolvedExerciseAudioUrl && listeningTranscript && (
            <AudioPlayer
              ttsText={listeningTranscript}
              transcript={listeningTranscript}
            />
          )}

          {/* Reading text: mejor contraste y tipografía */}
          {isReadingExercise && showReadingText ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 md:p-5">
                <p className="text-sm font-medium text-slate-500 mb-2 flex items-center gap-2">
                  <BookOpen size={14} aria-hidden />
                  Lee el texto con calma antes de responder
                </p>
                <div className="text-slate-800 text-base md:text-lg leading-relaxed font-normal">
                  <Markdown
                    content={applyCourseBilingualText(exercise.id, longFormText)}
                    expandWordPairs={expandWordPairs}
                  />
                </div>
              </div>
              {resolvedExerciseAudioUrl && (
                <AudioPlayer
                  audioUrl={resolvedExerciseAudioUrl}
                  transcript={listeningTranscript || exercise.transcript}
                />
              )}
              <button
                onClick={() => setShowReadingText(false)}
                className="w-full bg-gradient-to-r from-[#FF6B6B] to-[#ff5252] text-white py-4 rounded-2xl font-semibold text-base shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B6B] focus-visible:ring-offset-2"
                aria-label="Ir a las preguntas de comprensión"
              >
                Comprobar comprensión <ArrowRight className="w-5 h-5" aria-hidden />
              </button>
            </div>
          ) : (
            <div>
              {questions.length > 0
                ? renderCurrentQuestion(questions[currentQuestionIdx], currentQuestionIdx)
                : exercise.type === 'writing'
                  ? (
                    <div className="space-y-3">
                      {exerciseContent.expressionHint && (
                        <div className="rounded-xl bg-sky-50 border border-sky-200 p-4">
                          <p className="text-sm font-semibold text-sky-800 mb-1">Pista (expresiones que puedes usar):</p>
                          <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                            <TranslatedText
                              text={applyCourseBilingualText(exercise.id, exerciseContent.expressionHint)}
                              expandWordPairs={expandWordPairs}
                            />
                          </div>
                        </div>
                      )}
                      {exerciseContent.modelExample && !exerciseContent.expressionHint && (
                        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
                          <p className="text-sm font-semibold text-amber-800 mb-2">Modelo (guía):</p>
                          <div className="text-slate-800 text-sm md:text-base leading-relaxed whitespace-pre-line">
                            <TranslatedText
                              text={applyCourseBilingualText(exercise.id, exerciseContent.modelExample)}
                              expandWordPairs={expandWordPairs}
                            />
                          </div>
                        </div>
                      )}
                      <p className="text-sm font-medium text-slate-600">
                        {exerciseContent.modelExample && !exerciseContent.expressionHint
                          ? 'Escribe tu respuesta en inglés siguiendo el modelo, pero hablando de ti.'
                          : 'Escribe tu respuesta en inglés según las instrucciones de arriba, hablando de ti.'}
                      </p>
                      <textarea
                        value={typeof userAnswer === 'string' ? userAnswer : ''}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        rows={5}
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm md:text-base text-slate-800 leading-relaxed focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B6B] focus-visible:ring-offset-1"
                        placeholder={exerciseContent.minWords ? `Escribe aquí (aprox. ${exerciseContent.minWords}-${exerciseContent.maxWords || '…'} palabras)…` : 'Escribe aquí tu respuesta…'}
                      />
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{exerciseContent.minWords ? `Procura escribir entre ${exerciseContent.minWords} y ${exerciseContent.maxWords || '…'} palabras.` : 'Procura escribir frases completas.'}</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleWritingComplete}
                        disabled={!userAnswer || typeof userAnswer !== 'string' || !userAnswer.trim()}
                        className="w-full bg-slate-900 text-white py-3 rounded-2xl text-sm font-semibold hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Marcar actividad como completada
                      </button>
                    </div>
                  )
                  : (
                    <div className="text-center py-10">
                      <p className="text-slate-600 font-medium mb-2">No hay preguntas en esta actividad.</p>
                      <p className="text-slate-500 text-sm font-normal mb-6">Puedes continuar a la siguiente.</p>
                      <button
                        onClick={() => onComplete({ success: true, score: 100 })}
                        className="bg-slate-800 text-white px-8 py-3 rounded-2xl font-semibold text-sm hover:bg-slate-700 transition-colors"
                      >
                        Continuar
                      </button>
                    </div>
                  )
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
