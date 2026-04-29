'use client';

import { useState, useEffect, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { Send, FileText, Bot, Loader2, AlertCircle, Building2, Mountain, Landmark } from 'lucide-react';
import { NPC_CONFIGS, type NPCType, type NPCConfig } from '@/lib/npc-config';

// Extended message type to track which NPC responded
interface ExtendedMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  npcId?: NPCType;
  timestamp: Date;
}

// NPC Icons mapping
const NPC_ICONS: Record<NPCType, React.ReactNode> = {
  arca: <Landmark className="w-4 h-4" />,
  dgr: <Mountain className="w-4 h-4" />,
  municipalidad: <Building2 className="w-4 h-4" />,
};

export default function AvatarPanel() {
  const [csvContent, setCsvContent] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [errorLocal, setErrorLocal] = useState<string | null>(null);
  const [activeNPC, setActiveNPC] = useState<NPCType>('arca');
  const [chatHistory, setChatHistory] = useState<ExtendedMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
    onError: (err) => {
      console.error('Chat Error:', err);
      setErrorLocal(err.message || 'Error de conexión');
      setIsTyping(false);
    },
    onFinish: (message) => {
      // When assistant finishes, add to history with NPC info
      const content = message.parts
        .filter(p => p.type === 'text')
        .map(p => (p as { type: 'text'; text: string }).text)
        .join('');
      
      setChatHistory(prev => [...prev, {
        id: message.id,
        role: 'assistant',
        content,
        npcId: activeNPC,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }
  });

  const isLoading = status === 'submitted';

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  // Listen for NPC interactions from the game
  useEffect(() => {
    const handleGameMessage = (event: MessageEvent) => {
      if (event.data?.type === 'NPC_INTERACTION') {
        const npcId = event.data.npcId as NPCType;
        if (NPC_CONFIGS[npcId]) {
          setActiveNPC(npcId);
          // Add greeting from NPC
          const npc = NPC_CONFIGS[npcId];
          setChatHistory(prev => [...prev, {
            id: `greeting-${Date.now()}`,
            role: 'assistant',
            content: npc.greeting,
            npcId: npcId,
            timestamp: new Date()
          }]);
        }
      }
    };

    window.addEventListener('message', handleGameMessage);
    return () => window.removeEventListener('message', handleGameMessage);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCsvContent(event.target?.result as string);
        setErrorLocal(null);
      };
      reader.readAsText(file);
    }
  };

  const selectNPC = (npcId: NPCType) => {
    if (npcId === activeNPC) return;
    setActiveNPC(npcId);
    setMessages([]); // Clear AI SDK messages for new context
    
    // Add greeting from new NPC
    const npc = NPC_CONFIGS[npcId];
    setChatHistory(prev => [...prev, {
      id: `greeting-${Date.now()}`,
      role: 'assistant',
      content: npc.greeting,
      npcId: npcId,
      timestamp: new Date()
    }]);
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    setErrorLocal(null);
    setIsTyping(true);

    // Add user message to history
    setChatHistory(prev => [...prev, {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date()
    }]);

    sendMessage({ 
      text: input,
      //@ts-ignore - data is supported but not typed
      data: { csvContent, npcId: activeNPC }
    });
    setInput('');
  };

  const activeNPCConfig = NPC_CONFIGS[activeNPC];

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-zinc-100">
      {/* Header with NPC selector */}
      <div className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-10">
        {/* NPC Tabs */}
        <div className="flex">
          {Object.values(NPC_CONFIGS).map((npc) => (
            <button
              key={npc.id}
              onClick={() => selectNPC(npc.id)}
              className={`flex-1 px-3 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                activeNPC === npc.id
                  ? `${npc.borderColor} ${npc.textColor} bg-zinc-800/50`
                  : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5">
                {NPC_ICONS[npc.id]}
                <span className="hidden sm:inline">{npc.name}</span>
              </div>
              <div className="text-[9px] font-normal opacity-60 mt-0.5">
                {npc.jurisdiction}
              </div>
            </button>
          ))}
        </div>
        
        {/* Active NPC info */}
        <div className="px-4 py-2 flex items-center justify-between border-t border-zinc-800/50">
          <div className="flex items-center gap-2">
            <div 
              className={`w-8 h-8 rounded-full ${activeNPCConfig.bgColor} flex items-center justify-center`}
            >
              {NPC_ICONS[activeNPC]}
            </div>
            <div>
              <h2 className="text-xs font-bold tracking-tight">{activeNPCConfig.fullName}</h2>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] text-zinc-400 uppercase tracking-widest">Búsqueda web activa</span>
              </div>
            </div>
          </div>
          {activeNPC === 'arca' && (
            <label className="cursor-pointer hover:bg-zinc-800 p-2 rounded-lg transition-colors">
              <FileText className="w-4 h-4 text-zinc-400" />
              <input 
                id="csv-upload-header"
                type="file" 
                accept=".csv" 
                onChange={handleFileUpload} 
                className="hidden" 
              />
            </label>
          )}
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chatHistory.length === 0 && !errorLocal && (
          <div className="flex flex-col items-center justify-center h-full text-zinc-500 space-y-3 opacity-50">
            <Bot className="w-10 h-10" />
            <p className="text-sm font-medium text-center">
              Selecciona un asistente fiscal o interactúa con los NPCs en el juego
            </p>
            <div className="flex gap-2">
              {Object.values(NPC_CONFIGS).map((npc) => (
                <button
                  key={npc.id}
                  onClick={() => selectNPC(npc.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium ${npc.bgColor} text-white hover:opacity-80 transition-opacity`}
                >
                  {npc.name}
                </button>
              ))}
            </div>
            {csvContent && (
              <span className="text-xs text-green-400 font-mono italic animate-pulse mt-2">CSV Cargado</span>
            )}
          </div>
        )}

        {errorLocal && (
          <div className="p-3 rounded-lg bg-red-950/30 border border-red-900/50 text-red-200 text-xs flex items-start gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Error de conexión</p>
              <p className="opacity-80">{errorLocal}</p>
            </div>
          </div>
        )}
        
        {chatHistory.map((m) => {
          const npc = m.npcId ? NPC_CONFIGS[m.npcId] : null;
          
          return (
            <div
              key={m.id}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && npc && (
                <div 
                  className={`w-6 h-6 rounded-full ${npc.bgColor} flex items-center justify-center mr-2 mt-1 shrink-0`}
                >
                  {NPC_ICONS[npc.id]}
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl p-3 text-sm shadow-lg ${
                  m.role === 'user'
                    ? 'bg-zinc-700 text-white rounded-tr-none'
                    : npc 
                      ? `bg-zinc-900 ${npc.borderColor} border-l-2 text-zinc-100 rounded-tl-none`
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-tl-none'
                }`}
              >
                {m.role === 'assistant' && npc && (
                  <div className={`text-[10px] font-bold ${npc.textColor} uppercase tracking-wider mb-1`}>
                    {npc.name}
                  </div>
                )}
                <span className="whitespace-pre-wrap">{m.content}</span>
              </div>
            </div>
          );
        })}
        
        {isTyping && (
          <div className="flex justify-start">
            <div 
              className={`w-6 h-6 rounded-full ${activeNPCConfig.bgColor} flex items-center justify-center mr-2 mt-1`}
            >
              {NPC_ICONS[activeNPC]}
            </div>
            <div className={`bg-zinc-900 ${activeNPCConfig.borderColor} border-l-2 p-3 rounded-2xl rounded-tl-none shadow-lg`}>
              <div className={`text-[10px] font-bold ${activeNPCConfig.textColor} uppercase tracking-wider mb-1`}>
                {activeNPCConfig.name}
              </div>
              <div className="flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin text-zinc-400" />
                <span className="text-xs text-zinc-500">Buscando información...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input form */}
      <form
        onSubmit={onFormSubmit}
        className="p-3 border-t border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky bottom-0"
      >
        <div className="relative group">
          <input
            className={`w-full bg-zinc-800/50 border ${activeNPCConfig.borderColor} border-opacity-30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all placeholder:text-zinc-500 pr-12`}
            style={{ 
              // @ts-ignore
              '--tw-ring-color': activeNPCConfig.color 
            }}
            value={input}
            placeholder={`Consultar a ${activeNPCConfig.name}...`}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={status !== 'ready' || !input.trim()}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 ${activeNPCConfig.bgColor} text-white rounded-lg disabled:opacity-50 disabled:grayscale transition-all hover:scale-105 active:scale-95`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center justify-center gap-1 mt-2">
          <span className="text-[9px] text-zinc-600">Powered by Gemini</span>
          <span className="text-[9px] text-zinc-600">|</span>
          <span className="text-[9px] text-zinc-500">Búsqueda web activa</span>
        </div>
      </form>
    </div>
  );
}
