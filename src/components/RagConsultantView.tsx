import { useState } from 'react';
import { Search, Heart, ShieldCheck, FlameKindling, Info, Sparkles, Loader2 } from 'lucide-react';

export default function RagConsultantView() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [sources, setSources] = useState<{ title: string; source: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Prefilled questions
  const prefilledQuestions = [
    { text: '¿Mi perro comió chocolate, qué hago?', icon: '🍫', label: 'Tóxicos' },
    { text: '¿Cuánta agua debe beber mi perro al día?', icon: '💧', label: 'Básico' },
    { text: '¿Cómo ayudo a un perro reactivo durante el paseo?', icon: '🐕', label: 'Línea de Mando' },
    { text: '¿Qué hacer si le da un golpe de calor?', icon: '☀️', label: 'Primeros Auxilios' },
  ];

  const handleAsk = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setAnswer(null);
    setSources([]);

    try {
      const response = await fetch('/api/rag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: query }),
      });

      if (!response.ok) {
        throw new Error('No se pudo establecer comunicación con el servidor clínico de KIRA.AI');
      }

      const data = await response.json();
      setAnswer(data.answer);
      setSources(data.sources || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error desconocido al consultar el RAG.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Intro and banner */}
      <div className="space-y-2">
        <h2 className="text-3xl font-extrabold font-headline-lg text-[#006c49] flex items-center gap-2">
          <Heart className="w-8 h-8 text-[#ba1a1a] fill-[#ba1a1a]/20" /> Consulta de Bienestar Inteligente (RAG)
        </h2>
        <p className="text-[#3c4a42] text-lg max-w-3xl">
          Pregúntale a nuestro asistente veterinario de IA. Todas las respuestas son generadas mediante un proceso RAG en tiempo real sustentado por fuentes con validez de comités médicos y guías científicas.
        </p>
      </div>

      {/* Main interaction panels split/bento layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Ask panel */}
        <section className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#e5eeff] shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#465e8e] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#006c49]" /> Generar nueva consulta
            </h3>
            
            <div className="space-y-4">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Escribe aquí tu duda... ej: ¿Cuáles alimentos son mortales para los perros? o ¿Cómo saber si mi pug se está deshidratando?"
                rows={4}
                className="w-full p-4 rounded-2xl bg-[#f8f9ff] border-2 border-[#bbcabf]/30 focus:border-[#006c49] outline-none text-sm text-[#0b1c30] transition-colors resize-none placeholder:text-[#6c7a71]/60"
              />
              
              <button
                onClick={() => handleAsk(question)}
                disabled={loading || !question.trim()}
                className={`w-full py-4 rounded-full font-bold text-[#f8f9ff] transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer shadow-md ${
                  question.trim() && !loading
                    ? 'bg-[#006c49] hover:bg-[#10b981]'
                    : 'bg-[#bbcabf] cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Consultando biblioteca científica...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Consultar IA de KIRA.AI
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick recommendations */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#6c7a71]">Preguntas Frecuentes Ilustrativas</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {prefilledQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuestion(q.text);
                    handleAsk(q.text);
                  }}
                  className="p-4 bg-white hover:bg-[#eff4ff] border border-[#e5eeff] rounded-2xl text-left transition-all hover:scale-[1.02] active:scale-98 flex items-start gap-3 cursor-pointer shadow-sm group"
                >
                  <span className="text-2xl pt-0.5 group-hover:scale-110 transition-transform">{q.icon}</span>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#primary-container]/10 text-[#006c49] bg-[#006c49]/10">
                      {q.label}
                    </span>
                    <p className="text-xs text-[#0b1c30] font-semibold leading-snug">{q.text}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Answer panel (Clinical file style) */}
        <section className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#e5eeff] shadow-sm min-h-[460px] flex flex-col justify-between">
            <div>
              {/* Header card state */}
              <div className="flex justify-between items-center border-b border-[#e5eeff] pb-4 mb-6">
                <div>
                  <h3 className="text-lg font-black text-[#0b1c30] font-headline-lg flex items-center gap-2">
                    🛡️ Expediente Clínico de Bienestar
                  </h3>
                  <p className="text-xs text-[#6c7a71]">
                    {loading ? 'Consultando bases médicas...' : answer ? 'Consulta Científica Resuelta' : 'Listo para tu consulta'}
                  </p>
                </div>
                
                {/* Confidence badge */}
                {answer && (
                  <span className="flex items-center gap-1 text-xs font-bold text-[#006c49] bg-[#10b981]/15 px-3 py-1 rounded-full border border-[#10b981]/30">
                    <ShieldCheck className="w-4 h-4" /> Fuente Verificada
                  </span>
                )}
              </div>

              {/* Loader placeholder */}
              {loading && (
                <div className="py-20 flex flex-col items-center justify-center gap-4 text-[#006c49]">
                  <Loader2 className="w-12 h-12 animate-spin text-[#006c49]" />
                  <div className="text-center space-y-1">
                    <p className="font-bold">Generando Dictamen con Gemini AI...</p>
                    <p className="text-xs text-[#6c7a71]">Extrayendo directrices éticas de comités veterinarios</p>
                  </div>
                </div>
              )}

              {/* Error indicator */}
              {error && (
                <div className="p-6 bg-[#ffdad6] text-[#93000a] rounded-2xl border border-[#ba1a1a]/20 space-y-2">
                  <p className="font-bold">Lo sentimos, ocurrió un inconveniente:</p>
                  <p className="text-sm">{error}</p>
                  <p className="text-xs">Por favor, inténtalo de nuevo. Asegúrate de que el servidor local Express esté en ejecución.</p>
                </div>
              )}

              {/* Success Result Container */}
              {!loading && !error && answer && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Real Answer Text */}
                  <div className="text-[#0b1c30] font-body-md whitespace-pre-wrap leading-relaxed text-sm bg-gradient-to-br from-[#f8f9ff] to-[#eff4ff] p-6 rounded-2xl border border-[#e5eeff]">
                    {answer}
                  </div>

                  {/* Sources display */}
                  {sources.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-[#e5eeff]">
                      <h4 className="text-xs font-black uppercase text-[#465e8e] tracking-wider flex items-center gap-1">
                        <Info className="w-4 h-4 text-[#006c49]" /> Referencias Científicas Utilizadas
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {sources.map((src, i) => (
                          <div key={i} className="p-3 rounded-xl bg-white border border-[#bbcabf]/30 hover:border-[#006c49]/40 transition-colors flex items-center gap-2">
                            <span className="text-lg">📚</span>
                            <div className="text-[11px] leading-tight flex-grow">
                              <p className="font-extrabold text-[#0b1c30]">{src.title}</p>
                              <p className="text-[#6c7a71]">{src.source}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* Empty state placeholder */}
              {!loading && !error && !answer && (
                <div className="py-24 flex flex-col items-center justify-center text-center space-y-4 max-w-sm mx-auto text-[#6c7a71]">
                  <div className="w-16 h-16 bg-[#f8f9ff] rounded-full flex items-center justify-center border border-[#e5eeff] text-2xl">
                    🩺
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-[#0b1c30]">Asistente Médico Canino</p>
                    <p className="text-xs leading-relaxed">
                      Introduce cualquier inquietud o toca uno de nuestros disparadores de ejemplo. Las consultas clínicas buscarán guías del comité WSAVA en tiempo real y completarán la respuesta mediante Gemini Pro.
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* General Advice warning */}
            <div className="mt-8 border-t border-[#e5eeff]/60 pt-4 flex gap-3 text-[10px] text-[#6c7a71] leading-relaxed">
              <FlameKindling className="w-6 h-6 text-[#ba1a1a] shrink-0" />
              <span>
                <strong>Aviso Legal de Bienestar:</strong> KIRA.AI es un modelo educativo asistencial de IA fundamentado en fuentes veterinarias confiables. Bajo ninguna circunstancia reemplaza un examen físico o diagnóstico presencial provisto por un profesional del cuidado animal colegiado. LLeva siempre a tu mascota a emergencias si tiene un colapso.
              </span>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
