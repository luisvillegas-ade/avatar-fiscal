'use client';

import { useEffect, useState } from 'react';
import AvatarPanel from '@/components/AvatarPanel';

export default function Home() {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // In production, you should check event.origin for security
      console.log('Mensaje recibido desde el iframe:', event.data);
      
      // Here you can handle specific messages from the game/simulation
      if (event.data?.type === 'GAME_READY') {
        console.log('El simulador está listo');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <main className="flex min-h-screen bg-black overflow-hidden">
      {/* Lado Izquierdo: Iframe (70vw) */}
      <div className="w-[70vw] h-screen relative bg-zinc-900 overflow-hidden border-r border-zinc-800">
        <iframe
          src="/juego/index.html"
          className={`w-full h-full border-none transition-opacity duration-1000 ${
            iframeLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIframeLoaded(true)}
          title="Simulador Fiscal"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        {!iframeLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-950">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-salta-bordo border-t-transparent rounded-full animate-spin" />
              <p className="text-zinc-500 text-sm font-medium animate-pulse">Iniciando simulador...</p>
            </div>
          </div>
        )}
      </div>

      {/* Lado Derecho: Panel (30vw) */}
      <div className="w-[30vw] h-screen overflow-hidden flex flex-col">
        <AvatarPanel />
      </div>
    </main>
  );
}
