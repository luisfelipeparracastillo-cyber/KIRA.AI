import { useState } from 'react';
import { DogProfile, WalkSession } from '../types';
import { Award, Zap, Flame, RefreshCw, CheckCircle, Navigation, Info, Trash2 } from 'lucide-react';

interface DashboardViewProps {
  profile: DogProfile;
  walkSessions: WalkSession[];
  onClearHistory: () => void;
  onNavigateToWalk: () => void;
}

export default function DashboardView({ profile, walkSessions, onClearHistory, onNavigateToWalk }: DashboardViewProps) {
  // Practice items
  const [completedPractices, setCompletedPractices] = useState<string[]>([]);
  const [xp, setXp] = useState<number>(3450);
  const [level, setLevel] = useState<number>(12);
  const [streakDays, setStreakDays] = useState<number>(3);

  const practiceTasks = [
    { id: 'eye_contact', title: 'Contacto Visual en Casa', subtitle: 'Refuerza la atención directa sin distractores', xp: 50, category: 'Focalización' },
    { id: 'loose_leash', title: 'Paseo con Correa Floja', subtitle: 'Pasos lentos con tensión cero en nuca', xp: 75, category: 'Caminata' },
    { id: 'sit_meal', title: 'Sentado y Quieto (Comida)', subtitle: 'Autocontrol alimentario hasta orden de liberación', xp: 60, category: 'Obediencia' },
    { id: 'recall_garden', title: 'Llamado en Jardín (Recall)', subtitle: 'Regreso veloz al pronunciar comando alternativo', xp: 80, category: 'Seguridad' },
  ];

  const handleCompleteTask = (id: string, taskXp: number) => {
    if (completedPractices.includes(id)) return;
    setCompletedPractices((prev) => [...prev, id]);
    setXp((prev) => {
      const nextXp = prev + taskXp;
      // Levelling logic (e.g., Level up every 500 XP)
      if (nextXp >= (level + 1) * 300) {
        setLevel((l) => l + 1);
        setStreakDays((s) => s + 1);
      }
      return nextXp;
    });
  };

  // Completion percentage of daily training
  const dailyProgress = Math.round((completedPractices.length / practiceTasks.length) * 100);

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Banner de bienvenida y estadísticas de gamificación */}
      <div className="bg-gradient-to-r from-[#006c49] to-[#10b981] p-6 md:p-8 rounded-3xl text-white shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-6 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🐾</span>
            <h1 className="text-3xl font-extrabold font-headline-lg">¡Hola, Guía de {profile.name}!</h1>
          </div>
          <p className="text-xs text-white/90 leading-relaxed max-w-md">
            Tu compañero de raza <strong>{profile.breed}</strong> está progresando notablemente. Desarrolla las dinámicas diarias para elevar su coeficiente de autocontrol.
          </p>
        </div>

        {/* Bento grid metric indexes */}
        <div className="md:col-span-6 grid grid-cols-3 gap-3 text-center">
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15">
            <Award className="w-5 h-5 mx-auto text-[#fef08a] mb-1" />
            <span className="block text-2xl font-black">Nivel {level}</span>
            <span className="text-[9px] font-black uppercase text-white/80 tracking-wider">Rango Actual</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15">
            <Zap className="w-5 h-5 mx-auto text-[#fef08a] mb-1" />
            <span className="block text-2xl font-black">{xp}</span>
            <span className="text-[9px] font-black uppercase text-white/80 tracking-wider">XPs Acumulados</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15">
            <Flame className="w-5 h-5 mx-auto text-[#f2f2f2] mb-1 fill-white" />
            <span className="block text-2xl font-black">{streakDays} Días</span>
            <span className="text-[9px] font-black uppercase text-white/80 tracking-wider">Racha Activa</span>
          </div>
        </div>
      </div>

      {/* Main split sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Practice Task Mode (Obediencia y autocontrol) */}
        <section className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#e5eeff] shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2">
              <div>
                <h3 className="text-lg font-black text-[#0b1c30]">Modo de Entrenamiento Diario</h3>
                <p className="text-xs text-[#6c7a71]">Completa tareas de obediencia de KIRA.AI para subir de nivel</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-black uppercase text-[#465e8e]">Meta diaria</span>
                <span className="block text-xl font-black text-[#006c49]">{dailyProgress}%</span>
              </div>
            </div>

            {/* Daily practices list */}
            <div className="space-y-3">
              {practiceTasks.map((task) => {
                const isCompleted = completedPractices.includes(task.id);
                return (
                  <div
                    key={task.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                      isCompleted
                        ? 'bg-[#10b981]/5 border-[#10b981]/25'
                        : 'bg-white border-[#bbcabf]/30 hover:border-[#006c49]/40'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#f8f9ff] text-[#465e8e] border border-[#e5eeff]">
                          {task.category}
                        </span>
                        <span className="text-xs font-bold text-[#10b981]">+{task.xp} XP</span>
                      </div>
                      <h4 className="font-extrabold text-[#0b1c30] text-sm">{task.title}</h4>
                      <p className="text-xs text-[#6c7a71] leading-relaxed">{task.subtitle}</p>
                    </div>

                    <button
                      disabled={isCompleted}
                      onClick={() => handleCompleteTask(task.id, task.xp)}
                      className={`w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 ${
                        isCompleted
                          ? 'bg-[#10b981]/15 text-[#006c49] border border-[#10b981]/30 cursor-default'
                          : 'bg-[#006c49] hover:bg-[#10b981] text-white shadow-sm'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-[#006c49]" /> ¡Conseguido!
                        </>
                      ) : (
                        'Completar'
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Walk history section */}
        <section className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#e5eeff] shadow-sm flex flex-col justify-between min-h-[360px]">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-black text-[#0b1c30]">Historial de Paseos</h3>
                  <p className="text-xs text-[#6c7a71]">Sesiones registradas mediante GPS</p>
                </div>
                
                {walkSessions.length > 0 && (
                  <button
                    onClick={onClearHistory}
                    className="p-2 text-[#ba1a1a] hover:bg-[#ba1a1a]/10 rounded-full transition-colors cursor-pointer"
                    title="Limpiar Historial de Paseos"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* List items */}
              {walkSessions.length === 0 ? (
                <div className="py-12 text-center text-[#6c7a71] space-y-4">
                  <div className="w-12 h-12 bg-[#f8f9ff] border border-[#e5eeff] rounded-full mx-auto flex items-center justify-center text-xl">
                    🛰️
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-xs text-[#0b1c30]">No hay caminatas registradas</p>
                    <p className="text-[10px] leading-relaxed max-w-[200px] mx-auto">
                      Inicia tu primer paseo con el GPS táctil y el entrenador virtual.
                    </p>
                  </div>
                  <button
                    onClick={onNavigateToWalk}
                    className="px-6 py-2.5 bg-[#006c49] hover:bg-[#10b981] text-white rounded-full text-xs font-bold shadow transition-all active:scale-95 cursor-pointer"
                  >
                    Iniciar Paseo Ahora
                  </button>
                </div>
              ) : (
                <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1' custom-scroll">
                  {walkSessions.map((session, index) => (
                    <div
                      key={session.id || index}
                      className="p-3 bg-[#f8f9ff] rounded-2xl border border-[#e5eeff] flex justify-between items-center"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🌱</span>
                        <div>
                          <p className="font-extrabold text-xs text-[#0b1c30]">
                            Paseo {(session.distanceMeters / 1000).toFixed(2)} km
                          </p>
                          <p className="text-[10px] text-[#6c7a71]">
                            {Math.round(session.durationSeconds / 60)} min • Pace: {session.paceMinPerKm || '---'}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] font-black uppercase text-[#006c49] bg-[#10b981]/15 px-2 py-0.5 rounded border border-[#10b981]/20">
                          {session.loggedTriggers ? session.loggedTriggers.length : 0} tags
                        </span>
                        <p className="text-[9px] text-[#6c7a71] mt-0.5">
                          {new Date(session.startTime).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick telemetry/calibration tips */}
            <div className="flex gap-2 text-[10px] text-[#6c7a71] items-start border-t border-[#e5eeff]/60 pt-4 mt-6">
              <Info className="w-5 h-5 text-[#465e8e] shrink-0" />
              <span>
                <strong>Modulación Cerebral Canina:</strong> El adiestramiento cognitivo se fundamenta en un 80% de paciencia y repeticiones. Al jalar la correa, frena en seco y espera a que la tensión se disuelva sola.
              </span>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
