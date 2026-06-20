import { useState, useEffect } from 'react';
import { DogProfile, WalkSession } from './types';
import Onboarding from './components/Onboarding';
import DashboardView from './components/DashboardView';
import WalkView from './components/WalkView';
import BreedLibraryView from './components/BreedLibraryView';
import RagConsultantView from './components/RagConsultantView';
import HydrationCenter from './components/HydrationCenter';
import { 
  Home, 
  BookOpen, 
  Compass, 
  GlassWater, 
  MessageCircleQuestion, 
  LogOut, 
  Droplet,
  Flame,
  Award
} from 'lucide-react';

export default function App() {
  // Navigation: 'dashboard' | 'library' | 'walk' | 'rag' | 'hydration'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'library' | 'walk' | 'rag' | 'hydration'>('dashboard');
  
  // Persistent State load
  const [profile, setProfile] = useState<DogProfile | null>(null);
  const [walkSessions, setWalkSessions] = useState<WalkSession[]>([]);
  const [loggedMl, setLoggedMl] = useState<number>(0);
  const [showNotificationOverlay, setShowNotificationOverlay] = useState<boolean>(false);

  // Load from local storage
  useEffect(() => {
    try {
      const cachedProfile = localStorage.getItem('kira_dog_profile');
      if (cachedProfile) {
        setProfile(JSON.parse(cachedProfile));
      }

      const cachedSessions = localStorage.getItem('kira_walk_sessions');
      if (cachedSessions) {
        setWalkSessions(JSON.parse(cachedSessions));
      }

      const cachedMl = localStorage.getItem('kira_hydration_ml');
      if (cachedMl) {
        setLoggedMl(parseInt(cachedMl) || 0);
      }
    } catch (e) {
      console.warn("Fallo al leer datos del almacenamiento local persistente:", e);
    }
  }, []);

  // Set up background hydration reminder daemon interval (triggers mock alert every 120 seconds in active tab)
  useEffect(() => {
    const daemon = setInterval(() => {
      // Prompt a subtle slide-down water intake helper notification 
      setShowNotificationOverlay(true);
      // Sound chime
      try {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-84.wav');
        audio.volume = 0.25;
        audio.play().catch(() => {});
      } catch (err) {}
    }, 180000); // 3 minutes

    return () => clearInterval(daemon);
  }, []);

  // Profile lifecycle
  const handleOnboardingComplete = (newProfile: DogProfile) => {
    setProfile(newProfile);
    localStorage.setItem('kira_dog_profile', JSON.stringify(newProfile));
  };

  const handleResetProfile = () => {
    if (confirm('¿Estás seguro de que deseas reiniciar el perfil de tu cachorro y borrar el historial de adiestramiento?')) {
      setProfile(null);
      setWalkSessions([]);
      setLoggedMl(0);
      localStorage.removeItem('kira_dog_profile');
      localStorage.removeItem('kira_walk_sessions');
      localStorage.removeItem('kira_hydration_ml');
      setActiveTab('dashboard');
    }
  };

  // Walk logs lifecycle
  const handleSaveWalkSession = (session: WalkSession) => {
    const updated = [session, ...walkSessions];
    setWalkSessions(updated);
    localStorage.setItem('kira_walk_sessions', JSON.stringify(updated));
    
    // Auto increment dog XP bonus via completing dynamic walk
    try {
      localStorage.setItem('kira_hydration_ml', String(loggedMl));
    } catch (_) {}
    
    setActiveTab('dashboard');
  };

  const handleClearHistory = () => {
    if (confirm('¿Deseas vaciar el historial de paseos satelitales?')) {
      setWalkSessions([]);
      localStorage.removeItem('kira_walk_sessions');
    }
  };

  // Water intake sync
  const handleLogWater = (ml: number) => {
    const nextMl = loggedMl + ml;
    setLoggedMl(nextMl);
    localStorage.setItem('kira_hydration_ml', String(nextMl));
  };

  return (
    <div id="kira-app-root">
      
      {/* Onboarding block if profile is empty */}
      {!profile ? (
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : (
        <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col md:flex-row">
          
          {/* Hydration notification banner overlay fallback */}
          {showNotificationOverlay && (
            <div className="fixed top-4 left-1/2 -translate-x-1/2 max-w-sm w-full bg-[#006c49] text-white px-5 py-4 rounded-2xl shadow-2xl z-50 border border-[#10b981] animate-slide-down flex items-start gap-3">
              <span className="text-2xl pt-1">💧</span>
              <div className="flex-grow space-y-1">
                <h4 className="font-extrabold text-xs tracking-tight">KIRA.AI • Alerta de Hidratación</h4>
                <p className="text-[11px] text-white/90">¡No olvides tomar agua con {profile.name}! Registrar tu dosis ayuda a prevenir cálculos renales caninos.</p>
                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={() => {
                      handleLogWater(200);
                      setShowNotificationOverlay(false);
                    }}
                    className="px-3 py-1 bg-white hover:bg-gray-100 text-[#006c49] rounded-full text-[10px] font-black uppercase tracking-wider transition-all"
                  >
                    +200ml Tomados
                  </button>
                  <button 
                    onClick={() => setShowNotificationOverlay(false)}
                    className="px-3 py-1 bg-[#006c49] text-white hover:underline text-[10px]"
                  >
                    Cerrar Alerta
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SIDEBAR NAVIGATION: Desktop */}
          <aside className="hidden md:flex flex-col justify-between w-64 bg-white border-r border-[#e5eeff] p-6 shrink-0 shadow-sm">
            <div className="space-y-8">
              {/* Logo branding */}
              <div className="flex items-center gap-2">
                <span className="text-3xl">🐾</span>
                <div>
                  <h1 className="text-xl font-black font-headline-lg text-[#006c49] tracking-wider">KIRA.AI</h1>
                  <span className="text-[10px] uppercase font-black tracking-widest text-[#6c7a71]">Comportamiento Canino</span>
                </div>
              </div>

              {/* Dog metadata micro profile card with tool and trigger length */}
              <div className="bg-[#f8f9ff] p-4 rounded-2xl border border-[#e5eeff]">
                <p className="text-xs font-black uppercase text-[#6c7a71] tracking-widest">Mascota Activa</p>
                <p className="font-extrabold text-md text-[#0b1c30] mt-1">🐕 {profile.name}</p>
                <div className="flex gap-1.5 flex-wrap mt-2">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#006c49]/10 text-[#006c49]">
                    {profile.breed}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#efe5ff] text-[#465e8e]">
                    Triggers: {profile.triggers.length}
                  </span>
                </div>
              </div>

              {/* Navigation Actions */}
              <nav className="space-y-1.5">
                {[
                  { id: 'dashboard', label: 'Mi Panel (Panel)', icon: Home },
                  { id: 'walk', label: 'Caminata Activa', icon: Compass },
                  { id: 'library', label: 'Biblioteca de Razas', icon: BookOpen },
                  { id: 'rag', label: 'Bienestar & RAG IA', icon: MessageCircleQuestion },
                  { id: 'hydration', label: 'Remedio Hidratación', icon: GlassWater },
                ].map((tab) => {
                  const IconComp = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center gap-3.5 px-4.5 py-3.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer border ${
                        isActive
                          ? 'bg-[#006c49] text-[#f8f9ff] border-[#006c49] shadow-md'
                          : 'bg-white text-[#3c4a42] border-transparent hover:bg-[#f8f9ff] hover:border-[#bbcabf]/30'
                      }`}
                    >
                      <IconComp className={`w-5 h-5 ${isActive ? 'text-[#10b981]' : 'text-[#6c7a71]'}`} />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Logout/Reset anchor */}
            <button
              onClick={handleResetProfile}
              className="w-full flex items-center gap-3 px-4 py-3 bg-[#ba1a1a]/10 hover:bg-[#ba1a1a] text-[#ba1a1a] hover:text-white rounded-xl text-xs font-bold transition-all text-left cursor-pointer border border-[#ba1a1a]/20 mt-8"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Reiniciar KIRA.AI
            </button>
          </aside>

          {/* MOBILE NAVIGATION: Top Header Bar */}
          <header className="md:hidden bg-white border-b border-[#e5eeff] px-6 py-4 flex justify-between items-center shrink-0 shadow-sm z-30 sticky top-0">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🐾</span>
              <div>
                <h1 className="text-lg font-black font-headline-lg text-[#006c49] leading-tight">KIRA.AI</h1>
                <p className="text-[9px] text-[#6c7a71] font-black tracking-wider uppercase leading-none">Guía Canino</p>
              </div>
            </div>

            {/* Top right quick pet status */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#0b1c30]">🐕 {profile.name}</span>
              <button 
                onClick={handleResetProfile} 
                className="p-1 px-2.5 rounded-full bg-red-50 text-red-600 text-[10px] font-black uppercase cursor-pointer"
              >
                Reset
              </button>
            </div>
          </header>

          {/* MAIN PAGE AREA CONTENT */}
          <main className="flex-grow p-6 md:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
            {activeTab === 'dashboard' && (
              <DashboardView 
                profile={profile} 
                walkSessions={walkSessions}
                onClearHistory={handleClearHistory}
                onNavigateToWalk={() => setActiveTab('walk')}
              />
            )}

            {activeTab === 'walk' && (
              <WalkView 
                profile={profile} 
                onSaveSession={handleSaveWalkSession}
              />
            )}

            {activeTab === 'library' && (
              <BreedLibraryView />
            )}

            {activeTab === 'rag' && (
              <RagConsultantView />
            )}

            {activeTab === 'hydration' && (
              <HydrationCenter 
                loggedMl={loggedMl} 
                onLogWater={handleLogWater}
              />
            )}
          </main>

          {/* BOTTOM NAVIGATION: Mobile Tab Bar */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#e5eeff] py-2 px-3 flex justify-around items-center z-40 shadow-xl">
            {[
              { id: 'dashboard', label: 'Panel', icon: Home },
              { id: 'walk', label: 'Paseo', icon: Compass },
              { id: 'library', label: 'Razas', icon: BookOpen },
              { id: 'rag', label: 'RAG IA', icon: MessageCircleQuestion },
              { id: 'hydration', label: 'Agua', icon: GlassWater },
            ].map((tab) => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex flex-col items-center gap-0.5 p-1 px-3 rounded-xl transition-all cursor-pointer ${
                    isActive ? 'text-[#006c49]' : 'text-[#6c7a71]/80 hover:text-[#0b1c30]'
                  }`}
                >
                  <IconComp className={`w-5.5 h-5.5 ${isActive ? 'text-[#006c49] scale-105' : 'text-[#6c7a71]'}`} />
                  <span className="text-[10px] font-bold">{tab.label}</span>
                </button>
              );
            })}
          </nav>

        </div>
      )}

    </div>
  );
}
