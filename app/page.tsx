'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import AvatarPanel, { AvatarPanelRef } from '@/components/AvatarPanel';
import FiscalDataPanel from '@/components/FiscalDataPanel';
import TutorialOverlay from '@/components/TutorialOverlay';

export default function Home() {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [tutorialComplete, setTutorialComplete] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Inicia muteado por defecto
  const avatarPanelRef = useRef<AvatarPanelRef>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

  const handleChangeNpc = (npc: 'arca' | 'dgr' | 'muni') => {
    avatarPanelRef.current?.changeNpc(npc);
  };

  const toggleMute = useCallback(() => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    // Enviar mensaje al iframe para silenciar/activar audio
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'TOGGLE_AUDIO',
        muted: newMuted
      }, '*');
    }
  }, [isMuted]);

  // Enviar estado de mute inicial cuando el iframe carga
  useEffect(() => {
    if (iframeLoaded && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'TOGGLE_AUDIO',
        muted: isMuted
      }, '*');
    }
  }, [iframeLoaded, isMuted]);

  return (
    <main className="flex min-h-screen bg-black overflow-hidden">
      {/* Tutorial Overlay */}
      {!tutorialComplete && (
        <TutorialOverlay onComplete={() => setTutorialComplete(true)} />
      )}
      {/* Panel Izquierdo: Datos Fiscales */}
      <div className="w-[280px] h-screen border-r border-zinc-800 bg-zinc-950 flex-shrink-0">
        <FiscalDataPanel onSendToChat={handleSendToChat} onChangeNpc={handleChangeNpc} />
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
            ref={iframeRef}
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
        <div className="h-14 bg-zinc-900/90 border-t border-zinc-800 flex flex-col justify-center px-4 gap-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-[10px] text-zinc-500">
              <span>WASD o Flechas para moverse</span>
              <span className="text-zinc-700">|</span>
              <span>ESPACIO para interactuar</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleMute}
                className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-medium transition-all ${
                  isMuted 
                    ? 'bg-zinc-700 text-zinc-400 hover:bg-zinc-600' 
                    : 'bg-green-700/50 text-green-300 hover:bg-green-700/70'
                }`}
              >
                {isMuted ? (
                  <>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                    Sonido OFF
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                    Sonido ON
                  </>
                )}
              </button>
              <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 text-[9px] font-semibold rounded uppercase tracking-wide">Beta</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-[9px] text-zinc-500">
            <span className="text-amber-500/70">Aviso:</span>
            <span>Este simulador es orientativo y de ninguna forma sustituye el asesoramiento de un contador profesional.</span>
            <span className="text-zinc-600">|</span>
            <span className="font-medium text-zinc-400">Siempre consulte con un contador matriculado.</span>
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
