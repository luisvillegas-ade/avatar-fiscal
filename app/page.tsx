'use client';

import { useEffect, useState, useRef } from 'react';
import AvatarPanel, { AvatarPanelRef } from '@/components/AvatarPanel';
import FiscalDataPanel from '@/components/FiscalDataPanel';

export default function Home() {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const avatarPanelRef = useRef<AvatarPanelRef>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log('Mensaje recibido desde el iframe:', event.data);
      if (event.data?.type === 'GAME_READY') {
        setIframeLoaded(true);
      }
      if (event.data?.type === 'AVATAR_INTERACTION') {
        console.log('Interacción con el Avatar Fiscal iniciada desde el juego');
      }
    };

    const timer = setTimeout(() => setIframeLoaded(true), 5000);

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(timer);
    };
  }, []);

  const handleSendToChat = (message: string) => {
    avatarPanelRef.current?.sendMessageToChat(message);
  };

  return (
    <main className="flex min-h-screen bg-black overflow-hidden">
      {/* Panel Izquierdo: Datos Fiscales */}
      <div className="w-[200px] h-screen border-r border-zinc-800 bg-zinc-950 flex-shrink-0">
        <FiscalDataPanel onSendToChat={handleSendToChat} />
      </div>

      {/* Centro: Juego con paneles arriba y abajo */}
      <div className="flex-1 h-screen flex flex-col">
        {/* Panel Superior */}
        <div className="h-12 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-center px-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-salta-bordo animate-pulse" />
            <h1 className="text-sm font-bold text-zinc-200 tracking-wide">AVATAR FISCAL</h1>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Simulador Tributario</span>
          </div>
        </div>

        {/* Iframe del Juego */}
        <div className="flex-1 relative bg-zinc-900 overflow-hidden">
          <iframe
            src="/juego/AvatarFiscal/www/index.html"
            className="w-full h-full border-none bg-black"
            onLoad={() => setIframeLoaded(true)}
            title="Simulador Fiscal"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          {!iframeLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-950 pointer-events-none transition-opacity duration-500">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-salta-bordo border-t-transparent rounded-full animate-spin" />
                <p className="text-zinc-500 text-sm font-medium animate-pulse">Iniciando simulador...</p>
              </div>
            </div>
          )}
        </div>

        {/* Panel Inferior */}
        <div className="h-10 bg-zinc-900/90 border-t border-zinc-800 flex items-center justify-between px-4">
          <div className="flex items-center gap-4 text-[10px] text-zinc-500">
            <span>WASD o Flechas para moverse</span>
            <span className="text-zinc-700">|</span>
            <span>ESPACIO para interactuar</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-zinc-600">
            <span>Completa tus datos fiscales a la izquierda</span>
          </div>
        </div>
      </div>

      {/* Panel Derecho: Chat */}
      <div className="w-[320px] h-screen overflow-hidden flex flex-col flex-shrink-0">
        <AvatarPanel ref={avatarPanelRef} />
      </div>
    </main>
  );
}
