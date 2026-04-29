'use client';

import { useState } from 'react';
import { Send, DollarSign, ShoppingCart, Briefcase, MapPin, Tag } from 'lucide-react';

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
}

export default function FiscalDataPanel({ onSendToChat }: FiscalDataPanelProps) {
  const [fiscalData, setFiscalData] = useState<FiscalData>({
    ventasNetas: '',
    comprasNetas: '',
    actividad: '',
    categoriaMonotributo: '',
    ubicacion: '',
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
    </div>
  );
}
