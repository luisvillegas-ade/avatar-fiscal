'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { Send, FileText, User, Bot, Loader2, AlertCircle } from 'lucide-react';

export default function AvatarPanel() {
  const [csvContent, setCsvContent] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [errorLocal, setErrorLocal] = useState<string | null>(null);
  
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
    onError: (err) => {
      console.error('Chat Error:', err);
      setErrorLocal(err.message || 'Error de conexión');
    }
  });

  // Based on lint: status is "error" | "submitted" | "ready"
  const isLoading = status === 'submitted';

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

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    setErrorLocal(null);

    sendMessage({ 
      text: input,
      //@ts-ignore
      data: { csvContent }
    });
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-zinc-100 border-l border-zinc-800">
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-salta-bordo flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight">AVATAR FISCAL</h2>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest">En línea</span>
            </div>
          </div>
        </div>
        <label className="cursor-pointer hover:bg-zinc-800 p-2 rounded-lg transition-colors">
          <FileText className="w-5 h-5 text-zinc-400" />
          <input 
            id="csv-upload-header"
            type="file" 
            accept=".csv" 
            onChange={handleFileUpload} 
            className="hidden" 
          />
        </label>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !errorLocal && (
          <div className="flex flex-col items-center justify-center h-full text-zinc-500 space-y-2 opacity-50">
            <Bot className="w-12 h-12" />
            <p className="text-sm font-medium">¿En qué puedo ayudarte hoy?</p>
            {csvContent ? (
              <span className="text-xs text-green-400 font-mono italic animate-pulse">CSV Cargado ✓</span>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <span className="text-xs">Sube tu CSV de ARCA para comenzar</span>
                <button 
                  onClick={() => document.getElementById('csv-upload-header')?.click()}
                  className="px-4 py-2 bg-salta-bordo rounded-lg text-xs font-bold hover:scale-105 transition-transform flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  CARGAR COMPROBANTES
                </button>
              </div>
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
        
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-lg ${
                m.role === 'user'
                  ? 'bg-salta-bordo text-white rounded-tr-none'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-tl-none'
              }`}
            >
              {/* v6 support for message parts */}
              {m.parts.map((part, i) => (
                part.type === 'text' ? <span key={i}>{part.text}</span> : null
              ))}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-2xl rounded-tl-none shadow-lg">
              <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={onFormSubmit}
        className="p-4 border-t border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky bottom-0"
      >
        <div className="relative group">
          <input
            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-salta-bordo/50 transition-all placeholder:text-zinc-500 pr-12"
            value={input}
            placeholder="Escribe tu consulta fiscal..."
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={status !== 'ready' || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-salta-bordo text-white rounded-lg disabled:opacity-50 disabled:grayscale transition-all hover:scale-105 active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
