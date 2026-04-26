'use client';

import { 
  CalendarDays, 
  TrendingUp, 
  ShoppingCart, 
  Receipt, 
  FileText,
  DollarSign,
  Package,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

// Datos de ejemplo - en producción vendrían de una API o del CSV
const mockData = {
  mesActual: 'Abril 2026',
  totalFacturadoAcumulado: 15847293.50,
  ventasMes: 2341567.80,
  ventasAcumuladas: 12453892.30,
  comprasMes: 1823456.20,
  comprasAcumuladas: 9234567.40,
  facturasEmitidas: 342,
  facturasRecibidas: 287,
  ivaVentas: 491729.24,
  ivaCompras: 382925.80,
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('es-AR').format(value);
}

interface IndicatorCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | null;
  size?: 'sm' | 'md';
  accent?: boolean;
}

function IndicatorCard({ label, value, icon, trend, size = 'sm', accent = false }: IndicatorCardProps) {
  return (
    <div className={`
      flex items-center gap-2 px-3 py-2 rounded-lg border transition-all
      ${accent 
        ? 'bg-salta-bordo/20 border-salta-bordo/40 hover:bg-salta-bordo/30' 
        : 'bg-zinc-900/60 border-zinc-800 hover:bg-zinc-800/80'
      }
    `}>
      <div className={`
        flex items-center justify-center rounded-md
        ${size === 'md' ? 'w-8 h-8' : 'w-6 h-6'}
        ${accent ? 'bg-salta-bordo/30 text-salta-bordo' : 'bg-zinc-800 text-zinc-400'}
      `}>
        {icon}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider truncate">{label}</span>
        <div className="flex items-center gap-1">
          <span className={`font-mono font-bold truncate ${size === 'md' ? 'text-sm' : 'text-xs'}`}>
            {value}
          </span>
          {trend && (
            trend === 'up' 
              ? <ArrowUpRight className="w-3 h-3 text-green-500 shrink-0" />
              : <ArrowDownRight className="w-3 h-3 text-red-500 shrink-0" />
          )}
        </div>
      </div>
    </div>
  );
}

export function TopIndicators() {
  return (
    <div className="w-full bg-zinc-950/90 backdrop-blur-sm border-b border-zinc-800 px-3 py-2">
      <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-hide">
        {/* Mes Actual - Destacado */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-salta-bordo rounded-lg shrink-0">
          <CalendarDays className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wide">{mockData.mesActual}</span>
        </div>

        <div className="h-6 w-px bg-zinc-700 shrink-0" />

        {/* Indicadores principales */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <IndicatorCard
            label="Facturado Acum."
            value={formatCurrency(mockData.totalFacturadoAcumulado)}
            icon={<DollarSign className="w-3.5 h-3.5" />}
            trend="up"
            accent
          />
          <IndicatorCard
            label="Ventas Mes"
            value={formatCurrency(mockData.ventasMes)}
            icon={<TrendingUp className="w-3.5 h-3.5" />}
            trend="up"
          />
          <IndicatorCard
            label="Compras Mes"
            value={formatCurrency(mockData.comprasMes)}
            icon={<ShoppingCart className="w-3.5 h-3.5" />}
            trend="down"
          />
          <IndicatorCard
            label="Facturas Emitidas"
            value={formatNumber(mockData.facturasEmitidas)}
            icon={<FileText className="w-3.5 h-3.5" />}
          />
        </div>
      </div>
    </div>
  );
}

export function BottomIndicators() {
  return (
    <div className="w-full bg-zinc-950/90 backdrop-blur-sm border-t border-zinc-800 px-3 py-2">
      <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-2">
          <IndicatorCard
            label="Ventas Acum."
            value={formatCurrency(mockData.ventasAcumuladas)}
            icon={<TrendingUp className="w-3.5 h-3.5" />}
          />
          <IndicatorCard
            label="Compras Acum."
            value={formatCurrency(mockData.comprasAcumuladas)}
            icon={<Package className="w-3.5 h-3.5" />}
          />
        </div>

        <div className="h-6 w-px bg-zinc-700 shrink-0" />

        <div className="flex items-center gap-2">
          <IndicatorCard
            label="IVA Ventas"
            value={formatCurrency(mockData.ivaVentas)}
            icon={<Receipt className="w-3.5 h-3.5" />}
          />
          <IndicatorCard
            label="IVA Compras"
            value={formatCurrency(mockData.ivaCompras)}
            icon={<Receipt className="w-3.5 h-3.5" />}
          />
          <IndicatorCard
            label="Fact. Recibidas"
            value={formatNumber(mockData.facturasRecibidas)}
            icon={<FileText className="w-3.5 h-3.5" />}
          />
        </div>

        {/* Saldo IVA */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-900/40 border border-emerald-700/50 rounded-lg shrink-0">
          <span className="text-[10px] text-emerald-400 uppercase tracking-wider">Saldo IVA</span>
          <span className="text-xs font-mono font-bold text-emerald-300">
            {formatCurrency(mockData.ivaVentas - mockData.ivaCompras)}
          </span>
        </div>
      </div>
    </div>
  );
}

export function LeftSideIndicators() {
  return (
    <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
      <div className="bg-zinc-950/80 backdrop-blur-sm border border-zinc-800 rounded-lg p-2 space-y-3">
        <div className="flex flex-col items-center">
          <TrendingUp className="w-4 h-4 text-green-500 mb-1" />
          <span className="text-[9px] text-zinc-500 uppercase">Ventas</span>
          <span className="text-[10px] font-mono font-bold text-green-400">+12%</span>
        </div>
        <div className="w-full h-px bg-zinc-800" />
        <div className="flex flex-col items-center">
          <ShoppingCart className="w-4 h-4 text-amber-500 mb-1" />
          <span className="text-[9px] text-zinc-500 uppercase">Compras</span>
          <span className="text-[10px] font-mono font-bold text-amber-400">+8%</span>
        </div>
      </div>
    </div>
  );
}
