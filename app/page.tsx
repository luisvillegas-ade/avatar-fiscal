'use client';

import { useEffect, useState } from 'react';
import AvatarPanel from '@/components/AvatarPanel';
import { TopIndicators, BottomIndicators, LeftSideIndicators } from '@/components/BusinessIndicators';

export default function Home() {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log('Mensaje recibido desde el iframe:', event.data);
      if (event.data?.type === 'GAME_READY') {
        setIframeLoaded(true);
      }
      if (event.data?.type === 'AVATAR_INTERACTION') {
        console.log('Interacción con el Avatar Fiscal iniciada desde el juego');
        // Aquí podrías disparar alguna animación o mensaje automático
      }
    };

    // Auto-load after 5 seconds if iframe event fails
    const timer = setTimeout(() => setIframeLoaded(true), 5000);

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(timer);
    };
  }, []);

  return (
    <main className="flex min-h-screen bg-black overflow-hidden">
      {/* Lado Izquierdo: Juego con Indicadores (70vw) */}
      <div className="w-[70vw] h-screen flex flex-col bg-zinc-900 border-r border-zinc-800">
        {/* Indicadores Superiores */}
        <TopIndicators />
        
        {/* Area del Juego */}
        <div className="flex-1 relative overflow-hidden">
          {/* Indicadores laterales */}
          <LeftSideIndicators />
          
          <iframe
            src="/juego/index.html"
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
        
        {/* Indicadores Inferiores */}
        <BottomIndicators />
      </div>

      {/* Lado Derecho: Panel Chat (30vw) */}
      <div className="w-[30vw] h-screen overflow-hidden flex flex-col">
        <AvatarPanel />
      </div>
    </main>
  );
}
