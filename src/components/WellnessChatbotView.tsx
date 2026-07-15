import { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, 
  BookOpen, 
  BookmarkCheck, 
  HeartOff, 
  Activity, 
  Apple, 
  Calendar, 
  HeartPulse, 
  Trash2, 
  User, 
  SendHorizontal, 
  Info,
  Loader2
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'usuario' | 'bot' | 'sistema';
  time: string;
}

export default function WellnessChatbotView() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Bienvenido al portal de orientación preventiva para el cuidado canino. Estoy capacitado para resolver consultas sobre nutrición, pautas físicas saludables, higiene básica o señales tempranas de alerta. ¿Qué tema o síntoma le gustaría analizar hoy?',
      time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const WEBHOOK_URL = "https://hook.us2.make.com/yq1tyx8xmiyxyupgw6tpoyuzosneldr8";

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMessageId = `msg_${Date.now()}`;
    const userMsg: Message = {
      id: userMessageId,
      sender: 'usuario',
      text: textToSend,
      time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensaje: textToSend })
      });

      if (!response.ok) {
        throw new Error("Estado de conexión defectuoso: " + response.status);
      }

      const replyText = await response.text();

      setMessages((prev) => [
        ...prev,
        {
          id: `reply_${Date.now()}`,
          sender: 'bot',
          text: replyText || 'No he recibido una respuesta vacía del servidor.',
          time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (error: any) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: `error_${Date.now()}`,
          sender: 'sistema',
          text: `No ha sido posible entablar comunicación con el motor de respuestas. Por favor, asegúrese de configurar correctamente el webhook en Make y mantenga activo el escenario. Detalles adicionales: ${error.message}`,
          time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('¿Estás seguro de que deseas vaciar el historial de la conversación actual?')) {
      setMessages([
        {
          id: 'welcome_reset',
          sender: 'bot',
          text: 'La sesión de consulta ha sido reiniciada. ¿En qué puedo orientarle nuevamente sobre el bienestar de su mascota?',
          time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  const suggestions = [
    {
      text: '¿Qué alimentos cotidianos de consumo humano resultan altamente nocivos o tóxicos para un perro?',
      label: 'Alimentos tóxicos',
      icon: ShieldAlert
    },
    {
      text: '¿Cuáles son los indicios conductuales o físicos de deshidratación en cachorros?',
      label: 'Detectar deshidratación',
      icon: BookOpen
    },
    {
      text: '¿Cómo puedo calcular el nivel diario de ejercicio para un perro según su rango de peso?',
      label: 'Ejercicio por peso',
      icon: Activity
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-16 h-[calc(100vh-120px)] md:h-[calc(100vh-160px)] flex flex-col justify-between">
      
      {/* Intro and banner */}
      <div className="space-y-2 shrink-0">
        <h2 className="text-3xl font-extrabold font-headline-lg text-[#006c49] flex items-center gap-2">
          <HeartPulse className="w-8 h-8 text-[#10b981]" /> Asistente de Bienestar Canino
        </h2>
        <p className="text-[#3c4a42] text-sm max-w-3xl leading-relaxed">
          Consulta preventiva inteligente conectada en tiempo real. Obtén orientación instantánea sobre nutrición, pautas físicas saludables, higiene básica o señales tempranas de alerta.
        </p>
      </div>

      {/* Main split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow overflow-hidden min-h-0">
        
        {/* Left Side: Preventive info panels (hidden on mobile, same as original code layout) */}
        <aside className="hidden lg:flex lg:col-span-4 flex-col gap-4 overflow-y-auto custom-scroll pr-1">
          
          {/* Confianza card */}
          <div className="bg-white p-5 rounded-2xl border border-[#e5eeff] shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 text-[#0b1c30] font-bold text-xs uppercase tracking-wide border-b border-[#e5eeff] pb-3">
              <BookOpen className="w-4 h-4 text-[#10b981]" strokeWidth={2.5} />
              Fuentes de Referencia
            </div>
            <p className="text-xs text-[#6c7a71] leading-relaxed">
              Las orientaciones y respuestas de este asistente inteligente están basadas en manuales de medicina veterinaria preventiva de asociaciones caninas globales.
            </p>
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0b1c30] bg-[#f8f9ff] p-2.5 rounded-xl border border-[#e5eeff]">
                <BookmarkCheck className="w-4 h-4 text-[#10b981]" />
                Asociaciones de Medicina Canina
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0b1c30] bg-[#f8f9ff] p-2.5 rounded-xl border border-[#e5eeff]">
                <BookmarkCheck className="w-4 h-4 text-[#10b981]" />
                Manuales de Nutrición de Precisión
              </div>
            </div>
          </div>

          {/* Emergency Alert card */}
          <div className="bg-[#ba1a1a]/10 border border-[#ba1a1a]/20 p-5 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-[#ba1a1a] font-bold text-sm">
              <HeartOff className="w-4 h-4 text-[#ba1a1a]" strokeWidth={2.5} />
              Señales de Alerta Crítica
            </div>
            <p className="text-xs text-[#93000a] leading-relaxed font-medium">
              Si su compañero presenta letargo severo, encías pálidas, vómitos repetitivos, o dificultad extrema para respirar, no use el chat. Acuda inmediatamente a urgencias veterinarias físicas.
            </p>
          </div>

          {/* Sugg card */}
          <div className="bg-white p-5 rounded-2xl border border-[#e5eeff] shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wide text-[#6c7a71]">Ejes de consulta sugeridos</h3>
            <ul className="text-xs text-[#0b1c30] font-medium space-y-2">
              <li className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-[#10b981]" />
                Nivel de ejercicio idóneo por raza
              </li>
              <li className="flex items-center gap-2">
                <Apple className="w-3.5 h-3.5 text-[#10b981]" />
                Ingredientes y alimentos dañinos
              </li>
              <li className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#10b981]" />
                Calendarios estándar de vacunación
              </li>
            </ul>
          </div>

        </aside>

        {/* Central Chat Bot Panel */}
        <section className="lg:col-span-8 bg-white rounded-3xl border border-[#e5eeff] shadow-sm flex flex-col overflow-hidden h-full">
          
          {/* Chat Header */}
          <div className="bg-[#f8f9ff] px-6 py-4 border-b border-[#e5eeff] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0b1c30] flex items-center justify-center text-white relative">
                <HeartPulse className="w-5 h-5 text-[#10b981]" strokeWidth={2} />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#10b981] border-2 border-[#f8f9ff] rounded-full animate-pulse"></span>
              </div>
              <div>
                <h2 className="text-sm font-black text-[#0b1c30] tracking-wide">Especialista de Bienestar KIRA.AI</h2>
                <p className="text-[10px] text-[#6c7a71] font-semibold leading-tight">Orientación médica preventiva y pautas nutricionales</p>
              </div>
            </div>
            
            <button 
              onClick={handleClearHistory}
              className="w-9 h-9 rounded-xl border border-[#bbcabf]/30 hover:bg-[#ffdad6] hover:text-[#ba1a1a] hover:border-[#ffdad6] flex items-center justify-center text-[#6c7a71] transition-all cursor-pointer"
              title="Limpiar Conversación"
            >
              <Trash2 className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Message view wrappers */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#fafaf9] flex flex-col gap-4 custom-scroll">
            {messages.map((msg) => {
              const isUser = msg.sender === 'usuario';
              const isSystem = msg.sender === 'sistema';

              return (
                <div 
                  key={msg.id}
                  className={`flex items-start gap-3 max-w-[85%] animate-fade-in ${
                    isUser ? 'self-end flex-row-reverse' : 'self-start'
                  }`}
                >
                  {/* Avatar Icon */}
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                    isUser 
                      ? 'bg-[#10b981] text-[#0b1c30]' 
                      : isSystem
                        ? 'bg-[#ba1a1a]/10 text-[#ba1a1a]'
                        : 'bg-[#0b1c30] text-white'
                  }`}>
                    {isUser ? (
                      <User className="w-4 h-4 text-[#0b1c30]" />
                    ) : isSystem ? (
                      <Info className="w-4 h-4" />
                    ) : (
                      <HeartPulse className="w-4 h-4 text-[#10b981]" />
                    )}
                  </div>

                  {/* Bubble content */}
                  <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed border ${
                    isUser 
                      ? 'bg-[#10b981] text-[#0b1c30] rounded-tr-none font-medium border-[#10b981]/30' 
                      : isSystem
                        ? 'bg-[#ba1a1a]/5 text-[#93000a] rounded-tl-none border-[#ba1a1a]/20'
                        : 'bg-white text-[#0b1c30] rounded-tl-none border-[#e5eeff]'
                  }`}>
                    <div className="flex justify-between items-center gap-4 mb-1 border-b border-black/5 pb-1">
                      <span className={`text-[9px] font-black uppercase tracking-wider ${
                        isUser ? 'text-[#0b1c30]/80' : isSystem ? 'text-[#ba1a1a]' : 'text-[#10b981]'
                      }`}>
                        {isUser ? 'Tú' : isSystem ? 'Aviso del Sistema' : 'Especialista Virtual'}
                      </span>
                      <span className="text-[8px] opacity-65 font-mono">{msg.time}</span>
                    </div>
                    <div className="whitespace-pre-wrap font-sans text-xs md:text-sm">{msg.text}</div>
                  </div>
                </div>
              );
            })}

            {/* Bouncing typing indicator */}
            {loading && (
              <div className="flex items-start gap-3 max-w-[80%] self-start animate-pulse">
                <div className="w-8 h-8 rounded-xl bg-[#0b1c30] flex items-center justify-center text-white shrink-0 shadow-sm">
                  <HeartPulse className="w-4 h-4 text-[#10b981]" />
                </div>
                <div className="bg-white px-5 py-4 rounded-2xl rounded-tl-none shadow-sm border border-[#e5eeff] flex items-center gap-1.5">
                  <Loader2 className="w-4 h-4 animate-spin text-[#10b981]" />
                  <span className="text-xs text-[#6c7a71] font-semibold">Generando respuesta veterinaria...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick interactive suggestions */}
          {messages.length === 1 && !loading && (
            <div className="px-6 py-3 bg-[#f8f9ff] border-t border-[#e5eeff] flex flex-wrap gap-2 shrink-0">
              {suggestions.map((sug, i) => {
                const Icon = sug.icon;
                return (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(sug.text)}
                    className="text-xs bg-white hover:bg-[#0b1c30] hover:text-white text-[#0b1c30] px-3.5 py-2.5 rounded-xl border border-[#e5eeff] shadow-sm transition-all flex items-center gap-2 font-semibold active:scale-95 cursor-pointer"
                  >
                    <Icon className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
                    {sug.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Message input bar */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(input);
            }}
            className="p-4 bg-white border-t border-[#e5eeff] flex items-center gap-3 shrink-0"
          >
            <div className="flex-1 bg-[#f8f9ff] border-2 border-[#e5eeff] focus-within:border-[#10b981] rounded-2xl flex items-center px-4 py-2.5 transition-all">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describa su inquietud o consulte un síntoma canino..." 
                className="w-full bg-transparent border-none text-sm text-[#0b1c30] focus:outline-none placeholder-[#6c7a71]/80 font-semibold"
                autoComplete="off" 
                disabled={loading}
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="w-12 h-12 bg-[#10b981] hover:bg-[#006c49] disabled:bg-[#bbcabf] disabled:cursor-not-allowed text-[#0b1c30] rounded-2xl flex items-center justify-center transition-all shadow-md shrink-0 active:scale-95 cursor-pointer"
              aria-label="Enviar consulta"
            >
              <SendHorizontal className="w-5 h-5 text-[#0b1c30]" />
            </button>
          </form>

        </section>

      </div>
    </div>
  );
}
