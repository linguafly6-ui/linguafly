import { Navigation } from "@/components/sections/Navigation";
import { CourseLaunchBanner } from "@/components/CourseLaunchBanner";
import LevelTestInteractive from "@/components/test/LevelTestInteractive";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Test de Nivel de Inglés Gratis Online (A1-C2) | Linguafly",
  description:
    "Descubre tu nivel de inglés con este test online gratis de 25 preguntas. Evalúa gramática, vocabulario y comprensión del A1 al C2 según el MCER. Resultado inmediato y sin registro.",
  keywords: [
    "test ingles",
    "test English",
    "nivel de ingles online",
    "test de nivel ingles online",
    "nivel de ingles",
    "test de nivel ingles",
    "test de nivel inglés gratis",
    "evaluación inglés online",
    "nivel CEFR",
  ],
  alternates: {
    canonical: "https://linguafly.app/test-nivel",
  },
  openGraph: {
    title: "Test de Nivel de Inglés Online Gratis | Test English A1-C2",
    description:
      "Haz gratis el test de nivel de inglés de 25 preguntas. Evalúa tu nivel A1-C2 y consulta tu resultado orientativo al instante.",
    url: "https://linguafly.app/test-nivel",
    type: "website",
    locale: "es_ES",
  },
};

export default async function DiagnosticoPage() {
  return (
    <>
      <Navigation />
      <CourseLaunchBanner />
      <main className="min-h-screen bg-gradient-to-b from-coral-50 via-white to-slate-50">
        {/* Hero Section */}
        <section className="pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-coral-100 text-coral-700 text-sm font-bold mb-6">
                <span>📊</span>
                <span>Test de Nivel Gratuito</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 mb-6">
                Test de Nivel de Inglés Online Gratis
              </h1>
              
              <p className="text-xl text-slate-600 mb-4 max-w-3xl mx-auto">
                Haz tu <strong>test inglés</strong> o <strong>test English</strong> y conoce tu{" "}
                <strong>nivel de inglés</strong> con un <strong>test de nivel inglés online</strong>{" "}
                basado en el Marco Común Europeo (CEFR)
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="text-coral-600">✓</span>
                  <span>10-15 minutos</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-coral-600">✓</span>
                  <span>Resultados inmediatos</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-coral-600">✓</span>
                  <span>Nivel A1 hasta C2</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-coral-600">✓</span>
                  <span>Sin registro</span>
                </div>
              </div>
            </div>

            {/* Test Component */}
            <LevelTestInteractive />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-black text-slate-900 mb-12 text-center">
              ¿Por qué hacer nuestro test de nivel inglés online?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-coral-50 to-peach-50 rounded-2xl p-6 border border-coral-200">
                <div className="w-12 h-12 rounded-xl bg-coral-600 flex items-center justify-center text-white text-2xl mb-4">
                  🎯
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Preciso y Confiable
                </h3>
                <p className="text-sm text-slate-700">
                  Diseñado por expertos siguiendo los estándares CEFR oficiales de Cambridge.
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-peach-50 rounded-2xl p-6 border border-orange-200">
                <div className="w-12 h-12 rounded-xl bg-coral-600 flex items-center justify-center text-white text-2xl mb-4">
                  ⚡
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Rápido y Eficiente
                </h3>
                <p className="text-sm text-slate-700">
                  25 preguntas para obtener una estimación orientativa de tu nivel de inglés.
                </p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-50 rounded-2xl p-6 border border-amber-200">
                <div className="w-12 h-12 rounded-xl bg-amber-600 flex items-center justify-center text-white text-2xl mb-4">
                  📈
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Resultados Detallados
                </h3>
                <p className="text-sm text-slate-700">
                  Desglose por nivel y habilidad con recomendaciones personalizadas.
                </p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                <div className="w-12 h-12 rounded-xl bg-amber-600 flex items-center justify-center text-white text-2xl mb-4">
                  🎓
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Plan de Estudio
                </h3>
                <p className="text-sm text-slate-700">
                  Recibe recomendaciones específicas de cursos según tu nivel actual.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CEFR Levels Reference */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-black text-slate-900 mb-4 text-center">
              Niveles del Marco Común Europeo (CEFR)
            </h2>
            <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
              Tu <strong>nivel de inglés online</strong> se mide con el estándar internacional reconocido por universidades, empresas y gobiernos en todo el mundo.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-6 border-2 border-slate-200 hover:border-coral-400 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-black">
                    A1
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Principiante</h3>
                    <p className="text-xs text-slate-600">Beginner</p>
                  </div>
                </div>
                <p className="text-sm text-slate-700">
                  Comprendes y usas expresiones cotidianas básicas. Puedes presentarte y hacer preguntas sencillas.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-slate-200 hover:border-coral-400 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-black">
                    A2
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Elemental</h3>
                    <p className="text-xs text-slate-600">Elementary</p>
                  </div>
                </div>
                <p className="text-sm text-slate-700">
                  Te comunicas en situaciones simples y rutinarias. Describes tu entorno inmediato.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-slate-200 hover:border-coral-400 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500 to-lime-500 flex items-center justify-center text-white font-black">
                    B1
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Intermedio</h3>
                    <p className="text-xs text-slate-600">Intermediate</p>
                  </div>
                </div>
                <p className="text-sm text-slate-700">
                  Manejas situaciones de viaje y trabajo. Expresas opiniones y planes de forma básica.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-slate-200 hover:border-coral-400 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-amber-500 flex items-center justify-center text-white font-black">
                    B2
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Intermedio Alto</h3>
                    <p className="text-xs text-slate-600">Upper Intermediate</p>
                  </div>
                </div>
                <p className="text-sm text-slate-700">
                  Interactúas con fluidez. Comprendes textos complejos sobre temas concretos y abstractos.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-slate-200 hover:border-coral-400 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-melon-500 flex items-center justify-center text-white font-black">
                    C1
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Avanzado</h3>
                    <p className="text-xs text-slate-600">Advanced</p>
                  </div>
                </div>
                <p className="text-sm text-slate-700">
                  Usas el idioma de forma flexible en contextos sociales, académicos y profesionales.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-slate-200 hover:border-coral-400 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-peach-500 to-pink-500 flex items-center justify-center text-white font-black">
                    C2
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Maestría</h3>
                    <p className="text-xs text-slate-600">Proficiency</p>
                  </div>
                </div>
                <p className="text-sm text-slate-700">
                  Dominio completo. Comprendes y te expresas con total precisión en cualquier situación.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-black text-slate-900 mb-12 text-center">
              Preguntas Frecuentes
            </h2>

            <div className="space-y-6">
              <details className="group bg-slate-50 rounded-xl p-6 border border-slate-200">
                <summary className="font-bold text-slate-900 cursor-pointer list-none flex items-center justify-between">
                  ¿Es realmente gratis?
                  <span className="text-coral-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-slate-700 mt-4">
                  Sí, el <strong>test de nivel inglés</strong> es completamente gratuito y no requiere registro. Puedes hacer tu <strong>test inglés</strong> cuantas veces quieras.
                </p>
              </details>

              <details className="group bg-slate-50 rounded-xl p-6 border border-slate-200">
                <summary className="font-bold text-slate-900 cursor-pointer list-none flex items-center justify-between">
                  ¿Cuánto tarda el test?
                  <span className="text-coral-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-slate-700 mt-4">
                  El test tiene 25 preguntas y generalmente toma entre 15 y 20 minutos. Puedes hacerlo a tu propio ritmo.
                </p>
              </details>

              <details className="group bg-slate-50 rounded-xl p-6 border border-slate-200">
                <summary className="font-bold text-slate-900 cursor-pointer list-none flex items-center justify-between">
                  ¿Qué tan preciso es el resultado?
                  <span className="text-coral-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-slate-700 mt-4">
                  Nuestro test está diseñado por expertos siguiendo los estándares CEFR oficiales. Es una evaluación orientativa muy confiable para conocer tu nivel actual.
                </p>
              </details>

              <details className="group bg-slate-50 rounded-xl p-6 border border-slate-200">
                <summary className="font-bold text-slate-900 cursor-pointer list-none flex items-center justify-between">
                  ¿Puedo usar diccionario o traductor?
                  <span className="text-coral-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-slate-700 mt-4">
                  Para obtener resultados precisos, te recomendamos no usar ayudas externas. El objetivo es evaluar tu nivel real actual.
                </p>
              </details>

              <details className="group bg-slate-50 rounded-xl p-6 border border-slate-200">
                <summary className="font-bold text-slate-900 cursor-pointer list-none flex items-center justify-between">
                  ¿Qué pasa después del test?
                  <span className="text-coral-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-slate-700 mt-4">
                  Recibirás tu nivel CEFR, un desglose detallado de tu desempeño y recomendaciones personalizadas de cursos que se adaptan a tu nivel.
                </p>
              </details>
            </div>
          </div>
        </section>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Test de Nivel de Inglés Online Gratis",
            description:
              "Test de nivel inglés online gratuito. Evalúa tu nivel de inglés con 25 preguntas CEFR de A1 a C2.",
            url: "https://linguafly.app/test-nivel",
            inLanguage: "es",
            about: {
              "@type": "Thing",
              name: "Test de nivel de inglés",
              alternateName: ["test inglés", "test English", "nivel de inglés online"],
            },
          }),
        }}
      />

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-slate-400">
            © 2026 Linguafly. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </>
  );
}
