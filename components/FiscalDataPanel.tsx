'use client';

import { useState } from 'react';
import { Send, DollarSign, ShoppingCart, Briefcase, MapPin, Tag, HelpCircle, X, ShieldCheck, Landmark, Building2 } from 'lucide-react';

interface FiscalData {
  ventasNetas: string;
  comprasNetas: string;
  actividad: string;
  categoriaMonotributo: string;
  ubicacion: string;
}

const categoriasMonotributo = [
  { value: '', label: 'Seleccionar categoría...' },
  { value: 'A', label: 'Categoría A - Hasta $2.108.288,01' },
  { value: 'B', label: 'Categoría B - Hasta $3.133.941,63' },
  { value: 'C', label: 'Categoría C - Hasta $4.387.518,23' },
  { value: 'D', label: 'Categoría D - Hasta $5.449.094,55' },
  { value: 'E', label: 'Categoría E - Hasta $6.416.528,72' },
  { value: 'F', label: 'Categoría F - Hasta $8.020.660,90' },
  { value: 'G', label: 'Categoría G - Hasta $9.624.793,05' },
  { value: 'H', label: 'Categoría H - Hasta $11.916.410,45' },
  { value: 'I', label: 'Categoría I - Hasta $13.337.213,22' },
  { value: 'J', label: 'Categoría J - Hasta $15.285.088,04' },
  { value: 'K', label: 'Categoría K - Hasta $16.957.968,71' },
];

const provinciasArgentina = [
  { value: '', label: 'Seleccionar ubicación...' },
  { value: 'buenos_aires', label: 'Buenos Aires' },
  { value: 'catamarca', label: 'Catamarca' },
  { value: 'chaco', label: 'Chaco' },
  { value: 'chubut', label: 'Chubut' },
  { value: 'cordoba', label: 'Córdoba' },
  { value: 'corrientes', label: 'Corrientes' },
  { value: 'entre_rios', label: 'Entre Ríos' },
  { value: 'formosa', label: 'Formosa' },
  { value: 'jujuy', label: 'Jujuy' },
  { value: 'la_pampa', label: 'La Pampa' },
  { value: 'la_rioja', label: 'La Rioja' },
  { value: 'mendoza', label: 'Mendoza' },
  { value: 'misiones', label: 'Misiones' },
  { value: 'neuquen', label: 'Neuquén' },
  { value: 'rio_negro', label: 'Río Negro' },
  { value: 'salta', label: 'Salta' },
  { value: 'san_juan', label: 'San Juan' },
  { value: 'san_luis', label: 'San Luis' },
  { value: 'santa_cruz', label: 'Santa Cruz' },
  { value: 'santa_fe', label: 'Santa Fe' },
  { value: 'santiago_del_estero', label: 'Santiago del Estero' },
  { value: 'tierra_del_fuego', label: 'Tierra del Fuego' },
  { value: 'tucuman', label: 'Tucumán' },
  { value: 'caba', label: 'CABA' },
];

interface FiscalDataPanelProps {
  onSendToChat: (message: string) => void;
  onChangeNpc?: (npc: 'arca' | 'dgr' | 'muni') => void;
}

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

export default function FiscalDataPanel({ onSendToChat, onChangeNpc }: FiscalDataPanelProps) {
  const [fiscalData, setFiscalData] = useState<FiscalData>({
    ventasNetas: '',
    comprasNetas: '',
    actividad: '',
    categoriaMonotributo: '',
    ubicacion: '',
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

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (!numbers) return '';
    return new Intl.NumberFormat('es-AR').format(parseInt(numbers));
  };

  const handleCurrencyChange = (field: 'ventasNetas' | 'comprasNetas', value: string) => {
    const formatted = formatCurrency(value);
    setFiscalData(prev => ({ ...prev, [field]: formatted }));
  };

  const handleSubmit = () => {
    const categoriaLabel = categoriasMonotributo.find(c => c.value === fiscalData.categoriaMonotributo)?.label || fiscalData.categoriaMonotributo;
    const ubicacionLabel = provinciasArgentina.find(p => p.value === fiscalData.ubicacion)?.label || fiscalData.ubicacion;

    const message = `Hola, me gustaría que me aconsejes sobre mi situación fiscal. Esta es mi información:
- Ventas Netas: $${fiscalData.ventasNetas || 'No especificado'}
- Compras Netas: $${fiscalData.comprasNetas || 'No especificado'}
- Actividad: ${fiscalData.actividad || 'No especificada'}
- Categoría Monotributo: ${categoriaLabel || 'No especificada'}
- Ubicación: ${ubicacionLabel || 'No especificada'}

¿Qué me puedes aconsejar?`;

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
    // Pequeño delay para que el NPC cambie antes de enviar el mensaje
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
    <div className="flex flex-col gap-3 p-3 bg-zinc-900/80 backdrop-blur-sm text-zinc-100 h-full">
      <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
        <Briefcase className="w-3.5 h-3.5" />
        Datos Fiscales
      </h3>

      <div className="grid grid-cols-2 gap-2">
        {/* Ventas Netas */}
        <div className="space-y-1">
          <label className="text-[10px] text-zinc-500 uppercase tracking-wider flex items-center gap-1">
            <DollarSign className="w-3 h-3" />
            Ventas Netas
          </label>
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">$</span>
            <input
              type="text"
              value={fiscalData.ventasNetas}
              onChange={(e) => handleCurrencyChange('ventasNetas', e.target.value)}
              placeholder="0"
              className="w-full bg-zinc-800/60 border border-zinc-700/50 rounded-lg pl-5 pr-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-salta-bordo/50 placeholder:text-zinc-600"
            />
          </div>
        </div>

        {/* Compras Netas */}
        <div className="space-y-1">
          <label className="text-[10px] text-zinc-500 uppercase tracking-wider flex items-center gap-1">
            <ShoppingCart className="w-3 h-3" />
            Compras Netas
          </label>
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">$</span>
            <input
              type="text"
              value={fiscalData.comprasNetas}
              onChange={(e) => handleCurrencyChange('comprasNetas', e.target.value)}
              placeholder="0"
              className="w-full bg-zinc-800/60 border border-zinc-700/50 rounded-lg pl-5 pr-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-salta-bordo/50 placeholder:text-zinc-600"
            />
          </div>
        </div>
      </div>

      {/* Actividad */}
      <div className="space-y-1">
        <label className="text-[10px] text-zinc-500 uppercase tracking-wider flex items-center gap-1">
          <Briefcase className="w-3 h-3" />
          Actividad
        </label>
        <input
          type="text"
          value={fiscalData.actividad}
          onChange={(e) => handleChange('actividad', e.target.value)}
          placeholder="Ej: Desarrollador de software, Comercio minorista..."
          className="w-full bg-zinc-800/60 border border-zinc-700/50 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-salta-bordo/50 placeholder:text-zinc-600"
        />
      </div>

      {/* Categoría Monotributo */}
      <div className="space-y-1">
        <label className="text-[10px] text-zinc-500 uppercase tracking-wider flex items-center gap-1">
          <Tag className="w-3 h-3" />
          Categoría Monotributo
        </label>
        <select
          value={fiscalData.categoriaMonotributo}
          onChange={(e) => handleChange('categoriaMonotributo', e.target.value)}
          className="w-full bg-zinc-800/60 border border-zinc-700/50 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-salta-bordo/50 text-zinc-300 appearance-none cursor-pointer"
        >
          {categoriasMonotributo.map((cat) => (
            <option key={cat.value} value={cat.value} className="bg-zinc-800">
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Ubicación */}
      <div className="space-y-1">
        <label className="text-[10px] text-zinc-500 uppercase tracking-wider flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          Ubicación
        </label>
        <select
          value={fiscalData.ubicacion}
          onChange={(e) => handleChange('ubicacion', e.target.value)}
          className="w-full bg-zinc-800/60 border border-zinc-700/50 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-salta-bordo/50 text-zinc-300 appearance-none cursor-pointer"
        >
          {provinciasArgentina.map((prov) => (
            <option key={prov.value} value={prov.value} className="bg-zinc-800">
              {prov.label}
            </option>
          ))}
        </select>
      </div>

      {/* Botón Enviar */}
      <button
        onClick={handleSubmit}
        disabled={!hasAnyData}
        className="mt-auto flex items-center justify-center gap-2 bg-salta-bordo hover:bg-salta-bordo/80 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-medium py-2 px-3 rounded-lg text-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        <Send className="w-3.5 h-3.5" />
        Consultar al Experto
      </button>

      {/* Separador */}
      <div className="flex items-center gap-2 my-2">
        <div className="flex-1 h-px bg-zinc-700" />
        <span className="text-[9px] text-zinc-500 uppercase">o</span>
        <div className="flex-1 h-px bg-zinc-700" />
      </div>

      {/* Botón No Inscripto */}
      <button
        onClick={() => setShowNoInscriptoModal(true)}
        className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-zinc-300 hover:text-white font-medium py-2 px-3 rounded-lg text-xs transition-all"
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
                  className="w-full bg-zinc-800/60 border border-zinc-700/50 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500/50 text-zinc-300 appearance-none cursor-pointer"
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
                    Ingreso mensual estimado
                  </label>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">$</span>
                    <input
                      type="text"
                      value={noInscriptoData.ingresoEstimado}
                      onChange={(e) => handleNoInscriptoChange('ingresoEstimado', formatCurrency(e.target.value))}
                      placeholder="0"
                      className="w-full bg-zinc-800/60 border border-zinc-700/50 rounded-lg pl-5 pr-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500/50 placeholder:text-zinc-600"
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
                    className="w-full bg-zinc-800/60 border border-zinc-700/50 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500/50 text-zinc-300 appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-zinc-800">Seleccionar...</option>
                    <option value="0" className="bg-zinc-800">Ninguno (solo yo)</option>
                    <option value="1-3" className="bg-zinc-800">1 a 3 empleados</option>
                    <option value="4-10" className="bg-zinc-800">4 a 10 empleados</option>
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
                  className="w-full bg-zinc-800/60 border border-zinc-700/50 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500/50 text-zinc-300 appearance-none cursor-pointer"
                >
                  <option value="" className="bg-zinc-800">Seleccionar...</option>
                  <option value="no" className="bg-zinc-800">No, trabajo desde casa / virtual</option>
                  <option value="alquilado" className="bg-zinc-800">Sí, alquilado</option>
                  <option value="propio" className="bg-zinc-800">Sí, propio</option>
                </select>
              </div>

              {/* Separador */}
              <div className="pt-2 border-t border-zinc-700">
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
                        className={`${npc.color} ${npc.hoverColor} disabled:bg-zinc-700 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98] flex flex-col items-center gap-1`}
                      >
                        <Icon className="w-4 h-4" />
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
