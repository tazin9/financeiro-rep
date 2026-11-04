import React from 'react';
import { DollarSign, ArrowRightLeft, RotateCcw, Sparkles } from 'lucide-react';

export function RatesBar({
  officialDollar,
  officialBrlRate,
  customDollar,
  customBrlRate,
  onCustomDollarChange,
  onCustomBrlRateChange,
  onResetRates,
  currency,
  onCurrencyChange,
}) {
  const isCustomActive = 
    (customDollar && customDollar !== officialDollar) || 
    (customBrlRate && customBrlRate !== officialBrlRate);

  return (
    <div className="bg-slate-900/90 border-b border-indigo-500/20 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Info */}
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-white">Simulador de Cotação Pessoal</span>
            <p className="text-[11px] text-slate-400">
              Ajuste as cotações que você pagou para converter todas as contas da tela em tempo real.
            </p>
          </div>
        </div>

        {/* Center: Rate Inputs */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Dollar Blue */}
          <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Dólar Blue:
            </span>
            <div className="flex items-center">
              <span className="text-slate-500 mr-1">$</span>
              <input
                type="number"
                value={customDollar || officialDollar || ''}
                onChange={(e) => onCustomDollarChange(parseFloat(e.target.value) || 0)}
                className="w-20 bg-transparent text-white font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded px-1"
                placeholder={officialDollar ? officialDollar.toString() : '1500'}
              />
            </div>
            {officialDollar && (
              <span className="text-[10px] text-slate-500 border-l border-slate-800 pl-2">
                Padrão: ${officialDollar}
              </span>
            )}
          </div>

          {/* BRL / ARS Rate */}
          <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-400" /> Cotação R$:
            </span>
            <div className="flex items-center">
              <span className="text-slate-500 mr-1">R$ 1 = $</span>
              <input
                type="number"
                value={customBrlRate || officialBrlRate || ''}
                onChange={(e) => onCustomBrlRateChange(parseFloat(e.target.value) || 0)}
                className="w-16 bg-transparent text-white font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded px-1"
                placeholder={officialBrlRate ? officialBrlRate.toString() : '300'}
              />
            </div>
            {officialBrlRate && (
              <span className="text-[10px] text-slate-500 border-l border-slate-800 pl-2">
                Padrão: {officialBrlRate}
              </span>
            )}
          </div>

          {/* Reset button if custom */}
          {isCustomActive && (
            <button
              onClick={onResetRates}
              className="flex items-center gap-1 px-2.5 py-1 text-xs text-amber-400 hover:text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/20 rounded-lg transition-all"
              title="Restaurar cotações oficiais da planilha"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Restaurar</span>
            </button>
          )}
        </div>

        {/* Right: Currency View Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-end md:self-auto">
          {['ARS', 'BRL', 'USD'].map((c) => (
            <button
              key={c}
              onClick={() => onCurrencyChange(c)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                currency === c 
                  ? 'bg-indigo-600 text-white shadow' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {c === 'ARS' ? '$ ARS' : (c === 'BRL' ? 'R$ Real' : 'US$ Dólar')}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
