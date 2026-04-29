'use client';

import { useState } from 'react';
import { Send, DollarSign, ShoppingCart, Briefcase, MapPin, Tag, HelpCircle, X, ShieldCheck, Landmark, Building2 } from 'lucide-react';

interface FiscalData {
  ventasNetas: string;
  comprasNetas: string;
  actividad: string;
  condicionIVA: string;
  ubicacion: string;
  medioCobro: string;
}

const condicionesIVA = [
  { value: '', label: 'Seleccionar condición...' },
  { value: 'responsable_inscripto', label: 'Responsable Inscripto' },
  { value: 'exento', label: 'Exento' },
  { value: 'no_se', label: 'No lo sé' },
  { value: 'monotributo_A', label: 'Monotributo A - Hasta $2.108.288' },
  { value: 'monotributo_B', label: 'Monotributo B - Hasta $3.133.941' },
  { value: 'monotributo_C', label: 'Monotributo C - Hasta $4.387.518' },
  { value: 'monotributo_D', label: 'Monotributo D - Hasta $5.449.094' },
  { value: 'monotributo_E', label: 'Monotributo E - Hasta $6.416.528' },
  { value: 'monotributo_F', label: 'Monotributo F - Hasta $8.020.660' },
  { value: 'monotributo_G', label: 'Monotributo G - Hasta $9.624.792' },
  { value: 'monotributo_H', label: 'Monotributo H - Hasta $11.916.410' },
  { value: 'monotributo_I', label: 'Monotributo I - Hasta $13.337.213' },
  { value: 'monotributo_J', label: 'Monotributo J - Hasta $15.285.088' },
  { value: 'monotributo_K', label: 'Monotributo K - Hasta $16.957.968' },
];

const mediosDeCobro = [
  { value: '', label: 'Seleccionar medio...' },
  { value: 'transferencia', label: 'Transferencia bancaria' },
  { value: 'mercadopago', label: 'Mercado Pago' },
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'tarjeta', label: 'Tarjeta de crédito/débito' },
  { value: 'crypto', label: 'Criptomonedas / Bitcoin' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'mixto', label: 'Varios medios combinados' },
];

const provincias = [
  { value: '', label: 'Seleccionar ubicación...' },
  { value: 'salta_capital', label: 'Salta Capital' },
  { value: 'salta_interior', label: 'Salta Interior' },
  { value: 'buenos_aires', label: 'Buenos Aires' },
  { value: 'caba', label: 'CABA' },
  { value: 'cordoba', label: 'Córdoba' },
  { value: 'mendoza', label: 'Mendoza' },
  { value: 'santa_fe', label: 'Santa Fe' },
  { value: 'tucuman', label: 'Tucumán' },
  { value: 'jujuy', label: 'Jujuy' },
  { value: 'otra', label: 'Otra provincia' },
];

const tiposNegocio = [
  { value: '', label: 'Seleccionar tipo de negocio...' },
  { value: 'comercio', label: 'Comercio minorista' },
  { value: 'servicios', label: 'Prestación de servicios' },
  { value: 'profesional', label: 'Profesional independiente' },
  { value: 'gastronomia', label: 'Gastronomía / Alimentos' },
  { value: 'tecnologia', label: 'Tecnología / Software' },
  { value: 'construccion', label: 'Construcción' },
  { value: 'transporte', label: 'Transporte / Logística' },
  { value: 'salud', label: 'Salud / Bienestar' },
  { value: 'educacion', label: 'Educación / Capacitación' },
  { value: 'otro', label: 'Otro' },
];

const npcButtons = [
  { key: 'arca' as const, name: 'ARCA', color: 'bg-[#722F37]', hoverColor: 'hover:bg-[#8a3a44]', icon: ShieldCheck, description: 'Impuestos Nacionales' },
  { key: 'dgr' as const, name: 'Rentas Salta', color: 'bg-blue-700', hoverColor: 'hover:bg-blue-600', icon: Landmark, description: 'Impuestos Provinciales' },
  { key: 'muni' as const, name: 'Muni Salta', color: 'bg-emerald-700', hoverColor: 'hover:bg-emerald-600', icon: Building2, description: 'Tasas Municipales' },
];

interface FiscalDataPanelProps {
  onSendToChat: (message: string) => void;
  onChangeNpc?: (npc: 'arca' | 'dgr' | 'muni') => void;
}

const formatCurrency = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export default function FiscalDataPanel({ onSendToChat, onChangeNpc }: FiscalDataPanelProps) {
  const [fiscalData, setFiscalData] = useState<FiscalData>({
    ventasNetas: '',
    comprasNetas: '',
    actividad: '',
    condicionIVA: '',
    ubicacion: '',
    medioCobro: '',
  });

  const [showNoInscriptoModal, setShowNoInscriptoModal] = useState(false);
  const [noInscriptoData, setNoInscriptoData] = useState({
    descripcion: '',
    tipoNegocio: '',
    ingresoEstimado: '',
    empleados: '',
    localFisico: '',
  });

  const handleChange = (field: keyof FiscalData, value: string) => {
    setFiscalData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const condicionLabel = condicionesIVA.find(c => c.value === fiscalData.condicionIVA)?.label || fiscalData.condicionIVA;
    const ubicacionLabel = provincias.find(p => p.value === fiscalData.ubicacion)?.label || fiscalData.ubicacion;
    const medioCobroLabel = mediosDeCobro.find(m => m.value === fiscalData.medioCobro)?.label || fiscalData.medioCobro;
    
    const avisoFacturacion = fiscalData.medioCobro ? `\n\n**IMPORTANTE:** El contribuyente cobra mediante ${medioCobroLabel}. Recordale que debe facturar TODAS sus operaciones sin excepción, incluyendo las que cobra por este medio.` : '';
    
    const message = `Hola, me gustaría una orientación fiscal. Esta es mi situación:

**Ventas Netas Mensuales:** ${fiscalData.ventasNetas ? `$${fiscalData.ventasNetas}` : 'No especificado'}
**Compras Netas Mensuales:** ${fiscalData.comprasNetas ? `$${fiscalData.comprasNetas}` : 'No especificado'}
**Actividad:** ${fiscalData.actividad || 'No especificado'}
**Condición frente al IVA:** ${condicionLabel || 'No especificado'}
**Ubicación:** ${ubicacionLabel || 'No especificado'}
**Medio de cobro:** ${medioCobroLabel || 'No especificado'}${avisoFacturacion}

¿Qué me podés aconsejar sobre mis obligaciones tributarias?`;
    
    onSendToChat(message);
  };

  const hasAnyData = Object.values(fiscalData).some(v => v.trim() !== '');

  const handleNoInscriptoChange = (field: keyof typeof noInscriptoData, value: string) => {
    setNoInscriptoData(prev => ({ ...prev, [field]: value }));
  };

  const buildNoInscriptoMessage = () => {
    const tipoLabel = tiposNegocio.find(t => t.value === noInscriptoData.tipoNegocio)?.label || noInscriptoData.tipoNegocio;
    
    return `Hola, no estoy inscripto actualmente y necesito orientación fiscal. Esta es mi situación:

**Descripción del negocio:** ${noInscriptoData.descripcion || 'No especificado'}
**Tipo de negocio:** ${tipoLabel || 'No especificado'}
**Ingreso mensual estimado:** ${noInscriptoData.ingresoEstimado ? `$${noInscriptoData.ingresoEstimado}` : 'No especificado'}
**Cantidad de empleados:** ${noInscriptoData.empleados || 'No especificado'}
**Local físico:** ${noInscriptoData.localFisico || 'No especificado'}

¿Qué opciones tengo para inscribirme y qué me recomendás hacer?`;
  };

  const handleSendToNpc = (npc: 'arca' | 'dgr' | 'muni') => {
    const message = buildNoInscriptoMessage();
    if (onChangeNpc) {
      onChangeNpc(npc);
    }
    setTimeout(() => {
      onSendToChat(message);
      setShowNoInscriptoModal(false);
      setNoInscriptoData({
        descripcion: '',
        tipoNegocio: '',
        ingresoEstimado: '',
        empleados: '',
        localFisico: '',
      });
    }, 100);
  };

  const hasNoInscriptoData = noInscriptoData.descripcion.trim() !== '' || noInscriptoData.tipoNegocio !== '';

  return (
    <div className="h-full flex flex-col p-4 bg-gradient-to-b from-zinc-900 to-zinc-950">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-sm font-bold text-zinc-200 mb-1">Datos Fiscales</h2>
        <p className="text-[10px] text-zinc-500 leading-relaxed">
          Completá tus datos para recibir asesoramiento personalizado
        </p>
      </div>

      {/* Formulario */}
      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {/* Ventas Netas */}
        <div className="space-y-1">
          <label className="flex items-center gap-1.5 text-[10px] text-zinc-400 uppercase tracking-wider">
            <DollarSign className="w-3 h-3" />
            Ventas Netas Mensuales
          </label>
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">$</span>
            <input
              type="text"
              value={fiscalData.ventasNetas}
              onChange={(e) => handleChange('ventasNetas', formatCurrency(e.target.value))}
              placeholder="0"
              className="w-full bg-zinc-800/60 border border-zinc-700/50 rounded-lg pl-6 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-salta-bordo/50 focus:border-salta-bordo/50 placeholder:text-zinc-600 transition-all"
            />
          </div>
        </div>

        {/* Compras Netas */}
        <div className="space-y-1">
          <label className="flex items-center gap-1.5 text-[10px] text-zinc-400 uppercase tracking-wider">
            <ShoppingCart className="w-3 h-3" />
            Compras Netas Mensuales
          </label>
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">$</span>
            <input
              type="text"
              value={fiscalData.comprasNetas}
              onChange={(e) => handleChange('comprasNetas', formatCurrency(e.target.value))}
              placeholder="0"
              className="w-full bg-zinc-800/60 border border-zinc-700/50 rounded-lg pl-6 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-salta-bordo/50 focus:border-salta-bordo/50 placeholder:text-zinc-600 transition-all"
            />
          </div>
        </div>

        {/* Actividad */}
        <div className="space-y-1">
          <label className="flex items-center gap-1.5 text-[10px] text-zinc-400 uppercase tracking-wider">
            <Briefcase className="w-3 h-3" />
            Actividad
          </label>
          <input
            type="text"
            value={fiscalData.actividad}
            onChange={(e) => handleChange('actividad', e.target.value)}
            placeholder="Ej: Venta de ropa"
            className="w-full bg-zinc-800/60 border border-zinc-700/50 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-salta-bordo/50 focus:border-salta-bordo/50 placeholder:text-zinc-600 transition-all"
          />
        </div>

        {/* Condición IVA / Monotributo */}
        <div className="space-y-1">
          <label className="flex items-center gap-1.5 text-[10px] text-zinc-400 uppercase tracking-wider">
            <Tag className="w-3 h-3" />
            Condición IVA / Monotributo
          </label>
          <select
            value={fiscalData.condicionIVA}
            onChange={(e) => handleChange('condicionIVA', e.target.value)}
            className="w-full bg-zinc-800/60 border border-zinc-700/50 rounded-lg px-2 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-salta-bordo/50 focus:border-salta-bordo/50 text-zinc-300 appearance-none cursor-pointer transition-all"
          >
            {condicionesIVA.map((cond) => (
              <option key={cond.value} value={cond.value} className="bg-zinc-800">
                {cond.label}
              </option>
            ))}
          </select>
        </div>

        {/* Ubicación */}
        <div className="space-y-1">
          <label className="flex items-center gap-1.5 text-[10px] text-zinc-400 uppercase tracking-wider">
            <MapPin className="w-3 h-3" />
            Ubicación
          </label>
          <select
            value={fiscalData.ubicacion}
            onChange={(e) => handleChange('ubicacion', e.target.value)}
            className="w-full bg-zinc-800/60 border border-zinc-700/50 rounded-lg px-2 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-salta-bordo/50 focus:border-salta-bordo/50 text-zinc-300 appearance-none cursor-pointer transition-all"
          >
            {provincias.map((prov) => (
              <option key={prov.value} value={prov.value} className="bg-zinc-800">
                {prov.label}
              </option>
            ))}
          </select>
        </div>

        {/* Medio de Cobro */}
        <div className="space-y-1">
          <label className="flex items-center gap-1.5 text-[10px] text-zinc-400 uppercase tracking-wider">
            <DollarSign className="w-3 h-3" />
            ¿Cómo cobrás?
          </label>
          <select
            value={fiscalData.medioCobro}
            onChange={(e) => handleChange('medioCobro', e.target.value)}
            className="w-full bg-zinc-800/60 border border-zinc-700/50 rounded-lg px-2 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-salta-bordo/50 focus:border-salta-bordo/50 text-zinc-300 appearance-none cursor-pointer transition-all"
          >
            {mediosDeCobro.map((medio) => (
              <option key={medio.value} value={medio.value} className="bg-zinc-800">
                {medio.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Botón Enviar */}
      <button
        onClick={handleSubmit}
        disabled={!hasAnyData}
        className="mt-4 flex items-center justify-center gap-2 bg-salta-bordo hover:bg-salta-bordo/80 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-medium py-2.5 px-3 rounded-lg text-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        <Send className="w-3.5 h-3.5" />
        Consultar al Experto
      </button>

      {/* Separador */}
      <div className="flex items-center gap-2 my-3">
        <div className="flex-1 h-px bg-zinc-700" />
        <span className="text-[9px] text-zinc-500 uppercase">o</span>
        <div className="flex-1 h-px bg-zinc-700" />
      </div>

      {/* Botón No Inscripto */}
      <button
        onClick={() => setShowNoInscriptoModal(true)}
        className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-zinc-300 hover:text-white font-medium py-2.5 px-3 rounded-lg text-xs transition-all"
      >
        <HelpCircle className="w-3.5 h-3.5" />
        ¿No estás inscripto?
      </button>

      {/* Modal No Inscripto */}
      {showNoInscriptoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl w-[90%] max-w-md max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-700">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">¿No estás inscripto?</h3>
              </div>
              <button
                onClick={() => setShowNoInscriptoModal(false)}
                className="p-1 hover:bg-zinc-700 rounded-md transition-colors"
              >
                <X className="w-4 h-4 text-zinc-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              <p className="text-xs text-zinc-400 leading-relaxed">
                Contanos sobre tu situación y te orientaremos sobre qué opciones tenés para inscribirte correctamente.
              </p>

              {/* Descripción */}
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">
                  Describí tu negocio o actividad
                </label>
                <textarea
                  value={noInscriptoData.descripcion}
                  onChange={(e) => handleNoInscriptoChange('descripcion', e.target.value)}
                  placeholder="Ej: Tengo un emprendimiento de venta de ropa por Instagram, trabajo desde mi casa..."
                  rows={3}
                  className="w-full bg-zinc-800/60 border border-zinc-700/50 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500/50 placeholder:text-zinc-600 resize-none"
                />
              </div>

              {/* Tipo de Negocio */}
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">
                  Tipo de negocio
                </label>
                <select
                  value={noInscriptoData.tipoNegocio}
                  onChange={(e) => handleNoInscriptoChange('tipoNegocio', e.target.value)}
                  className="w-full bg-zinc-800/60 border border-zinc-700/50 rounded-lg px-2 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500/50 text-zinc-300 appearance-none cursor-pointer"
                >
                  {tiposNegocio.map((tipo) => (
                    <option key={tipo.value} value={tipo.value} className="bg-zinc-800">
                      {tipo.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Ingreso Estimado */}
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 uppercase tracking-wider">
                    Ingreso mensual
                  </label>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">$</span>
                    <input
                      type="text"
                      value={noInscriptoData.ingresoEstimado}
                      onChange={(e) => handleNoInscriptoChange('ingresoEstimado', formatCurrency(e.target.value))}
                      placeholder="0"
                      className="w-full bg-zinc-800/60 border border-zinc-700/50 rounded-lg pl-5 pr-2 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500/50 placeholder:text-zinc-600"
                    />
                  </div>
                </div>

                {/* Empleados */}
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 uppercase tracking-wider">
                    Empleados
                  </label>
                  <select
                    value={noInscriptoData.empleados}
                    onChange={(e) => handleNoInscriptoChange('empleados', e.target.value)}
                    className="w-full bg-zinc-800/60 border border-zinc-700/50 rounded-lg px-2 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500/50 text-zinc-300 appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-zinc-800">Seleccionar...</option>
                    <option value="0" className="bg-zinc-800">Solo yo</option>
                    <option value="1-3" className="bg-zinc-800">1 a 3</option>
                    <option value="4-10" className="bg-zinc-800">4 a 10</option>
                    <option value="10+" className="bg-zinc-800">Más de 10</option>
                  </select>
                </div>
              </div>

              {/* Local Físico */}
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider">
                  ¿Tenés local físico?
                </label>
                <select
                  value={noInscriptoData.localFisico}
                  onChange={(e) => handleNoInscriptoChange('localFisico', e.target.value)}
                  className="w-full bg-zinc-800/60 border border-zinc-700/50 rounded-lg px-2 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500/50 text-zinc-300 appearance-none cursor-pointer"
                >
                  <option value="" className="bg-zinc-800">Seleccionar...</option>
                  <option value="no" className="bg-zinc-800">No, trabajo desde casa / virtual</option>
                  <option value="alquilado" className="bg-zinc-800">Sí, alquilado</option>
                  <option value="propio" className="bg-zinc-800">Sí, propio</option>
                </select>
              </div>

              {/* Separador */}
              <div className="pt-3 border-t border-zinc-700">
                <p className="text-[10px] text-zinc-500 text-center mb-3">
                  Elegí a quién querés consultar:
                </p>

                {/* Botones de NPCs */}
                <div className="grid grid-cols-3 gap-2">
                  {npcButtons.map((npc) => {
                    const Icon = npc.icon;
                    return (
                      <button
                        key={npc.key}
                        onClick={() => handleSendToNpc(npc.key)}
                        disabled={!hasNoInscriptoData}
                        className={`${npc.color} ${npc.hoverColor} disabled:bg-zinc-700 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98] flex flex-col items-center gap-1.5`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-[10px] font-medium">{npc.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
