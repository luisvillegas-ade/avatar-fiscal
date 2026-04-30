'use client';

import { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, FileText, Users, MessageSquare, Send, Sparkles, CheckSquare, Square, Shield, UserX } from 'lucide-react';

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  highlight: 'left' | 'center' | 'right' | 'none';
  position: { top?: string; bottom?: string; left?: string; right?: string };
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: 'Carga tus datos fiscales',
    description: 'Completa el formulario de la izquierda con tu información: ventas netas, compras netas, actividad económica, categoría de monotributo y ubicación.',
    icon: <FileText className="w-6 h-6" />,
    highlight: 'left',
    position: { top: '30%', left: '220px' },
  },
  {
    id: 2,
    title: 'Camina hacia un experto',
    description: 'Usa las teclas WASD o las flechas para moverte por la oficina fiscal. Acércate a los personajes para interactuar con ellos.',
    icon: <Users className="w-6 h-6" />,
    highlight: 'center',
    position: { top: '40%', left: '50%' },
  },
  {
    id: 3,
    title: 'Mira el panel del chat',
    description: 'El panel derecho te muestra con qué experto estás hablando (ARCA, DGR Salta o Municipalidad). Puedes cambiar de experto usando las pestañas o caminando hacia otro personaje.',
    icon: <MessageSquare className="w-6 h-6" />,
    highlight: 'right',
    position: { top: '30%', right: '340px' },
  },
  {
    id: 4,
    title: 'Consulta al experto',
    description: 'Una vez cargados tus datos, haz clic en "Consultar al Experto" para enviar tu información al chat y recibir asesoramiento personalizado.',
    icon: <Send className="w-6 h-6" />,
    highlight: 'left',
    position: { bottom: '20%', left: '220px' },
  },
];

interface TutorialOverlayProps {
  onComplete: () => void;
}

export default function TutorialOverlay({ onComplete }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  // No se guarda en localStorage - siempre mostrar términos y condiciones al inicio de cada sesión

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    onComplete();
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleAcceptDisclaimer = () => {
    setShowDisclaimer(false);
    setShowWelcome(true);
  };

  const handleStartTutorial = () => {
    setShowWelcome(false);
  };

  const handleStartGame = () => {
    handleComplete();
  };

  if (!isVisible) return null;

  const step = tutorialSteps[currentStep];
  const canAccept = disclaimerAccepted && privacyAccepted;

  // Disclaimer screen
  if (showDisclaimer) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
        
        {/* Disclaimer Card */}
        <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl p-6 max-w-lg mx-4 shadow-2xl animate-in fade-in zoom-in duration-300">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Shield className="w-7 h-7 text-amber-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Antes de comenzar</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Por favor, lee y acepta las siguientes condiciones para continuar.
            </p>

            {/* Checkboxes */}
            <div className="w-full space-y-3 mt-2 text-left">
              {/* Disclaimer 1 */}
              <button
                onClick={() => setDisclaimerAccepted(!disclaimerAccepted)}
                className="w-full flex items-start gap-3 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700 hover:border-zinc-600 transition-colors text-left"
              >
                <div className="flex-shrink-0 mt-0.5">
                  {disclaimerAccepted ? (
                    <CheckSquare className="w-5 h-5 text-green-400" />
                  ) : (
                    <Square className="w-5 h-5 text-zinc-500" />
                  )}
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Entiendo que este es un <span className="font-semibold text-amber-400">simulador orientativo</span> y que de ninguna forma sustituye el asesoramiento de un <span className="font-semibold text-white">contador matriculado</span>.
                </p>
              </button>

              {/* Disclaimer 2 */}
              <button
                onClick={() => setPrivacyAccepted(!privacyAccepted)}
                className="w-full flex items-start gap-3 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700 hover:border-zinc-600 transition-colors text-left"
              >
                <div className="flex-shrink-0 mt-0.5">
                  {privacyAccepted ? (
                    <CheckSquare className="w-5 h-5 text-green-400" />
                  ) : (
                    <Square className="w-5 h-5 text-zinc-500" />
                  )}
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Entiendo que <span className="font-semibold text-red-400">no debo compartir</span> mis datos personales sensibles como <span className="font-semibold text-white">CUIT, DNI</span> ni ninguna otra información personal identificable.
                </p>
              </button>
            </div>

            {/* Accept Button */}
            <button
              onClick={handleAcceptDisclaimer}
              disabled={!canAccept}
              className="w-full mt-4 bg-salta-bordo hover:bg-salta-bordo/80 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
            >
              {canAccept ? 'Aceptar y Continuar' : 'Acepta las condiciones para continuar'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Welcome screen
  if (showWelcome) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
        
        {/* Welcome Card */}
        <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl p-8 max-w-md mx-4 shadow-2xl animate-in fade-in zoom-in duration-300">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-salta-bordo/20 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-salta-bordo" />
            </div>
            <h2 className="text-2xl font-bold text-white">Bienvenido a Avatar Fiscal</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Un simulador interactivo donde podrás consultar a expertos sobre tus obligaciones tributarias. 
              Te guiaremos paso a paso para que aproveches todas las funcionalidades.
            </p>
            <div className="flex flex-col w-full gap-3 mt-4">
              <p className="text-xs text-zinc-500 text-center">
                Queres ver el tutorial?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleStartTutorial}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-white font-medium py-2.5 px-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] text-sm"
                >
                  Si, ver tutorial
                </button>
                <button
                  onClick={handleSkip}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-zinc-300 font-medium py-2.5 px-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] text-sm"
                >
                  No, omitir
                </button>
              </div>
              <button
                onClick={handleStartGame}
                className="w-full mt-2 bg-salta-bordo hover:bg-salta-bordo/80 text-white font-semibold py-3 px-6 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Iniciar Avatar Fiscal
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Overlay with highlight cutouts */}
      <div className="absolute inset-0 pointer-events-auto">
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70" />
        
        {/* Highlight areas */}
        {step.highlight === 'left' && (
          <div className="absolute left-0 top-0 w-[200px] h-full bg-transparent shadow-[0_0_0_9999px_rgba(0,0,0,0.7)]" style={{ boxShadow: 'none' }}>
            <div className="absolute inset-0 border-2 border-salta-bordo rounded-r-lg animate-pulse" />
          </div>
        )}
        {step.highlight === 'right' && (
          <div className="absolute right-0 top-0 w-[320px] h-full bg-transparent">
            <div className="absolute inset-0 border-2 border-salta-bordo rounded-l-lg animate-pulse" />
          </div>
        )}
        {step.highlight === 'center' && (
          <div className="absolute left-[200px] right-[320px] top-12 bottom-10 bg-transparent">
            <div className="absolute inset-0 border-2 border-salta-bordo rounded-lg animate-pulse" />
          </div>
        )}
      </div>

      {/* Tutorial Popup */}
      <div 
        className="absolute pointer-events-auto"
        style={{
          ...step.position,
          transform: step.position.left === '50%' ? 'translateX(-50%)' : undefined,
        }}
      >
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 max-w-xs shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Close button */}
          <button
            onClick={handleSkip}
            className="absolute top-2 right-2 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Step indicator */}
          <div className="flex items-center gap-1 mb-3">
            {tutorialSteps.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 rounded-full transition-all duration-300 ${
                  idx === currentStep ? 'w-4 bg-salta-bordo' : 'w-1 bg-zinc-700'
                }`}
              />
            ))}
          </div>

          {/* Content */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-salta-bordo/20 flex items-center justify-center flex-shrink-0 text-salta-bordo">
              {step.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white text-sm mb-1">
                Paso {step.id}: {step.title}
              </h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-800">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </button>
            <span className="text-xs text-zinc-600">
              {currentStep + 1} / {tutorialSteps.length}
            </span>
            <button
              onClick={handleNext}
              className="flex items-center gap-1 text-xs bg-salta-bordo hover:bg-salta-bordo/80 text-white px-3 py-1.5 rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {currentStep === tutorialSteps.length - 1 ? 'Finalizar' : 'Siguiente'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
