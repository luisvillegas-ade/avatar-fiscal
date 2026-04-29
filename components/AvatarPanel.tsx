'use client';

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { Send, Bot, Loader2, AlertCircle, Building2, Landmark, ShieldCheck } from 'lucide-react';

type NpcRole = 'arca' | 'dgr' | 'muni';

const npcConfig = {
  arca: { name: 'ARCA (ex AFIP)', color: 'bg-salta-bordo', border: 'border-salta-bordo', text: 'text-white', title: 'Impuestos Nacionales', icon: ShieldCheck },
  dgr: { name: 'DGR Salta', color: 'bg-blue-700', border: 'border-blue-700', text: 'text-white', title: 'Impuestos Provinciales', icon: Landmark },
  muni: { name: 'Muni Salta', color: 'bg-emerald-700', border: 'border-emerald-700', text: 'text-white', title: 'Tasas Municipales', icon: Building2 },
};

export interface AvatarPanelRef {
  sendMessageToChat: (message: string) => void;
  changeNpc: (npc: 'arca' | 'dgr' | 'muni') => void;
}

const AvatarPanel = forwardRef<AvatarPanelRef>(function AvatarPanel(_, ref) {
  const [input, setInput] = useState('');
  const [errorLocal, setErrorLocal] = useState<string | null>(null);
  const [activeNpc, setActiveNpc] = useState<NpcRole>('arca');

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'CHANGE_NPC' && event.data?.role) {
        setActiveNpc(event.data.role as NpcRole);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);
  
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
      handleSendMessage(message);
    },
    changeNpc: (npc: 'arca' | 'dgr' | 'muni') => {
      setActiveNpc(npc);
    }
  }));

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-zinc-100 border-l border-zinc-800">
      
      {/* Selector de NPCs */}
      <div className="flex w-full bg-zinc-900 border-b border-zinc-800">
        {(Object.keys(npcConfig) as NpcRole[]).map((key) => {
          const isActive = activeNpc === key;
          const config = npcConfig[key];
          const Icon = config.icon;
          return (
            <button
              key={key}
              onClick={() => setActiveNpc(key)}
              className={`flex-1 flex flex-col items-center justify-center p-2 text-xs font-medium transition-all duration-300 border-b-2
                ${isActive ? `${config.text} bg-zinc-800/50 ${config.border}` : 'text-zinc-500 border-transparent hover:bg-zinc-800/30'}
              `}
            >
              <Icon className={`w-4 h-4 mb-1 ${isActive ? '' : 'opacity-50'}`} />
              {config.name}
            </button>
          )
        })}
      </div>

      <div className="p-2.5 border-b border-zinc-700 bg-zinc-800 sticky top-0 z-10 flex items-center transition-colors duration-300">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full ${npcConfig[activeNpc].color} flex items-center justify-center shadow-md transition-colors duration-300`}>
            {(() => {
               const ActiveIcon = npcConfig[activeNpc].icon;
               return <ActiveIcon className="w-4 h-4 text-white" />;
            })()}
          </div>
          <div>
            <h2 className="text-xs font-semibold text-white">{npcConfig[activeNpc].name}</h2>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="text-[10px] text-zinc-400">{npcConfig[activeNpc].title}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 && !errorLocal && (
          <div className="flex flex-col items-center justify-center h-full space-y-3 py-6">
            <div className={`w-12 h-12 rounded-full ${npcConfig[activeNpc].color} flex items-center justify-center shadow-lg`}>
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-medium text-white">¿En qué puedo ayudarte?</p>
              <p className="text-xs text-zinc-400">
                Asistente de <span className="text-zinc-200">{npcConfig[activeNpc].name}</span>
              </p>
            </div>
            <div className="bg-zinc-800 rounded-md p-2 max-w-[220px] border border-zinc-700">
              <p className="text-[10px] text-zinc-400 text-center leading-relaxed">
                Camina hacia los personajes de cada oficina fiscal para consultarles sobre tus tributos
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
              <div className={`w-5 h-5 rounded-full ${npcConfig[activeNpc].color} flex items-center justify-center mr-1.5 mt-0.5 flex-shrink-0`}>
                <Bot className="w-2.5 h-2.5 text-white" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-lg p-2 text-xs ${
                m.role === 'user'
                  ? `bg-zinc-700 text-white rounded-tr-none`
                  : `bg-zinc-800 text-zinc-200 rounded-tl-none border-l-2 ${npcConfig[activeNpc].border}`
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
            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-salta-bordo/50 transition-all placeholder:text-zinc-500 pr-10"
            value={input}
            placeholder="Escribe tu consulta fiscal..."
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={status !== 'ready' || !input.trim()}
            className={`absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 ${npcConfig[activeNpc].color} text-white rounded-md disabled:opacity-50 disabled:grayscale transition-all hover:scale-105 active:scale-95`}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
});

export default AvatarPanel;
