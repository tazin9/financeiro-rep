import React from 'react';
import { 
  Calculator, 
  TrendingUp, 
  Building2, 
  PlusCircle, 
  CreditCard,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export function Navbar({ 
  months, 
  currentMonthId, 
  onSelectMonth, 
  onOpenRates, 
  ratesOpen,
  onOpenDiagnosis, 
  onOpenBank, 
  onOpenUpload,
  currency,
  onCurrencyChange
}) {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Row */}
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-white text-base">FINANCEIRO REP</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                  Buenos Aires
                </span>
              </div>
              <p className="text-xs text-slate-400">Otávio • Isabella • Rafael</p>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            {/* Currency selector toggle */}
            <div className="hidden sm:flex items-center bg-slate-950/70 p-1 rounded-xl border border-slate-800">
              {['ARS', 'BRL', 'USD'].map((c) => (
                <button
                  key={c}
                  onClick={() => onCurrencyChange(c)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                    currency === c 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {c === 'ARS' ? '$ ARS' : (c === 'BRL' ? 'R$ BRL' : 'US$ USD')}
                </button>
              ))}
            </div>

            <button
              onClick={onOpenRates}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border transition-all ${
                ratesOpen 
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' 
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700/60'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Simulador</span> Cotações
            </button>

            <button
              onClick={onOpenDiagnosis}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition-all"
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Diagnóstico</span> Consumo
            </button>

            <button
              onClick={onOpenBank}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition-all"
            >
              <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">Dados</span> CBU / Alias
            </button>

            <button
              onClick={onOpenUpload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Adicionar</span> Mês
            </button>
          </div>
        </div>

        {/* Month Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 no-scrollbar border-t border-slate-800/60">
          {months.map((m) => {
            const isSelected = m.id === currentMonthId;
            return (
              <button
                key={m.id}
                onClick={() => onSelectMonth(m.id)}
                className={`flex-shrink-0 px-3.5 py-1 text-xs font-medium rounded-full transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/40'
                    : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/40 hover:border-slate-600'
                }`}
              >
                <span>{m.name.split(' ')[0]}</span>
                <span className="text-[10px] opacity-70">'{m.year.toString().slice(-2)}</span>
                {m.paymentStatus && Object.values(m.paymentStatus).every(v => v === true) && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
