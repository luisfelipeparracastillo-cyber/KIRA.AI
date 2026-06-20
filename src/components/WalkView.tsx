import { useState, useEffect, useRef } from 'react';
import { DogProfile, WalkSession } from '../types';
import WalkMap from './WalkMap';
import { Play, Square, Award, AlertTriangle, CheckSquare, Sparkles, Navigation, HeartHandshake, Watch } from 'lucide-react';

interface WalkViewProps {
  profile: DogProfile;
  onSaveSession: (session: WalkSession) => void;
}

export default function WalkView({ profile, onSaveSession }: WalkViewProps) {
  // States: 'idle' | 'walking' | 'finished'
  const [gameState, setGameState] = useState<'idle' | 'walking' | 'finished'>('idle');
  const [targetMinutes, setTargetMinutes] = useState<number>(15);
  
  // Real-time walk metrics
  const [durationSeconds, setDurationSeconds] = useState<number>(0);
  const [distanceMeters, setDistanceMeters] = useState<number>(0);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number; simulated?: boolean }[]>([]);
  const [loggedTriggers, setLoggedTriggers] = useState<{
    time: string;
    type: 'jalar' | 'contacto_visual' | 'reactividad' | 'normal';
    label: string;
    note: string;
  }[]>([]);

  // Assistant status
  const [assistantMessage, setAssistantMessage] = useState<string>('¡Listo para iniciar! Asegura el arnés bien pegado antes de cruzar la puerta.');
  const [feedbackCount, setFeedbackCount] = useState<number>(0);

  // References
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const gpsWatcherRef = useRef<number | null>(null);

  // Initialize coordinate anchor
  const defaultLat = 19.4326; // Mexico City / Standard coordinate placeholder
  const defaultLng = -99.1332;

  // Assistant speech tips base
  const pullTips = [
    "Kira ha tensado la correa. Detente por completo, espera a que gire a mirarte y reanuda el paseo.",
    "No tires de vuelta. Mantén tu brazo firme pegado a la cadera y espera a que Kira relaje la correa voluntariamente.",
    "¡Buen freno! Recuerda premiar a Kira tan pronto regrese a tu lado para reforzar la conducta alternativa."
  ];

  const eyeContactTips = [
    "¡Espectacular contacto visual! Acabas de capturar su atención. Ofrece un premio de alto valor inmediatamente.",
    "El contacto visual espontáneo reduce la tensión nerviosa en el perro. Continúa felicitando vocalmente.",
    "¡Bien hecho! Esa conexión con los ojos mantendrá a Kira sintonizada contigo frente a los distractores."
  ];

  const reactivityTips = [
    "¡Alerta de reactividad canina! Aléjate del estímulo inmediatamente para restablecer el umbral de tranquilidad.",
    "Utiliza la técnica de 'Imán de comida': mantén un trozo de salchicha o premio frente al hocico para guiar su nuca lejos del peligro.",
    "Mantén la calma y respira hondo. Si te tensas, transmitirás esa señal de alarma por la correa."
  ];

  const generalTips = [
    "Paseando libremente. Permite el olfateo estructurado; esto estimula su cerebro y agota su energía de forma saludable.",
    "Mantén un paso firme y alegre. Tu postura corporal transmite seguridad a Kira.",
    "¡Gran caminata científica! Procura que el cabo de la correa mantenga una curvatura en forma de 'J' (colgando holgadamente)."
  ];

  // Start the walking session
  const startWalk = () => {
    setGameState('walking');
    setDurationSeconds(0);
    setDistanceMeters(0);
    setLoggedTriggers([]);
    setFeedbackCount(0);
    setAssistantMessage(`Paseo iniciado con ${profile.name}. Mantén una actitud calmada y lidera con paciencia.`);

    // Set initial center coordinates
    let startLat = defaultLat;
    let startLng = defaultLng;
    const initialCoords = [{ lat: startLat, lng: startLng, simulated: true }];
    setCoordinates(initialCoords);

    // Dynamic Route Geolocation watch tracker
    if ('geolocation' in navigator) {
      gpsWatcherRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCoordinates((prev) => [...prev, { lat, lng }]);
        },
        (error) => {
          console.warn("Ubicación GPS restringida o denegada en navegador, continuando con simulación inercial:", error.message);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }

    // Interval Timer Core for ticks, meters accumulation and dynamic AI speech suggestions
    timerRef.current = setInterval(() => {
      setDurationSeconds((prev) => {
        const nextSec = prev + 1;
        
        // Accumulate simulated walk meters (e.g., standard puppy walking is 1.2 meters per sec)
        setDistanceMeters((meters) => meters + parseFloat((Math.random() * 0.4 + 1.0).toFixed(2)));

        // Automatically add simulated GPS offset step
        setCoordinates((prevCoords) => {
          if (prevCoords.length === 0) return [{ lat: defaultLat, lng: defaultLng, simulated: true }];
          const last = prevCoords[prevCoords.length - 1];
          // Micro step variation
          const deltaLat = (Math.random() - 0.4) * 0.00015;
          const deltaLng = (Math.random() - 0.4) * 0.00015;
          return [...prevCoords, { lat: last.lat + deltaLat, lng: last.lng + deltaLng, simulated: true }];
        });

        // Trigger spontaneous assistant tip every 20 seconds
        if (nextSec % 20 === 0) {
          const tip = generalTips[Math.floor(Math.random() * generalTips.length)];
          setAssistantMessage(tip);
          setFeedbackCount((f) => f + 1);
          speakAssistant(tip);
        }

        return nextSec;
      });
    }, 1000);
  };

  // Speaks assistant tips out loud using Browser SpeechSynthesizer if available
  const speakAssistant = (text: string) => {
    if ('speechSynthesis' in window) {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn("Fallo al reproducir voz de síntesis en navegador:", e);
      }
    }
  };

  // Register real-time behavior ticks (Interactive incidents)
  const logIncident = (type: 'jalar' | 'contacto_visual' | 'reactividad') => {
    const minText = Math.floor(durationSeconds / 60);
    const secText = (durationSeconds % 60).toString().padStart(2, '0');
    const timestamp = `${minText}:${secText}`;

    let label = '';
    let note = '';
    let chosenTip = '';

    if (type === 'jalar') {
      label = 'Tensión en correa';
      note = 'Tirón de correa registrado';
      chosenTip = pullTips[Math.floor(Math.random() * pullTips.length)];
    } else if (type === 'contacto_visual') {
      label = 'Enfoque al dueño';
      note = 'Contacto visual positivo espontáneo';
      chosenTip = eyeContactTips[Math.floor(Math.random() * eyeContactTips.length)];
      // Incentive distance bonus on focus reward
      setDistanceMeters((prev) => prev + 5);
    } else if (type === 'reactividad') {
      label = 'Alerta Reactiva';
      note = 'Fijación visual ante estímulos externos';
      chosenTip = reactivityTips[Math.floor(Math.random() * reactivityTips.length)];
    }

    setLoggedTriggers((prev) => [
      ...prev,
      { time: timestamp, type, label, note }
    ]);

    setAssistantMessage(chosenTip);
    setFeedbackCount((f) => f + 1);
    speakAssistant(chosenTip);
  };

  // Terminate walking session
  const stopWalk = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (gpsWatcherRef.current !== null) navigator.geolocation.clearWatch(gpsWatcherRef.current);
    
    setGameState('finished');
    speakAssistant("Paseo canino finalizado con éxito. Generando estadísticas analíticas.");
  };

  const handleSaveAndExit = () => {
    const finalPace = distanceMeters > 0 ? (durationSeconds / 60) / (distanceMeters / 1000) : 0;
    const calories = Math.round((durationSeconds * 0.12) + (distanceMeters * 0.05));
    
    const session: WalkSession = {
      id: `session_${Date.now()}`,
      startTime: new Date(Date.now() - durationSeconds * 1000).toISOString(),
      endTime: new Date().toISOString(),
      durationSeconds,
      distanceMeters: Math.round(distanceMeters),
      paceMinPerKm: parseFloat(finalPace.toFixed(2)),
      pathCoordinates: coordinates,
      loggedTriggers,
      assistantFeedbackCount: feedbackCount,
      calories
    };

    onSaveSession(session);
    setGameState('idle');
  };

  // Convert minutes & seconds for UI
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* State 1: Prep & Idle */}
      {gameState === 'idle' && (
        <div className="max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-3xl border border-[#e5eeff] shadow-sm space-y-8">
          <div className="text-center space-y-2">
            <span className="text-4xl text-center block">🐕</span>
            <h2 className="text-3xl font-extrabold font-headline-lg text-[#006c49]">Preparación para el Paseo</h2>
            <p className="text-sm text-[#3c4a42]">
              Configura los límites saludables antes de iniciar tu sesión con {profile.name}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            
            {/* Quick configuration card */}
            <div className="p-6 bg-[#f8f9ff] rounded-2xl border border-[#e5eeff] space-y-4">
              <h3 className="font-extrabold text-[#0b1c30] text-sm uppercase tracking-wider text-[#465e8e]">Meta de duración</h3>
              <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-[#bbcabf]/30">
                <button
                  type="button"
                  onClick={() => setTargetMinutes((m) => Math.max(5, m - 5))}
                  className="font-black text-lg w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 outline-none flex items-center justify-center cursor-pointer"
                >
                  -
                </button>
                <span className="font-extrabold text-lg text-[#0b1c30]">{targetMinutes} minutos</span>
                <button
                  type="button"
                  onClick={() => setTargetMinutes((m) => Math.min(60, m + 5))}
                  className="font-black text-lg w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 outline-none flex items-center justify-center cursor-pointer"
                >
                  +
                </button>
              </div>

              <div className="text-xs text-[#3c4a42] leading-relaxed">
                🐾 <strong>Guía genética:</strong> Tu compañero es un <strong>{profile.breed}</strong>. Los analistas de comportamiento independientes recomiendan caminatas estructuradas y adiestramiento de {profile.breed === 'Border Collie' || profile.breed === 'Pastor Alemán' ? '45-60 min' : '20-30 min'} al día.
              </div>
            </div>

            {/* Check leash handle tool mapping */}
            <div className="p-6 bg-[#f8f9ff] rounded-2xl border border-[#e5eeff] space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-[#0b1c30] text-sm uppercase tracking-wider text-[#465e8e]">Herramienta Activa</h3>
                <p className="text-xs text-[#6c7a71] mt-1">Configurado en tu perfil canino:</p>
                <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-[#e5eeff] mt-2">
                  <span className="text-2xl">💍</span>
                  <div>
                    <p className="font-bold text-sm text-[#0b1c30]">
                      {profile.handlingTool === 'harness' ? 'Arnés Corporal Seguro' : profile.handlingTool === 'collar' ? 'Collar Plano Estándar' : 'Cabezal Halti Redireccional'}
                    </p>
                    <p className="text-[10px] text-[#6c7a71]">Dispositivo idóneo ante impulsos o tirones</p>
                  </div>
                </div>
              </div>

              <button
                onClick={startWalk}
                className="w-full py-4 bg-[#006c49] hover:bg-[#10b981] text-[#f8f9ff] rounded-full font-black text-md shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <Play className="w-5 h-5 fill-white" /> Iniciar Paseo Canino 🚀
              </button>
            </div>

          </div>
        </div>
      )}

      {/* State 2: Active Walk */}
      {gameState === 'walking' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Active tracker metrics panel */}
          <section className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-[#e5eeff] shadow-sm space-y-6">
              
              <div className="flex justify-between items-center pb-4 border-b border-[#e5eeff]">
                <div>
                  <h3 className="font-black text-[#006c49] text-lg">Paseo Científico Activo</h3>
                  <p className="text-xs text-[#6c7a71]">Monitoreando comportamiento de {profile.name}...</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-[#ba1a1a] font-bold bg-[#ba1a1a]/15 px-2.5 py-1 rounded-full animate-pulse border border-[#ba1a1a]/30">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a]" /> GRABANDO GPS
                </div>
              </div>

              {/* Big Metrics Display */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-[#f8f9ff] p-4 rounded-2xl border border-[#e5eeff]">
                  <Watch className="w-4 h-4 text-[#006c49] mx-auto mb-1" />
                  <span className="block font-black text-lg text-[#0b1c30]">{formatTime(durationSeconds)}</span>
                  <span className="text-[9px] font-black uppercase text-[#6c7a71] tracking-widest">Duración</span>
                </div>

                <div className="bg-[#f8f9ff] p-4 rounded-2xl border border-[#e5eeff]">
                  <Navigation className="w-4 h-4 text-[#465e8e] mx-auto mb-1" />
                  <span className="block font-black text-lg text-[#0b1c30]">{(distanceMeters / 1000).toFixed(2)} km</span>
                  <span className="text-[9px] font-black uppercase text-[#6c7a71] tracking-widest">Distancia</span>
                </div>

                <div className="bg-[#f8f9ff] p-4 rounded-2xl border border-[#e5eeff]">
                  <Award className="w-4 h-4 text-[#ba1a1a] mx-auto mb-1" />
                  <span className="block font-black text-lg text-[#0b1c30]">
                    {distanceMeters > 0 ? ((durationSeconds / 60) / (distanceMeters / 1000)).toFixed(1) : '---'}
                  </span>
                  <span className="text-[9px] font-black uppercase text-[#6c7a71] tracking-widest">Ritmo min/km</span>
                </div>
              </div>

              {/* Real-time speech assistant alerts */}
              <div className="p-5 bg-gradient-to-br from-[#eff4ff] to-[#f8f9ff] border-2 border-[#bbcabf]/30 rounded-2xl space-y-2 relative overflow-hidden">
                <div className="absolute right-4 bottom-1 opacity-10 select-none text-5xl">🗣️</div>
                <h4 className="text-xs font-black uppercase tracking-wider text-[#465e8e] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#006c49]" /> Entrenador de Voz KIRA.AI
                </h4>
                <p className="text-xs text-[#0b1c30] font-semibold leading-relaxed">
                  "{assistantMessage}"
                </p>
                <p className="text-[9px] text-[#6c7a71] italic pt-1">💡 Tu celular emitirá señales audibles en español al interactuar o cumplirse hitos.</p>
              </div>

              {/* Interactive buttons to capture pull / focus incidents */}
              <div className="space-y-3">
                <span className="block text-xs font-black uppercase text-[#6c7a71] tracking-widest">Registrar Eventos en Vivo</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  
                  {/* Pull strap */}
                  <button
                    onClick={() => logIncident('jalar')}
                    className="p-3 bg-[#ba1a1a]/10 hover:bg-[#ba1a1a]/25 border border-[#ba1a1a]/30 hover:border-[#ba1a1a] rounded-xl text-center active:scale-95 transition-all cursor-pointer text-[#ba1a1a]"
                  >
                    <AlertTriangle className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-[10px] font-extrabold uppercase block leading-tight">Jalar Correa</span>
                  </button>

                  {/* Positive eye contact */}
                  <button
                    onClick={() => logIncident('contacto_visual')}
                    className="p-3 bg-[#10b981]/15 hover:bg-[#10b981]/25 border border-[#10b981]/30 hover:border-[#10b981] rounded-xl text-center active:scale-95 transition-all cursor-pointer text-[#006c49]"
                  >
                    <CheckSquare className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-[10px] font-extrabold uppercase block leading-tight">Foco Visual</span>
                  </button>

                  {/* Reactivity trigger alert */}
                  <button
                    onClick={() => logIncident('reactividad')}
                    className="p-3 bg-[#e5eeff] hover:bg-[#eff4ff] border border-[#bbcabf]/40 hover:border-[#465e8e] rounded-xl text-center active:scale-95 transition-all cursor-pointer text-[#465e8e]"
                  >
                    <HeartHandshake className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-[10px] font-extrabold uppercase block leading-tight">Estímulo Cercano</span>
                  </button>

                </div>
              </div>

              {/* Finish walk action */}
              <button
                onClick={stopWalk}
                className="w-full py-4 bg-[#ba1a1a] hover:bg-[#93000a] text-white rounded-full font-black text-sm shadow flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <Square className="w-4 h-4 fill-white" /> Finalizar y Ver Estadísticas
              </button>

            </div>
          </section>

          {/* Interactive Routing map */}
          <section className="lg:col-span-7 bg-white p-4 rounded-3xl border border-[#e5eeff] shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase text-[#6c7a71] tracking-widest">Mapa de Seguimiento en Tiempo Real (GPS)</span>
                <span className="text-[10px] font-bold text-[#006c49] bg-[#10b981]/15 px-2 py-0.5 rounded-full">
                  {coordinates.length} Coordenadas anotadas
                </span>
              </div>
              
              <WalkMap coordinates={coordinates} isActive={true} />
            </div>

            {/* List of real time logged incidents */}
            <div className="mt-4 bg-[#f8f9ff] rounded-2xl p-4 max-h-[140px] overflow-y-auto custom-scroll border border-[#e5eeff]">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#465e8e] block mb-2">Bitácora Lineal del Paseo</span>
              {loggedTriggers.length === 0 ? (
                <p className="text-xs text-[#6c7a71] italic text-center py-4">No se han registrado incidentes visuales aún. Usa los controles de arriba para etiquetar comportamientos.</p>
              ) : (
                <div className="space-y-2">
                  {loggedTriggers.map((tr, index) => (
                    <div key={index} className="flex justify-between items-center text-xs bg-white p-2.5 rounded-xl border border-[#e5eeff] shadow-sm">
                      <span className="font-bold text-[#6c7a71]">{tr.time}</span>
                      <span className={`px-2 py-0.5 rounded font-black uppercase text-[9px] ${
                        tr.type === 'jalar' ? 'bg-[#ffdad6] text-[#ba1a1a]' : tr.type === 'contacto_visual' ? 'bg-[#10b981]/15 text-[#006c49]' : 'bg-[#eff4ff] text-[#465e8e]'
                      }`}>
                        {tr.label}
                      </span>
                      <p className="text-[11px] text-[#0b1c30] truncate max-w-[150px]">{tr.note}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

        </div>
      )}

      {/* State 3: Finalized Session Summary */}
      {gameState === 'finished' && (
        <div className="max-w-4xl mx-auto bg-white p-6 md:p-10 rounded-3xl border-2 border-[#10b981]/30 shadow-lg space-y-8 animate-fade-in">
          
          {/* Header banner */}
          <div className="text-center space-y-2 border-b border-[#e5eeff] pb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#10b981]/15 text-[#006c49] text-3xl mb-2">
              🏆
            </div>
            <h2 className="text-4xl font-extrabold font-headline-lg text-[#006c49]">Caminata Finalizada con Éxito</h2>
            <p className="text-sm text-[#3c4a42]">
              Excelente gestión. Se compiló el análisis de rendimiento clínico de {profile.name}.
            </p>
          </div>

          {/* Stats matrix */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            
            <div className="bg-[#f8f9ff] p-5 rounded-2xl border border-[#e5eeff]">
              <span className="text-xs font-black uppercase text-[#6c7a71] tracking-widest block mb-1">Duración</span>
              <p className="text-3xl font-black text-[#0b1c30]">{formatTime(durationSeconds)}</p>
              <p className="text-[10px] text-[#6c7a71] mt-1">m:s recorridos</p>
            </div>

            <div className="bg-[#f8f9ff] p-5 rounded-2xl border border-[#e5eeff]">
              <span className="text-xs font-black uppercase text-[#6c7a71] tracking-widest block mb-1">Distancia</span>
              <p className="text-3xl font-black text-[#0b1c30]">{(distanceMeters / 1000).toFixed(2)} km</p>
              <p className="text-[10px] text-[#6c7a71] mt-1">{distanceMeters} metros totales</p>
            </div>

            <div className="bg-[#f8f9ff] p-5 rounded-2xl border border-[#e5eeff]">
              <span className="text-xs font-black uppercase text-[#6c7a71] tracking-widest block mb-1">Ritmo Promedio</span>
              <p className="text-3xl font-black text-[#0b1c30]">
                {distanceMeters > 0 ? ((durationSeconds / 60) / (distanceMeters / 1000)).toFixed(1) : '0.0'}
              </p>
              <p className="text-[10px] text-[#6c7a71] mt-1">min / kilómetro</p>
            </div>

            <div className="bg-[#f8f9ff] p-5 rounded-2xl border border-[#e5eeff]">
              <span className="text-xs font-black uppercase text-[#6c7a71] tracking-widest block mb-1">Calorías</span>
              <p className="text-3xl font-black text-[#0b1c30]">
                {Math.round((durationSeconds * 0.12) + (distanceMeters * 0.05))} kcal
              </p>
              <p className="text-[10px] text-[#6c7a71] mt-1">Esfuerzo metabólico</p>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Route GPS visualization */}
            <div className="md:col-span-7 bg-white rounded-2xl border border-[#e5eeff] p-4 space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-[#6c7a71] block">Mapa del Recorrido Satelital</span>
              <WalkMap coordinates={coordinates} isActive={false} />
            </div>

            {/* Diagnostic report card */}
            <div className="md:col-span-5 bg-[#f8f9ff] rounded-2xl p-6 border border-[#e5eeff] space-y-4">
              <h3 className="font-extrabold text-sm uppercase text-[#465e8e] tracking-wider flex items-center gap-1.5 border-b border-[#e5eeff] pb-2">
                🩺 Reporte de Conducta KIRA.AI
              </h3>

              {/* Behavior analytics */}
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold text-[#0b1c30]">
                  <span>Focos Visuales Premiados:</span>
                  <span className="text-[#006c49]">+{loggedTriggers.filter(t => t.type === 'contacto_visual').length} reps</span>
                </div>

                <div className="flex justify-between text-xs font-bold text-[#0b1c30]">
                  <span>Lapsos de Tensión / Tiro:</span>
                  <span className="text-[#ba1a1a]">{loggedTriggers.filter(t => t.type === 'jalar').length} tirones</span>
                </div>

                <div className="flex justify-between text-xs font-bold text-[#0b1c30]">
                  <span>Asesorías de Voz Emitidas:</span>
                  <span className="text-[#465e8e]">{feedbackCount} consejos</span>
                </div>
              </div>

              {/* Professional text diagnostic block */}
              <div className="p-4 rounded-xl bg-white border border-[#e5eeff] text-xs text-[#0b1c30] leading-relaxed space-y-2">
                <p className="font-extrabold text-[#006c49]">Dictamen Clínico de Caminata:</p>
                <p>
                  {loggedTriggers.filter(t => t.type === 'jalar').length > 3
                    ? `Kira mostró tensión leve durante los tramos de aceleración. Recomendamos detener la marcha constantemente apenas sientas los primeros gramos de fricción, reforzando la postura relajada con recompensas rápidas.`
                    : `¡Espectacular control de correa hoy! El nivel de sincronización con Kira fue excelente. El cabo de la correa colgó en forma de 'J' la mayor parte de la sesión, facilitando una caminata plácida y sin sobreesfuerzos estructurales.`}
                </p>
                <p className="text-[10px] text-[#6c7a71] italic mt-2">Dificultad de Estímulos: Nivel {profile.fixationIntensity} / 5</p>
              </div>

            </div>

          </div>

          {/* Action trigger to save session */}
          <div className="pt-6 border-t border-[#e5eeff] flex justify-end">
            <button
              onClick={handleSaveAndExit}
              className="px-8 py-4 bg-[#006c49] hover:bg-[#10b981] text-white font-extrabold text-[#f8f9ff] text-md rounded-full shadow hover:shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              Registrar Paseo en Historial de {profile.name} 🎉
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
