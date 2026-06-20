import { useState } from 'react';
import { DogProfile } from '../types';
import { ArrowRight, ArrowLeft, PenTool, ShieldAlert, BadgeHelp } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: DogProfile) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>('');
  const [breed, setBreed] = useState<string>('');
  const [handlingTool, setHandlingTool] = useState<'harness' | 'collar' | 'head_halter'>('harness');
  const [triggers, setTriggers] = useState<string[]>([]);
  const [intensity, setIntensity] = useState<number>(3);

  const handleNext = () => {
    if (step === 1 && !name.trim()) return;
    if (step === 2 && !breed) return;
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const toggleTrigger = (trigger: string) => {
    if (triggers.includes(trigger)) {
      setTriggers(triggers.filter((t) => t !== trigger));
    } else {
      setTriggers([...triggers, trigger]);
    }
  };

  const handleFinish = () => {
    onComplete({
      name: name || 'Kira',
      breed: breed || 'Border Collie',
      handlingTool,
      triggers,
      fixationIntensity: intensity,
    });
  };

  // Intensity labels in Spanish
  const intensityLabels = ["Ninguno", "Mínimo", "Distraído", "Focalización Intermedia", "Fijación Fuerte (Estático)", "Reactivo (Ladrido o Salto)"];

  const progressPercentage = (step / 4) * 100;

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col items-center justify-between py-12 px-6">
      
      {/* Top Progress Paw Navigation Indicator */}
      <div className="w-full max-w-xl mb-8">
        <div className="flex justify-between items-center px-2">
          {[1, 2, 3, 4].map((s) => (
            <button
              key={s}
              onClick={() => s < step && setStep(s)}
              disabled={s >= step && !name}
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                s <= step
                  ? 'bg-[#006c49] text-white shadow-md cursor-pointer'
                  : 'bg-[#bbcabf]/30 text-[#6c7a71] cursor-not-allowed'
              }`}
            >
              🐾 <span className="sr-only">Paso {s}</span>
            </button>
          ))}
        </div>
        <div className="w-full bg-[#bbcabf]/20 h-2 rounded-full mt-4 overflow-hidden">
          <div
            className="bg-[#006c49] h-full transition-all duration-500 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Onboarding Container */}
      <main className="w-full max-w-3xl bg-white border border-[#e5eeff] rounded-3xl p-8 md:p-12 shadow-sm transition-all flex-grow flex items-center justify-center">
        <div className="w-full">
          {/* STEP 1: Name and Greeting */}
          {step === 1 && (
            <div className="space-y-8 animate-fade-in">
              <div className="text-center space-y-3">
                <h1 className="text-4xl font-extrabold font-headline-lg text-[#006c49] tracking-tight">
                  Comencemos con un nombre.
                </h1>
                <p className="text-lg text-[#3c4a42]">
                  Toda gran relación de entrenamiento comienza con una presentación amigable.
                </p>
              </div>

              <div className="max-w-md mx-auto space-y-6">
                <label htmlFor="dog_name" className="block text-sm font-bold uppercase tracking-wider text-[#465e8e]">
                  ¿Cuál es el nombre de tu cachorro?
                </label>
                <input
                  type="text"
                  id="dog_name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Kira"
                  className="w-full px-6 py-4 rounded-full border-2 border-[#bbcabf] bg-[#f8f9ff] text-xl outline-none focus:border-[#006c49] text-[#0b1c30] transition-colors shadow-inner"
                />

                <div className="pt-6 flex justify-end">
                  <button
                    disabled={!name.trim()}
                    onClick={handleNext}
                    className={`w-full md:w-auto px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                      name.trim()
                        ? 'bg-[#006c49] hover:bg-[#10b981] text-white shadow-lg active:scale-95 cursor-pointer'
                        : 'bg-[#bbcabf] text-gray-100 cursor-not-allowed'
                    }`}
                  >
                    Siguiente <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Breed Selection */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <button
                  onClick={handleBack}
                  className="flex items-center gap-1 text-[#465e8e] font-bold hover:underline mb-4 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Atrás
                </button>
                <h2 className="text-3xl font-extrabold text-[#006c49] font-headline-lg">
                  Identifica su raza
                </h2>
                <p className="text-[#3c4a42]">
                  Diferentes razas tienen instintos y necesidades de actividad física únicos.
                </p>
              </div>

              {/* Grid of breeds */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[360px] overflow-y-auto pr-2 custom-scroll py-2">
                
                {/* Border Collie */}
                <div
                  onClick={() => setBreed('Border Collie')}
                  className={`group relative overflow-hidden rounded-2xl border-2 p-3 cursor-pointer transition-all active:scale-95 ${
                    breed === 'Border Collie'
                      ? 'border-[#006c49] bg-[#006c49]/10'
                      : 'border-[#bbcabf]/30 hover:border-[#006c49]/50'
                  }`}
                >
                  <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-2">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBV1n3sedQW6qGwitKUmewyBCEmb7xfZPrHWupgxlcLskcqwhtWoIUJLy2uRpqqPKI8d0dZQZZLjKQib4yg1jvDhurwqBYflF-ZxVLF6DIham1I1ibh4QFwsjEcvMRBlnykJ0hgYWHkL6fgKNZzurXcUNM0dPwY-ARNLKIJ9nU4XgHfjF1MC3sConWNVa49Bq8qItXoECWBUV4ghTuoItpzOfgXqqkviOM9SCgmCHdszqRiWbEYxqkuDlrbruJG-uHnGXaqYP1EMJYf"
                      alt="Border Collie"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <p className="text-center font-bold text-sm text-[#0b1c30]">Border Collie</p>
                </div>

                {/* Golden Retriever */}
                <div
                  onClick={() => setBreed('Golden Retriever')}
                  className={`group relative overflow-hidden rounded-2xl border-2 p-3 cursor-pointer transition-all active:scale-95 ${
                    breed === 'Golden Retriever'
                      ? 'border-[#006c49] bg-[#006c49]/10'
                      : 'border-[#bbcabf]/30 hover:border-[#006c49]/50'
                  }`}
                >
                  <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-2">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3Np7G19yryIVMniGDp4JO3to3zzo2PMmBofhUE3GorAnXbWT3TBE4k9pSocKtYo-sGJJR1UQnd6DKdAc3CGqVISrdcuOJla5ddlgfML7yTJm0k2h6WHtgpLCUwVxu-zb7Q_I3nMXBL6Fsb-dzzy-XPuQTuplwt7iO0v-wIPkyW7iVjGohsA9RUlAeXboEKi9GMwJhJufl7JTevDlPe8GVvPtWC0jLpMnfHEtIcWLaPv2HGCvcWIBG3sUsk1z9o4khg7l6GiLCxP4h"
                      alt="Golden Retriever"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <p className="text-center font-bold text-sm text-[#0b1c30]">Golden Retriever</p>
                </div>

                {/* German Shepherd */}
                <div
                  onClick={() => setBreed('Pastor Alemán')}
                  className={`group relative overflow-hidden rounded-2xl border-2 p-3 cursor-pointer transition-all active:scale-95 ${
                    breed === 'Pastor Alemán'
                      ? 'border-[#006c49] bg-[#006c49]/10'
                      : 'border-[#bbcabf]/30 hover:border-[#006c49]/50'
                  }`}
                >
                  <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-2">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWBw5Hy0jSY7sGCxEicToe1Zep9baXqq4hCg_vd2GrFel1dBLp2QKJl2Tvko2NwgZqNjQkUMxUA35GkW68M9z7X1cXYCw7InwuyF92lWpxKqtbqbze76E2tGXK6WJ-FE8yNIf4KTNaV1U0uCGQ8RZidaIX9iBZaqVWbeola3iqryusT2T0rahV-YBYOwEGRoZHxfjD3blcuNoSDj05NEfipB--1_JKlgnVx6LvgSYe2_PONo-gJ7SunK3UPyW5dC_qD1u5k8kUH1iO"
                      alt="German Shepherd"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <p className="text-center font-bold text-sm text-[#0b1c30]">Pastor Alemán</p>
                </div>

                {/* Mixed/other */}
                <div
                  onClick={() => setBreed('Mestizo / Otro')}
                  className={`group relative overflow-hidden rounded-2xl border-2 p-3 cursor-pointer transition-all active:scale-95 flex flex-col justify-between ${
                    breed === 'Mestizo / Otro'
                      ? 'border-[#006c49] bg-[#006c49]/10'
                      : 'border-[#bbcabf]/30 hover:border-[#006c49]/50'
                  }`}
                >
                  <div className="aspect-square bg-[#eff4ff] rounded-xl flex items-center justify-center mb-2">
                    <BadgeHelp className="w-12 h-12 text-[#6c7a71]" />
                  </div>
                  <p className="text-center font-bold text-sm text-[#0b1c30]">Mestizo / Otro</p>
                </div>

              </div>

              <div className="pt-4 flex justify-between items-center">
                <p className="text-sm font-semibold italic text-[#006c49]">
                  {breed ? `Raza Seleccionada: ${breed}` : 'Por favor, selecciona una raza para continuar'}
                </p>
                <button
                  disabled={!breed}
                  onClick={handleNext}
                  className={`px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all ${
                    breed
                      ? 'bg-[#006c49] hover:bg-[#10b981] text-white shadow-md active:scale-95 cursor-pointer'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Continuar <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Handling Setup */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-extrabold text-[#006c49] font-headline-lg">
                  Herramienta de Control Diario
                </h2>
                <p className="text-[#3c4a42]">
                  ¿Qué instrumento utilizas habitualmente para pasear a {name}?
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                
                {/* Body Harness */}
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="handling"
                    value="harness"
                    checked={handlingTool === 'harness'}
                    onChange={() => setHandlingTool('harness')}
                    className="sr-only"
                  />
                  <div className={`p-6 rounded-2xl border-2 text-center transition-all active:scale-95 flex flex-col items-center gap-3 ${
                    handlingTool === 'harness'
                      ? 'border-[#006c49] bg-[#006c49]/10 shadow-md'
                      : 'border-[#bbcabf]/30 hover:border-[#006c49]/50 bg-[#f8f9ff]'
                  }`}>
                    <div className="w-16 h-16 bg-[#10b981]/20 rounded-full flex items-center justify-center text-[#006c49]">
                      🐾
                    </div>
                    <span className="font-bold text-lg text-[#0b1c30]">Arnés Corporal</span>
                    <p className="text-xs text-[#3c4a42]">Distribuye la presión de tiro de manera segura por el pecho.</p>
                  </div>
                </label>

                {/* Collar */}
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="handling"
                    value="collar"
                    checked={handlingTool === 'collar'}
                    onChange={() => setHandlingTool('collar')}
                    className="sr-only"
                  />
                  <div className={`p-6 rounded-2xl border-2 text-center transition-all active:scale-95 flex flex-col items-center gap-3 ${
                    handlingTool === 'collar'
                      ? 'border-[#006c49] bg-[#006c49]/10 shadow-md'
                      : 'border-[#bbcabf]/30 hover:border-[#006c49]/50 bg-[#f8f9ff]'
                  }`}>
                    <div className="w-16 h-16 bg-[#10b981]/20 rounded-full flex items-center justify-center text-[#006c49]">
                      ⭕
                    </div>
                    <span className="font-bold text-lg text-[#0b1c30]">Collar Plano</span>
                    <p className="text-xs text-[#3c4a42]">Identificación cómoda, idóneo para perros entrenados sin tiro excesivo.</p>
                  </div>
                </label>

                {/* Head Halter */}
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="handling"
                    value="head_halter"
                    checked={handlingTool === 'head_halter'}
                    onChange={() => setHandlingTool('head_halter')}
                    className="sr-only"
                  />
                  <div className={`p-6 rounded-2xl border-2 text-center transition-all active:scale-95 flex flex-col items-center gap-3 ${
                    handlingTool === 'head_halter'
                      ? 'border-[#006c49] bg-[#006c49]/10 shadow-md'
                      : 'border-[#bbcabf]/30 hover:border-[#006c49]/50 bg-[#f8f9ff]'
                  }`}>
                    <div className="w-16 h-16 bg-[#10b981]/20 rounded-full flex items-center justify-center text-[#006c49]">
                      🎭
                    </div>
                    <span className="font-bold text-lg text-[#0b1c30]">Cabezal Halti</span>
                    <p className="text-xs text-[#3c4a42]">Excelente para control de tiro y redirección sutil de fijaciones.</p>
                  </div>
                </label>

              </div>

              <div className="pt-6 flex justify-between items-center border-t border-[#bbcabf]/20">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-1 text-[#465e8e] font-bold hover:underline cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Modificar Raza
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-8 py-3 bg-[#006c49] hover:bg-[#10b981] text-white rounded-full font-bold shadow-md active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  Siguiente Sección <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Diagnosis & Triggers */}
          {step === 4 && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <button
                  onClick={handleBack}
                  className="flex items-center gap-1 text-[#465e8e] font-bold hover:underline mb-4 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Ajustar Arnés
                </button>
                <h2 className="text-3xl font-extrabold text-[#006c49] font-headline-lg">
                  Diagnóstico de Comportamiento Canino
                </h2>
                <p className="text-[#3c4a42]">
                  Señala los estímulos fijadores y evalúa el nivel de atención ambiental de {name}.
                </p>
              </div>

              <div className="space-y-6">
                
                {/* Triggers selection */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#465e8e] flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-[#ba1a1a]" /> Selecciona los Detonantes (Estímulos)
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {['Otros Perros', 'Bicicletas', 'Gatos', 'Gente Extraña', 'Camiones', 'Corredores', 'Patinetas'].map((trigger) => {
                      const isSelected = triggers.includes(trigger);
                      return (
                        <button
                          key={trigger}
                          type="button"
                          onClick={() => toggleTrigger(trigger)}
                          className={`px-4 py-2 rounded-full border-2 text-sm font-semibold transition-all active:scale-95 cursor-pointer ${
                            isSelected
                              ? 'bg-[#006c49] text-white border-[#006c49] shadow-sm'
                              : 'bg-white text-[#3c4a42] border-[#bbcabf]/40 hover:border-[#006c49]/60'
                          }`}
                        >
                          {isSelected ? '🐾' : '⚪'} {trigger}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Intensity range slider */}
                <div className="space-y-4 bg-[#f8f9ff] p-6 rounded-2xl border border-[#e5eeff]">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#465e8e] flex items-center gap-2">
                      <PenTool className="w-4 h-4 text-[#006c49]" /> Intensidad de la Fijación Visual
                    </h3>
                    <span className="px-3 py-1 rounded-full bg-[#ba1a1a]/15 text-[#ba1a1a] font-extrabold text-sm shadow-sm transition-all animate-pulse">
                      {intensityLabels[intensity]}
                    </span>
                  </div>
                  
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={intensity}
                    onChange={(e) => setIntensity(parseInt(e.target.value))}
                    className="w-full h-3 bg-[#bbcabf]/30 rounded-lg appearance-none cursor-pointer accent-[#006c49]"
                  />
                  
                  <div className="flex justify-between text-xs font-semibold text-[#6c7a71]">
                    <span>Fácilmente distraído (Atención dispersa)</span>
                    <span>Hiper-focalizado (Reactividad/Fijación estricta)</span>
                  </div>
                </div>

              </div>

              {/* Action buttons */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-[#bbcabf]/20">
                <p className="text-xs text-[#6c7a71] order-2 md:order-1 text-center md:text-left">
                  Tus datos se procesarán científicamente mediante el motor de estimulación de KIRA.AI
                </p>
                <button
                  type="button"
                  onClick={handleFinish}
                  className="w-full md:w-auto px-8 py-4 bg-[#006c49] hover:bg-[#10b981] text-white font-bold text-lg rounded-full shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer transition-colors order-1 md:order-2"
                >
                  Finalizar Diagnóstico Canino 🎉
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Footer copyright */}
      <footer className="w-full text-center mt-8 text-xs text-[#3c4a42] font-semibold space-y-2">
        <p>© 2026 KIRA.AI • Ciencia de Comportamiento y Bienestar para Perros</p>
        <div className="flex justify-center gap-4 text-[#465e8e]">
          <a href="#" className="hover:underline">Políticas de Privacidad</a>
          <span>•</span>
          <a href="#" className="hover:underline">Metodología Científica</a>
          <span>•</span>
          <a href="#" className="hover:underline">Soporte Técnico</a>
        </div>
      </footer>
    </div>
  );
}
