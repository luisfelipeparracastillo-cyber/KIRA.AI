import { useState, useEffect } from 'react';
import { GlassWater, Bell, BellRing, BellOff, RefreshCw, Volume2, Plus } from 'lucide-react';

interface HydrationCenterProps {
  onLogWater: (ml: number) => void;
  loggedMl: number;
}

export default function HydrationCenter({ onLogWater, loggedMl }: HydrationCenterProps) {
  const [dailyTarget, setDailyTarget] = useState<number>(1500); // 1.5 Liters default
  const [frequencyHours, setFrequencyHours] = useState<number>(2); // Every 2 hours
  const [notificationsGranted, setNotificationsGranted] = useState<boolean>(false);
  const [permissionRequested, setPermissionRequested] = useState<boolean>(false);
  const [testNotificationActive, setTestNotificationActive] = useState<boolean>(false);

  // Check state of system notification permissions
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationsGranted(Notification.permission === 'granted');
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      alert('La API de notificaciones nativas no es compatible con este navegador, pero KIRA.AI activará las alertas táctiles integradas.');
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      setNotificationsGranted(permission === 'granted');
      setPermissionRequested(true);
    } catch (e) {
      console.warn("No se pudieron solicitar permisos de notificación en el iframe:", e);
    }
  };

  // Triggers an instant test reminder (system-native or fallback banner)
  const triggerHydrationAlert = () => {
    setTestNotificationActive(true);
    
    // Attempt System Native Notification
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        const _ = new Notification('💧 Recordatorio de Hidratación • KIRA.AI', {
          body: '¡Es hora de tomar agua! Mantén a tu cachorro hidratado para proteger sus riñones hoy.',
          icon: 'https://ais-pre-ve2ie5j2726j73myosx4p2-397499386759.us-west1.run.app/favicon.ico'
        });
        
        // Play custom notification click audio chime
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-84.wav');
        audio.volume = 0.4;
        audio.play().catch(() => {});
      } catch (e) {
        console.warn("Fallo al enviar notificación nativa (ejecución restringida en el iframe):", e);
      }
    } else {
      // Fallback HTML audio alert chime
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-84.wav');
      audio.volume = 0.4;
      audio.play().catch(() => {});
    }

    // Dismiss banner automatically block after 8 seconds
    setTimeout(() => {
      setTestNotificationActive(false);
    }, 8000);
  };

  const progressPercentage = Math.min((loggedMl / dailyTarget) * 100, 100);

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Banner / Custom inline active alert fallback */}
      {testNotificationActive && (
        <div className="fixed top-6 right-6 max-w-sm w-full bg-[#006c49] text-white p-5 rounded-2xl shadow-2xl border-2 border-[#10b981] z-50 animate-bounce flex items-start gap-4">
          <span className="text-3xl">💧</span>
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <h4 className="font-extrabold text-sm tracking-tight text-white leading-tight">MANTENTE HIDRATADO</h4>
              <button onClick={() => setTestNotificationActive(false)} className="text-xs font-black opacity-80 hover:opacity-100">✕</button>
            </div>
            <p className="text-xs text-white opacity-90 leading-normal">
              ¡Es hora de tomar agua! La ciencia nos aconseja beber líquidos regularmente con nuestras mascotas.
            </p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => {
                  onLogWater(250);
                  setTestNotificationActive(false);
                }}
                className="px-3 py-1.5 bg-white text-[#006c49] rounded-full text-[10px] font-black uppercase tracking-wider hover:bg-gray-100 active:scale-95 transition-all shadow"
              >
                +250ml Tomados
              </button>
              <button onClick={() => setTestNotificationActive(false)} className="px-3 py-1.5 bg-[#006c49] text-white rounded-full text-[10px] hover:underline">
                Ignorar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Intro section */}
      <div className="space-y-2">
        <h2 className="text-3xl font-extrabold font-headline-lg text-[#006c49] flex items-center gap-2">
          <GlassWater className="w-8 h-8 text-[#10b981]" /> Recordatorios Diarios de Hidratación
        </h2>
        <p className="text-[#3c4a42] text-lg max-w-2xl">
          Protege la longevidad renal de tu mascota. Registra la ingesta de agua diaria y activa recordatorios programados cada cierto intervalo de horas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Hydro tracking panel */}
        <section className="md:col-span-6 bg-white p-6 md:p-8 rounded-3xl border border-[#e5eeff] shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-extrabold text-[#0b1c30]">Progreso de Hidratación</h3>
              <p className="text-xs text-[#6c7a71]">Meta diaria: {dailyTarget} ml</p>
            </div>
            <span className="text-3xl font-black text-[#006c49]">{Math.round(progressPercentage)}%</span>
          </div>

          {/* Progress gauge container */}
          <div className="relative pt-2">
            <div className="w-full bg-[#f8f9ff] h-8 rounded-full border-2 border-[#e5eeff] overflow-hidden flex items-center justify-center relative shadow-inner">
              <div
                className="bg-gradient-to-r from-[#10b981] to-[#006c49] h-full absolute left-0 top-0 transition-all duration-700"
                style={{ width: `${progressPercentage}%` }}
              />
              <span className="relative z-10 font-bold ml-2 text-xs text-[#0b1c30]">
                {loggedMl} / {dailyTarget} ml tomados
              </span>
            </div>
          </div>

          {/* Logging increments */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-[#6c7a71] tracking-widest">Registrar rápida ingesta</h4>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => onLogWater(150)}
                className="p-4 rounded-2xl bg-[#f8f9ff] hover:bg-[#eff4ff] border border-[#e5eeff] font-extrabold text-[#006c49] transition-all active:scale-95 text-center cursor-pointer group"
              >
                <div className="text-xl group-hover:scale-110 transition-transform">🥛</div>
                <div className="text-xs mt-1">+150 ml</div>
                <p className="text-[9px] text-[#6c7a71] font-normal">Vaso Corto</p>
              </button>

              <button
                onClick={() => onLogWater(250)}
                className="p-4 rounded-2xl bg-[#f8f9ff] hover:bg-[#eff4ff] border border-[#e5eeff] font-extrabold text-[#006c49] transition-all active:scale-95 text-center cursor-pointer group"
              >
                <div className="text-2xl group-hover:scale-110 transition-transform">🥤</div>
                <div className="text-xs mt-1">+250 ml</div>
                <p className="text-[9px] text-[#6c7a71] font-normal">Vaso Estándar</p>
              </button>

              <button
                onClick={() => onLogWater(500)}
                className="p-4 rounded-2xl bg-[#f8f9ff] hover:bg-[#eff4ff] border border-[#e5eeff] font-extrabold text-[#006c49] transition-all active:scale-95 text-center cursor-pointer group"
              >
                <div className="text-2xl group-hover:scale-110 transition-transform">💧</div>
                <div className="text-xs mt-1">+500 ml</div>
                <p className="text-[9px] text-[#6c7a71] font-normal">Tazón Grande</p>
              </button>
            </div>
          </div>

          {/* Custom intake log */}
          <div className="flex gap-2 pt-2">
            <input
              type="number"
              placeholder="Ingresa otra cantidad en ml..."
              defaultValue={200}
              id="customMlInput"
              className="px-4 py-3 rounded-full border border-[#bbcabf] outline-none text-sm w-full focus:border-[#006c49] bg-[#f8f9ff]"
            />
            <button
              onClick={() => {
                const val = parseInt((document.getElementById('customMlInput') as HTMLInputElement).value || '200');
                if (val > 0) onLogWater(val);
              }}
              className="px-6 bg-[#006c49] text-white rounded-full text-xs font-bold hover:bg-[#10b981] active:scale-95 transition-all flex items-center justify-center cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-1" /> Añadir
            </button>
          </div>
        </section>

        {/* Setup scheduler panel */}
        <section className="md:col-span-6 bg-[#f8f9ff] p-6 md:p-8 rounded-3xl border border-[#e5eeff] space-y-6">
          <h3 className="text-xl font-extrabold text-[#0b1c30] flex items-center gap-2">
            ⚙️ Configuración del Recordatorio Push
          </h3>

          <div className="space-y-4">
            
            {/* Native system notification requester status */}
            <div className="p-4 bg-white rounded-2xl border border-[#e5eeff] flex justify-between items-center">
              <div className="space-y-0.5">
                <p className="text-sm font-bold text-[#0b1c30]">Notificaciones de Navegador</p>
                <p className="text-xs text-[#6c7a71]">
                  {notificationsGranted ? 'Activas en el Sistema' : 'Requiere autorización médica'}
                </p>
              </div>
              
              <button
                onClick={requestPermission}
                className={`px-4 py-2 rounded-full font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
                  notificationsGranted
                    ? 'bg-[#10b981]/15 text-[#006c49] border border-[#10b981]/30 cursor-default'
                    : 'bg-[#465e8e] text-white hover:bg-[#006c49]'
                }`}
              >
                {notificationsGranted ? (
                  <>
                    <BellRing className="w-4 h-4" /> Autorizado
                  </>
                ) : (
                  <>
                    <BellOff className="w-4 h-4" /> Solicitar Permiso
                  </>
                )}
              </button>
            </div>

            {/* Set Interval Hours */}
            <div className="space-y-2">
              <label htmlFor="targetInput" className="block text-xs font-black uppercase text-[#6c7a71] tracking-widest">
                Meta Diaria de Hidratación (ml)
              </label>
              <input
                type="number"
                id="targetInput"
                value={dailyTarget}
                onChange={(e) => setDailyTarget(parseInt(e.target.value) || 1200)}
                className="w-full px-4 py-3 rounded-xl border border-[#bbcabf]/40 outline-none text-sm bg-white"
              />
            </div>

            {/* Trigger options */}
            <div className="space-y-2">
              <span className="block text-xs font-black uppercase text-[#6c7a71] tracking-widest">Intervalo de Alertas</span>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 4].map((h) => (
                  <button
                    key={h}
                    onClick={() => setFrequencyHours(h)}
                    className={`px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      frequencyHours === h
                        ? 'bg-[#006c49] text-white shadow-sm'
                        : 'bg-white text-[#3c4a42] border border-[#bbcabf]/30 hover:bg-[#f8f9ff]'
                    }`}
                  >
                    Cada {h} hora{h > 1 ? 's' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Immediate Trigger Reminder Test */}
            <div className="pt-4 border-t border-[#bbcabf]/20 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#6c7a71] font-semibold">¿Quieres evaluar cómo se verá tu aviso?</span>
              </div>
              <button
                onClick={triggerHydrationAlert}
                className="w-full py-3.5 bg-white border border-[#006c49] rounded-full text-[#006c49] hover:bg-[#006c49]/5 font-extrabold text-xs tracking-wider transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Volume2 className="w-4 h-4 text-[#006c49]" /> Enviar Aviso de Prueba Diaria 💧
              </button>
            </div>

          </div>

          {/* Quick clinical recommendation */}
          <div className="p-4 bg-[#eff4ff] text-[#465e8e] rounded-2xl border border-[#bbcabf]/20 text-[11px] leading-relaxed">
            🌿 <strong>Recomendación de KIRA.AI:</strong> En días de calor excesor o después de caminatas de alta intensidad de 20 minutos, los riñones caninos necesitan un flujo continuo de agua. ¡Mantén su tazón hidratado!
          </div>

        </section>

      </div>
    </div>
  );
}
