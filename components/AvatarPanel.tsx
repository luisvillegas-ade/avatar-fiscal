'use client';

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { Send, Bot, Loader2, AlertCircle, Building2, Landmark, ShieldCheck, Newspaper } from 'lucide-react';

type NpcRole = 'arca' | 'dgr' | 'muni';

const npcConfig = {
  arca: { name: 'ARCA (ex AFIP)', color: 'bg-salta-bordo', border: 'border-salta-bordo', text: 'text-white', title: 'Impuestos Nacionales', icon: ShieldCheck },
  dgr: { name: 'DGR Salta', color: 'bg-blue-700', border: 'border-blue-700', text: 'text-white', title: 'Impuestos Provinciales', icon: Landmark },
  muni: { name: 'Muni Salta', color: 'bg-emerald-700', border: 'border-emerald-700', text: 'text-white', title: 'Tasas Municipales', icon: Building2 },
};

export interface AvatarPanelRef {
  sendMessageToChat: (message: string) => void;
  changeNpc: (npc: 'arca' | 'dgr' | 'muni') => void;
  isNpcActive: () => boolean;
  getActiveNpc: () => 'arca' | 'dgr' | 'muni' | null;
}

const AvatarPanel = forwardRef<AvatarPanelRef>(function AvatarPanel(_, ref) {
  const [input, setInput] = useState('');
  const [errorLocal, setErrorLocal] = useState<string | null>(null);
  const [activeNpc, setActiveNpc] = useState<NpcRole | null>(null);
  const [showNewsConfirm, setShowNewsConfirm] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'CHANGE_NPC' && event.data?.role) {
        setActiveNpc(event.data.role as NpcRole);
      }
      // Cuando el usuario se aleja del NPC o cierra el diálogo
      if (event.data?.type === 'LEAVE_NPC') {
        setActiveNpc(null);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const isNpcActive = activeNpc !== null;
  const currentNpc = activeNpc || 'arca'; // Fallback para mostrar algo cuando no hay NPC activo
  
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
    onError: (err) => {
      console.error('Chat Error:', err);
      setErrorLocal(err.message || 'Error de conexión');
    }
  });

  const isLoading = status === 'submitted';

  const handleSendMessage = (text: string) => {
    if (!text.trim() || isLoading) return;
    setErrorLocal(null);
    sendMessage({ 
      text: `[ROLE:${activeNpc}] ${text}`
    });
  };

  useImperativeHandle(ref, () => ({
    sendMessageToChat: (message: string) => {
      if (isNpcActive) {
        handleSendMessage(message);
      }
    },
    changeNpc: (npc: 'arca' | 'dgr' | 'muni') => {
      setActiveNpc(npc);
    },
    isNpcActive: () => isNpcActive,
    getActiveNpc: () => activeNpc
  }));

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
    setInput('');
  };

  const handleRequestNews = () => {
    if (!isNpcActive) return;
    const npcName = npcConfig[currentNpc].name;
    handleSendMessage(`Hola, ¿podrías contarme las últimas noticias, novedades o cambios recientes relacionados con ${npcName}? Me interesa estar al tanto de cualquier actualización importante sobre trámites, vencimientos, nuevas regulaciones o cambios en los procedimientos.`);
    setShowNewsConfirm(false);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-zinc-100 border-l border-zinc-800">
      
      {/* Selector de NPCs - Solo muestra cuál está activo, no permite cambiar manualmente */}
      <div className="flex w-full bg-zinc-900 border-b border-zinc-800">
        {(Object.keys(npcConfig) as NpcRole[]).map((key) => {
          const isActive = activeNpc === key;
          const config = npcConfig[key];
          const Icon = config.icon;
          return (
            <div
              key={key}
              className={`flex-1 flex flex-col items-center justify-center p-2 text-xs font-medium transition-all duration-300 border-b-2
                ${isActive ? `${config.text} bg-zinc-800/50 ${config.border}` : 'text-zinc-500 border-transparent opacity-40'}
              `}
            >
              <Icon className={`w-4 h-4 mb-1 ${isActive ? '' : 'opacity-50'}`} />
              {config.name}
            </div>
          )
        })}
      </div>

      {isNpcActive ? (
        <div className="p-2.5 border-b border-zinc-700 bg-zinc-800 sticky top-0 z-10 flex items-center justify-between transition-colors duration-300">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full ${npcConfig[currentNpc].color} flex items-center justify-center shadow-md transition-colors duration-300`}>
              {(() => {
                 const ActiveIcon = npcConfig[currentNpc].icon;
                 return <ActiveIcon className="w-4 h-4 text-white" />;
              })()}
            </div>
            <div>
              <h2 className="text-xs font-semibold text-white">{npcConfig[currentNpc].name}</h2>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span className="text-[10px] text-zinc-400">{npcConfig[currentNpc].title}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowNewsConfirm(true)}
            className={`flex items-center gap-1 px-2 py-1 ${npcConfig[currentNpc].color} hover:opacity-90 text-white text-[10px] font-medium rounded-md transition-all hover:scale-105 active:scale-95`}
            title="Consultar últimas noticias"
          >
            <Newspaper className="w-3 h-3" />
            <span className="hidden sm:inline">Noticias</span>
          </button>
        </div>
      ) : (
        <div className="p-2.5 border-b border-zinc-700 bg-zinc-800/50 sticky top-0 z-10 flex items-center justify-center">
          <span className="text-xs text-zinc-500">Acercate a un asesor para chatear</span>
        </div>
      )}

      {/* Modal de confirmación de noticias */}
      {showNewsConfirm && isNpcActive && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 mx-4 max-w-[280px] shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center gap-3">
              <div className={`w-10 h-10 rounded-full ${npcConfig[currentNpc].color} flex items-center justify-center`}>
                <Newspaper className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">Consultar Noticias</h3>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  ¿Querés que {npcConfig[currentNpc].name} te cuente las últimas novedades y actualizaciones del organismo?
                </p>
              </div>
              <div className="flex gap-2 w-full mt-1">
                <button
                  onClick={() => setShowNewsConfirm(false)}
                  className="flex-1 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRequestNews}
                  className={`flex-1 px-3 py-2 ${npcConfig[currentNpc].color} hover:opacity-90 text-white text-xs font-medium rounded-lg transition-all`}
                >
                  Consultar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-3 space-y-3 relative">
        {/* Overlay cuando no hay NPC activo */}
        {!isNpcActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/90 z-10">
            <div className="flex flex-col items-center text-center space-y-4 px-6">
              <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center border-2 border-dashed border-zinc-600">
                <Bot className="w-8 h-8 text-zinc-500" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-zinc-300">Acercate a un asesor</p>
                <p className="text-xs text-zinc-500 leading-relaxed max-w-[200px]">
                  Caminá hacia los personajes en el juego para poder consultarles sobre tus tributos
                </p>
              </div>
              <div className="flex gap-2 mt-2">
                <div className={`w-8 h-8 rounded-full ${npcConfig.arca.color} flex items-center justify-center opacity-60`}>
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                <div className={`w-8 h-8 rounded-full ${npcConfig.dgr.color} flex items-center justify-center opacity-60`}>
                  <Landmark className="w-4 h-4 text-white" />
                </div>
                <div className={`w-8 h-8 rounded-full ${npcConfig.muni.color} flex items-center justify-center opacity-60`}>
                  <Building2 className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        )}

        {messages.length === 0 && !errorLocal && isNpcActive && (
          <div className="flex flex-col items-center justify-center h-full space-y-3 py-6">
            <div className={`w-12 h-12 rounded-full ${npcConfig[currentNpc].color} flex items-center justify-center shadow-lg`}>
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-medium text-white">¿En qué puedo ayudarte?</p>
              <p className="text-xs text-zinc-400">
                Asistente de <span className="text-zinc-200">{npcConfig[currentNpc].name}</span>
              </p>
            </div>
            <div className="bg-zinc-800 rounded-md p-2 max-w-[220px] border border-zinc-700">
              <p className="text-[10px] text-zinc-400 text-center leading-relaxed">
                Escribí tu consulta o usá el panel izquierdo para cargar tus datos fiscales
              </p>
            </div>
          </div>
        )}

        {errorLocal && (
          <div className="p-2 rounded-lg bg-red-950/30 border border-red-900/50 text-red-200 text-xs flex items-start gap-2 animate-fade-in">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[10px]">Error de conexión</p>
              <p className="opacity-80 text-[10px]">{errorLocal}</p>
            </div>
          </div>
        )}
        
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.role === 'assistant' && (
              <div className={`w-5 h-5 rounded-full ${npcConfig[currentNpc].color} flex items-center justify-center mr-1.5 mt-0.5 flex-shrink-0`}>
                <Bot className="w-2.5 h-2.5 text-white" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-lg p-2 text-xs ${
                m.role === 'user'
                  ? `bg-zinc-700 text-white rounded-tr-none`
                  : `bg-zinc-800 text-zinc-200 rounded-tl-none border-l-2 ${npcConfig[currentNpc].border}`
              }`}
            >
              {m.parts.map((part, i) => {
                if (part.type === 'text') {
                  let display = part.text;
                  if (display.startsWith('[ROLE:')) {
                    display = display.replace(/^\[ROLE:[a-z]+\]\s*/, '');
                  }
                  return <span key={i} className="leading-normal">{display}</span>;
                }
                return null;
              })}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-xl rounded-tl-none shadow-lg">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-400" />
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={onFormSubmit}
        className="p-3 border-t border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky bottom-0"
      >
        <div className="relative group">
          <input
            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-salta-bordo/50 transition-all placeholder:text-zinc-500 pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
            value={input}
            placeholder={isNpcActive ? "Escribe tu consulta fiscal..." : "Acercate a un asesor para chatear"}
            onChange={(e) => setInput(e.target.value)}
            disabled={!isNpcActive}
          />
          <button
            type="submit"
            disabled={status !== 'ready' || !input.trim() || !isNpcActive}
            className={`absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 ${npcConfig[currentNpc].color} text-white rounded-md disabled:opacity-50 disabled:grayscale transition-all hover:scale-105 active:scale-95`}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
});

export default AvatarPanel;
