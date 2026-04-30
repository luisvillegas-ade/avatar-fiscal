'use client';

import { useState } from 'react';
import { X, Book, Users, Code, Gamepad2, MessageSquare, FileText, Shield, Landmark, Building2, ChevronRight, ExternalLink } from 'lucide-react';

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'usuario' | 'tecnica';

export default function DocumentationModal({ isOpen, onClose }: DocumentationModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('usuario');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl w-[90%] max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-700 bg-zinc-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-salta-bordo flex items-center justify-center">
              <Book className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Documentación</h2>
              <p className="text-xs text-zinc-400">Avatar Fiscal - Simulador Tributario</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-700">
          <button
            onClick={() => setActiveTab('usuario')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 ${
              activeTab === 'usuario'
                ? 'text-salta-bordo border-salta-bordo bg-zinc-800/30'
                : 'text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-zinc-800/20'
            }`}
          >
            <Users className="w-4 h-4" />
            Guía de Usuario
          </button>
          <button
            onClick={() => setActiveTab('tecnica')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 ${
              activeTab === 'tecnica'
                ? 'text-salta-bordo border-salta-bordo bg-zinc-800/30'
                : 'text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-zinc-800/20'
            }`}
          >
            <Code className="w-4 h-4" />
            Documentación Técnica
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-140px)] p-6">
          {activeTab === 'usuario' ? (
            <UserGuide />
          ) : (
            <TechnicalDocs />
          )}
        </div>
      </div>
    </div>
  );
}

function UserGuide() {
  return (
    <div className="space-y-8">
      {/* Introducción */}
      <section>
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-salta-bordo" />
          ¿Qué es Avatar Fiscal?
        </h3>
        <p className="text-sm text-zinc-300 leading-relaxed">
          Avatar Fiscal es un simulador tributario interactivo diseñado para ayudarte a comprender 
          tus obligaciones fiscales de manera didáctica. A través de un juego 2D, podrás interactuar 
          con asesores virtuales que representan a los principales organismos recaudadores: ARCA 
          (impuestos nacionales), DGR Salta (impuestos provinciales) y Municipalidad de Salta 
          (tasas municipales).
        </p>
        <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <p className="text-xs text-amber-400 font-medium">
            Importante: Este simulador es orientativo y no sustituye el asesoramiento de un 
            contador público matriculado. Siempre consultá con un profesional para tomar decisiones fiscales.
          </p>
        </div>
      </section>

      {/* Cómo usar */}
      <section>
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <FileText className="w-5 h-5 text-salta-bordo" />
          Cómo usar el simulador
        </h3>
        <div className="space-y-4">
          <Step 
            number={1} 
            title="Cargá tus datos fiscales (opcional)"
            description="En el panel izquierdo, completá la información sobre tu negocio: ventas, compras, condición frente al IVA, ubicación y medios de cobro. Estos datos ayudarán a los asesores a darte respuestas más precisas."
          />
          <Step 
            number={2} 
            title="Explorá el mundo virtual"
            description="Usá las teclas WASD o las flechas del teclado para mover a tu personaje por el escenario. Encontrarás diferentes oficinas y personajes."
          />
          <Step 
            number={3} 
            title="Acercate a un asesor"
            description="Caminá hacia cualquiera de los personajes (ARCA, Rentas Salta o Muni Salta) y presioná ESPACIO para interactuar. Esto activará el chat con ese asesor."
          />
          <Step 
            number={4} 
            title="Realizá tu consulta"
            description="Una vez activado el chat, podés escribir tu consulta o usar el botón 'Consultar al Experto' para enviar automáticamente tus datos fiscales. También podés consultar las últimas noticias del organismo."
          />
        </div>
      </section>

      {/* Controles */}
      <section>
        <h3 className="text-lg font-bold text-white mb-3">Controles del juego</h3>
        <div className="grid grid-cols-2 gap-3">
          <ControlItem keys={['W', 'A', 'S', 'D']} action="Mover personaje" />
          <ControlItem keys={['↑', '←', '↓', '→']} action="Mover personaje (alternativo)" />
          <ControlItem keys={['ESPACIO']} action="Interactuar con NPCs" />
          <ControlItem keys={['ESC']} action="Abrir menú del juego" />
        </div>
      </section>

      {/* NPCs */}
      <section>
        <h3 className="text-lg font-bold text-white mb-3">Los Asesores Virtuales</h3>
        <div className="grid gap-3">
          <NpcCard 
            name="ARCA" 
            description="Agencia de Recaudación y Control Aduanero. Te asesora sobre impuestos nacionales como IVA, Ganancias, Monotributo y obligaciones ante la AFIP."
            color="bg-[#722F37]"
            icon={Shield}
          />
          <NpcCard 
            name="DGR Salta" 
            description="Dirección General de Rentas de Salta. Te orienta sobre Ingresos Brutos, Impuesto Inmobiliario, Sellos y otros tributos provinciales."
            color="bg-blue-700"
            icon={Landmark}
          />
          <NpcCard 
            name="Muni Salta" 
            description="Municipalidad de Salta. Te informa sobre tasas municipales, habilitaciones comerciales, DREI y tributos locales."
            color="bg-emerald-700"
            icon={Building2}
          />
        </div>
      </section>

      {/* No inscripto */}
      <section>
        <h3 className="text-lg font-bold text-white mb-3">¿No estás inscripto?</h3>
        <p className="text-sm text-zinc-300 leading-relaxed">
          Si todavía no estás inscripto en ningún régimen fiscal, podés usar el botón 
          &quot;¿No estás inscripto?&quot; en el panel izquierdo. Completá la información sobre 
          tu situación y elegí a qué organismo querés consultar para recibir orientación 
          sobre cómo formalizarte.
        </p>
      </section>
    </div>
  );
}

function TechnicalDocs() {
  return (
    <div className="space-y-8">
      {/* Arquitectura */}
      <section>
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <Code className="w-5 h-5 text-salta-bordo" />
          Arquitectura del Proyecto
        </h3>
        <p className="text-sm text-zinc-300 leading-relaxed mb-4">
          Avatar Fiscal es una aplicación web que combina un juego 2D desarrollado en RPG Maker MV 
          con una interfaz moderna construida en Next.js. La comunicación entre ambos se realiza 
          mediante postMessage API.
        </p>
        <div className="bg-zinc-800 rounded-lg p-4 font-mono text-xs text-zinc-300">
          <pre>{`avatar-fiscal/
├── app/
│   ├── page.tsx          # Página principal
│   ├── layout.tsx        # Layout con metadata
│   └── api/chat/         # API de chat con IA
├── components/
│   ├── AvatarPanel.tsx   # Panel del chatbot
│   ├── FiscalDataPanel.tsx # Panel de datos fiscales
│   ├── TutorialOverlay.tsx # Tutorial inicial
│   └── DocumentationModal.tsx # Esta documentación
├── public/juego/         # Juego RPG Maker MV
│   └── AvatarFiscal/www/
│       ├── index.html    # Entry point del juego
│       ├── data/         # Mapas y eventos
│       └── js/           # Lógica del juego
└── tailwind.config.ts    # Configuración de estilos`}</pre>
        </div>
      </section>

      {/* Tecnologías */}
      <section>
        <h3 className="text-lg font-bold text-white mb-3">Stack Tecnológico</h3>
        <div className="grid grid-cols-2 gap-3">
          <TechCard name="Next.js 15" description="Framework React con App Router" />
          <TechCard name="TypeScript" description="Tipado estático" />
          <TechCard name="Tailwind CSS" description="Estilos utilitarios" />
          <TechCard name="Vercel AI SDK 6" description="Streaming, tools y agentes" />
          <TechCard name="Vercel Workflows" description="Análisis fiscal durable" />
          <TechCard name="RPG Maker MV" description="Motor del juego 2D" />
        </div>
      </section>

      {/* Vercel Workflows */}
      <section>
        <h3 className="text-lg font-bold text-white mb-3">Vercel Workflows</h3>
        <p className="text-sm text-zinc-300 leading-relaxed mb-4">
          Avatar Fiscal integra Vercel Workflows para análisis fiscales durables y confiables. 
          El workflow ejecuta análisis paralelos en los 3 organismos (ARCA, DGR, Municipalidad) 
          y genera un reporte completo con obligaciones, recomendaciones y alertas.
        </p>
        
        <div className="bg-zinc-800 rounded-lg p-4 font-mono text-xs text-zinc-300 mb-4">
          <pre>{`// Workflow de Análisis Fiscal
export async function analizarSituacionFiscal(datos) {
  'use workflow';
  
  // Análisis paralelo de los 3 organismos
  const [arca, dgr, muni] = await Promise.all([
    analizarObligacionesArca(datos),
    analizarObligacionesDgr(datos),
    analizarObligacionesMuni(datos),
  ]);
  
  // Generar resumen ejecutivo
  const resumen = await generarResumenEjecutivo(...);
  
  return { arca, dgr, muni, resumen };
}`}</pre>
        </div>
        
        <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
          <p className="text-xs text-purple-400">
            Los workflows son durables: si hay un error, se reintentan automáticamente. 
            Cada paso (step) se ejecuta de forma aislada y sus resultados se persisten.
          </p>
        </div>
      </section>

      {/* Comunicación */}
      <section>
        <h3 className="text-lg font-bold text-white mb-3">Comunicación Juego - App</h3>
        <p className="text-sm text-zinc-300 leading-relaxed mb-4">
          El juego se ejecuta en un iframe y se comunica con la aplicación Next.js mediante 
          la API postMessage. Los mensajes principales son:
        </p>
        <div className="space-y-2">
          <MessageDoc 
            type="CHANGE_NPC" 
            direction="Juego → App"
            description="Se envía cuando el jugador interactúa con un NPC. Incluye el rol (arca, dgr, muni)."
          />
          <MessageDoc 
            type="LEAVE_NPC" 
            direction="Juego → App"
            description="Se envía cuando el jugador se aleja del NPC (más de 2 tiles de distancia)."
          />
          <MessageDoc 
            type="TOGGLE_AUDIO" 
            direction="App → Juego"
            description="Controla el volumen del juego. Incluye el estado muted (true/false)."
          />
        </div>
      </section>

      {/* API */}
      <section>
        <h3 className="text-lg font-bold text-white mb-3">API de Chat</h3>
        <p className="text-sm text-zinc-300 leading-relaxed mb-4">
          El endpoint <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-xs">/api/chat</code> maneja 
          las conversaciones con los asesores virtuales. Utiliza el Vercel AI SDK 6 con streaming y tools.
        </p>
        <div className="bg-zinc-800 rounded-lg p-4 font-mono text-xs text-zinc-300">
          <pre>{`// API con Context7 MCP Tools
POST /api/chat

// Tools disponibles:
// - searchFiscalDocumentation
// - getVencimientos

// El modelo decide cuándo usar las 
// herramientas para obtener info actualizada`}</pre>
        </div>
      </section>

      {/* Contribuir */}
      <section>
        <h3 className="text-lg font-bold text-white mb-3">Cómo Contribuir</h3>
        <div className="space-y-3">
          <ContributeStep 
            number={1}
            title="Fork del repositorio"
            description="Cloná el repositorio desde GitHub y creá tu propia rama de desarrollo."
          />
          <ContributeStep 
            number={2}
            title="Configurá el entorno"
            description="Instalá las dependencias con pnpm install y configurá las variables de entorno."
          />
          <ContributeStep 
            number={3}
            title="Desarrollá tu feature"
            description="Seguí las convenciones del proyecto y escribí código limpio y documentado."
          />
          <ContributeStep 
            number={4}
            title="Enviá un Pull Request"
            description="Describí los cambios realizados y esperá la revisión del equipo."
          />
        </div>
      </section>

      {/* Variables de entorno */}
      <section>
        <h3 className="text-lg font-bold text-white mb-3">Variables de Entorno</h3>
        <div className="bg-zinc-800 rounded-lg p-4 font-mono text-xs text-zinc-300">
          <pre>{`# .env.local
# No se requieren variables obligatorias
# El AI SDK usa el gateway de Vercel por defecto

# Opcional: Para otros proveedores de IA
# AI_GATEWAY_API_KEY=tu-api-key`}</pre>
        </div>
      </section>
    </div>
  );
}

// Componentes auxiliares
function Step({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex gap-3">
      <div className="w-7 h-7 rounded-full bg-salta-bordo flex items-center justify-center flex-shrink-0">
        <span className="text-xs font-bold text-white">{number}</span>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-white">{title}</h4>
        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function ControlItem({ keys, action }: { keys: string[]; action: string }) {
  return (
    <div className="flex items-center gap-2 bg-zinc-800/50 rounded-lg p-3">
      <div className="flex gap-1">
        {keys.map((key) => (
          <kbd key={key} className="px-2 py-1 bg-zinc-700 rounded text-[10px] font-mono text-zinc-200 border border-zinc-600">
            {key}
          </kbd>
        ))}
      </div>
      <ChevronRight className="w-3 h-3 text-zinc-600" />
      <span className="text-xs text-zinc-300">{action}</span>
    </div>
  );
}

function NpcCard({ name, description, color, icon: Icon }: { name: string; description: string; color: string; icon: typeof Shield }) {
  return (
    <div className="flex gap-3 bg-zinc-800/50 rounded-lg p-3">
      <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-white">{name}</h4>
        <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function TechCard({ name, description }: { name: string; description: string }) {
  return (
    <div className="bg-zinc-800/50 rounded-lg p-3">
      <h4 className="text-sm font-semibold text-white">{name}</h4>
      <p className="text-[10px] text-zinc-500 mt-0.5">{description}</p>
    </div>
  );
}

function MessageDoc({ type, direction, description }: { type: string; direction: string; description: string }) {
  return (
    <div className="bg-zinc-800/50 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-1">
        <code className="text-xs font-mono text-salta-bordo">{type}</code>
        <span className="text-[10px] text-zinc-500 bg-zinc-700 px-1.5 py-0.5 rounded">{direction}</span>
      </div>
      <p className="text-xs text-zinc-400">{description}</p>
    </div>
  );
}

function ContributeStep({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex gap-3 bg-zinc-800/30 rounded-lg p-3">
      <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center flex-shrink-0">
        <span className="text-[10px] font-bold text-zinc-300">{number}</span>
      </div>
      <div>
        <h4 className="text-sm font-medium text-white">{title}</h4>
        <p className="text-xs text-zinc-500 mt-0.5">{description}</p>
      </div>
    </div>
  );
}
