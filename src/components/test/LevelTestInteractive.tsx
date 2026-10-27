'use client';

import { useState } from 'react';
import { LEVEL_TEST_QUESTIONS, calculateLevel, TOTAL_POINTS, type Question, type LevelResult } from '@/lib/level-test-data';
import { CheckCircle2, XCircle, ArrowRight, ArrowLeft, BarChart3, Clock, Award } from 'lucide-react';
import Link from 'next/link';

type AuthUserSnapshot = {
  email: string;
  fullName: string;
} | null;

type LevelTestInteractiveProps = {
  authUser?: AuthUserSnapshot;
};

export default function LevelTestInteractive({ authUser = null }: LevelTestInteractiveProps) {
  const user = null;
  const [hasStarted, setHasStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: string]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<LevelResult | null>(null);
  const [startTime] = useState(Date.now());
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadData, setLeadData] = useState({ firstName: '', email: '' });
  const [placementSaved, setPlacementSaved] = useState(false);
  const [placementError, setPlacementError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isAuthenticated = Boolean(authUser);
  const resolvedUserEmail = authUser?.email || '';
  const resolvedUserName = authUser?.fullName || '';
  const finalizeTest = async (leadOverride?: { firstName?: string; email?: string }) => {
    setIsSubmitting(true);
    setPlacementError(null);
    setPlacementSaved(false);

    let totalScore = 0;
    LEVEL_TEST_QUESTIONS.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        totalScore += question.points;
      }
    });

    const levelResult = calculateLevel(totalScore, TOTAL_POINTS);
    setResult(levelResult);

    const leadPayload = {
      firstName: leadOverride?.firstName ?? leadData.firstName,
      email: leadOverride?.email ?? leadData.email,
    };

    // Para usuarios autenticados no bloqueamos por formulario de lead.
    if (leadPayload.firstName && leadPayload.email) {
      try {
        await fetch('/api/level-test/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...leadPayload,
            score: Math.round(levelResult.percentage),
            level: levelResult.level,
            answers
          })
        });
      } catch (error) {
        console.error('Error syncing with CRM:', error);
      }
    }

    if (isAuthenticated) {
      try {
        const response = await fetch('/api/placement/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ level: levelResult.level }),
        });
        const data = (await response.json().catch(() => ({}))) as { success?: boolean; error?: string };
        if (response.ok && data.success) {
          setPlacementSaved(true);
        } else {
          setPlacementError(data.error || 'No se pudo guardar el resultado del test.');
        }
      } catch (error) {
        console.error('Error saving authenticated placement result:', error);
        setPlacementError('No se pudo guardar el resultado del test.');
      }
    }

    setIsSubmitting(false);
    setShowLeadForm(false);
    setShowResults(true);
  };


  const currentQuestion = LEVEL_TEST_QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / LEVEL_TEST_QUESTIONS.length) * 100;
  const isLastQuestion = currentQuestionIndex === LEVEL_TEST_QUESTIONS.length - 1;
  const hasAnswered = answers[currentQuestion?.id] !== undefined;

  const handleStart = () => {
    setHasStarted(true);
  };

  const handleAnswer = (optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionIndex
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      void finalizeTest();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    await finalizeTest();
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleRestart = () => {
    setHasStarted(false);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
    setResult(null);
  };

  const getTimeSpent = () => {
    const seconds = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Start screen
  if (!hasStarted) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-coral-500 to-peach-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4">
              Test de Nivel Completo
            </h2>
            <p className="text-lg text-slate-600">
              Evalúa tu nivel de inglés con {LEVEL_TEST_QUESTIONS.length} preguntas cuidadosamente diseñadas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-orange-50 to-peach-50 rounded-xl p-6 border border-orange-200">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-coral-600" />
                <h3 className="font-bold text-slate-900">Duración</h3>
              </div>
              <p className="text-sm text-slate-600">15-20 minutos</p>
            </div>

            <div className="bg-gradient-to-br from-coral-50 to-peach-50 rounded-xl p-6 border border-coral-200">
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="w-5 h-5 text-coral-600" />
                <h3 className="font-bold text-slate-900">Preguntas</h3>
              </div>
              <p className="text-sm text-slate-600">{LEVEL_TEST_QUESTIONS.length} preguntas</p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-50 rounded-xl p-6 border border-amber-200">
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-900">Niveles</h3>
              </div>
              <p className="text-sm text-slate-600">A1 hasta C2</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
            <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
              <span>💡</span>
              Consejos para el test
            </h3>
            <ul className="space-y-2 text-sm text-amber-800">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Responde con honestidad para obtener resultados precisos</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>No uses diccionarios ni traductores</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Si no sabes la respuesta, selecciona la que creas más probable</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Puedes volver a preguntas anteriores antes de finalizar</span>
              </li>
            </ul>
          </div>

          <button
            onClick={handleStart}
            className="w-full bg-gradient-to-r from-coral-600 to-peach-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-coral-700 hover:to-peach-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            Comenzar Test
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // Results screen
  if (showResults && result) {
    const correctAnswers = Object.keys(answers).filter(
      questionId => {
        const question = LEVEL_TEST_QUESTIONS.find(q => q.id === questionId);
        return question && answers[questionId] === question.correctAnswer;
      }
    ).length;

    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Header con resultado */}
          <div className={`${result.gradient} text-white p-8 md:p-12 text-center`}>
            <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-black mb-2">
              {result.title}
            </h2>
            <p className="text-xl text-white/90 mb-6">
              {result.description}
            </p>
            <div className="flex items-center justify-center gap-8 text-white/90">
              <div>
                <div className="text-3xl font-black">{Math.round(result.percentage)}%</div>
                <div className="text-sm">Puntuación</div>
              </div>
              <div className="h-12 w-px bg-white/30" />
              <div>
                <div className="text-3xl font-black">{correctAnswers}/{LEVEL_TEST_QUESTIONS.length}</div>
                <div className="text-sm">Correctas</div>
              </div>
              <div className="h-12 w-px bg-white/30" />
              <div>
                <div className="text-3xl font-black">{getTimeSpent()}</div>
                <div className="text-sm">Tiempo</div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="p-8 md:p-12">
            <h3 className="text-2xl font-black text-slate-900 mb-6">
              📚 Cursos Recomendados
            </h3>
            <div className="space-y-3 mb-8">
              {result.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">{rec}</span>
                </div>
              ))}
            </div>

            {/* Level breakdown */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 mb-8 border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-slate-600" />
                Desglose por Nivel
              </h4>
              <div className="space-y-3">
                {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(level => {
                  const levelQuestions = LEVEL_TEST_QUESTIONS.filter(q => q.level === level);
                  const correct = levelQuestions.filter(
                    q => answers[q.id] === q.correctAnswer
                  ).length;
                  const total = levelQuestions.length;
                  const percentage = total > 0 ? (correct / total) * 100 : 0;

                  return (
                    <div key={level}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-slate-700">{level}</span>
                        <span className="text-sm text-slate-600">{correct}/{total}</span>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${result.gradient} transition-all`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              {placementError && isAuthenticated && (
                <p className="w-full rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  {placementError} Si continúas, intentaremos guardar tu nivel al entrar al panel.
                </p>
              )}
              <Link
                href={
                  isAuthenticated
                    ? placementSaved
                      ? '/mi-panel'
                      : `/mi-panel?placement=1&level=${encodeURIComponent(result.level)}`
                    : result.courseUrl
                }
                className="flex-1 bg-gradient-to-r from-coral-600 to-peach-600 text-white px-8 py-4 rounded-xl font-bold text-center hover:from-coral-700 hover:to-peach-700 transition-all shadow-lg hover:shadow-xl"
              >
                {isAuthenticated ? 'Ir a mi ruta personalizada →' : 'Ver Curso Recomendado →'}
              </Link>
              <button
                onClick={handleRestart}
                className="flex-1 bg-white text-slate-700 border-2 border-slate-300 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 transition-all"
              >
                Repetir Test
              </button>
            </div>

            <p className="text-center text-sm text-slate-500 mt-6">
              ¿Quieres una evaluación más detallada? Agenda una consulta gratuita con nuestros expertos.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Test screen
  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-slate-700">
            Pregunta {currentQuestionIndex + 1} de {LEVEL_TEST_QUESTIONS.length}
          </span>
          <span className="text-sm text-slate-600">
            Nivel: <span className="font-bold text-coral-600">{currentQuestion.level}</span>
          </span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-coral-600 to-peach-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 md:p-12 mb-6">
        {/* Question header */}
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-12 h-12 rounded-xl ${
            currentQuestion.skill === 'grammar' ? 'bg-orange-100 text-coral-600' :
            currentQuestion.skill === 'vocabulary' ? 'bg-amber-100 text-amber-600' :
            'bg-amber-100 text-amber-600'
          } flex items-center justify-center font-bold`}>
            {currentQuestion.skill === 'grammar' ? '📝' : 
             currentQuestion.skill === 'vocabulary' ? '📚' : '📖'}
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
              {currentQuestion.skill === 'grammar' ? 'Gramática' :
               currentQuestion.skill === 'vocabulary' ? 'Vocabulario' : 'Comprensión Lectora'}
            </div>
            <div className="text-xs text-slate-500">
              {currentQuestion.points} {currentQuestion.points === 1 ? 'punto' : 'puntos'}
            </div>
          </div>
        </div>

        {/* Context (for reading comprehension) */}
        {currentQuestion.context && (
          <div className="bg-slate-50 rounded-xl p-6 mb-6 border border-slate-200">
            <p className="text-slate-700 leading-relaxed">
              {currentQuestion.context}
            </p>
          </div>
        )}

        {/* Question */}
        <h3 className="text-2xl font-bold text-slate-900 mb-8">
          {currentQuestion.question}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = answers[currentQuestion.id] === index;
            
            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'border-coral-600 bg-coral-50 shadow-md'
                    : 'border-slate-200 bg-white hover:border-coral-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 font-bold ${
                    isSelected
                      ? 'border-coral-600 bg-coral-600 text-white'
                      : 'border-slate-300 text-slate-400'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className={`${isSelected ? 'text-slate-900 font-semibold' : 'text-slate-700'}`}>
                    {option}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-4">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-5 h-5" />
          Anterior
        </button>

        <button
          onClick={handleNext}
          disabled={!hasAnswered || isSubmitting}
          className={`flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all ${
            hasAnswered && !isSubmitting
              ? 'bg-gradient-to-r from-coral-600 to-peach-600 text-white hover:from-coral-700 hover:to-peach-700 shadow-lg hover:shadow-xl'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? 'Procesando...' : isLastQuestion ? 'Ver Resultados' : 'Siguiente'}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Helper text */}
      {!hasAnswered && (
        <p className="text-center text-sm text-slate-500 mt-4">
          Selecciona una respuesta para continuar
        </p>
      )}
    </div>
  );
}
