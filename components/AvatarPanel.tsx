'use client';

import { useState } from 'react';
import { useChat } from 'ai/react';
import { Send, FileText, User, Bot, Loader2 } from 'lucide-react';

export default function AvatarPanel() {
  const [csvContent, setCsvContent] = useState<string | null>(null);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: { csvContent },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCsvContent(event.target?.result as string);
      };
      reader.readAsText(file);
    }
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
          <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-zinc-500 space-y-2 opacity-50">
            <Bot className="w-12 h-12" />
            <p className="text-sm font-medium">¿En qué puedo ayudarte hoy?</p>
            {csvContent ? (
              <span className="text-xs text-green-400 font-mono italic">CSV Cargado ✓</span>
            ) : (
              <span className="text-xs">Sube tu CSV de ARCA para comenzar</span>
            )}
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
              {m.content}
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
        onSubmit={handleSubmit}
        className="p-4 border-t border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky bottom-0"
      >
        <div className="relative group">
          <input
            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-salta-bordo/50 transition-all placeholder:text-zinc-500 pr-12"
            value={input}
            placeholder="Escribe tu consulta fiscal..."
            onChange={handleInputChange}
          />
          <button
            type="submit"
            disabled={isLoading || !input}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-salta-bordo text-white rounded-lg disabled:opacity-50 disabled:grayscale transition-all hover:scale-105 active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
