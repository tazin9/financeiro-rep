import React from 'react';
import { Home, CheckCircle2, Clock, AlertCircle, DollarSign } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export function RentCard({ 
  rent, 
  dollarRate, 
  paymentStatus, 
  onToggleStatus 
}) {
  if (!rent) return null;

  const totalUsd = rent.totalUsd || 800;
  const is900 = totalUsd >= 900;
  const rafaelUsd = rent.rafaelUsd || (is900 ? 292 : 259);
  const isabellaUsd = rent.isabellaUsd || (is900 ? 292 : 259);
  const otavioUsd = rent.otavioUsd || (is900 ? 316 : 282);

  const rafaelPaid = paymentStatus?.rentRafael || false;
  const isaPaid = paymentStatus?.rentIsa || false;

  const totalArsAtRate = totalUsd * dollarRate;

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-xl relative overflow-hidden backdrop-blur-sm">
      {/* Background ambient glow */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <Home className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">ALUGUEL DA CASA (USD)</h2>
              <span className="text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                Pago em Dólares
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Cada morador adquire seus próprios dólares e envia ao Otávio, que centraliza o pagamento.
            </p>
          </div>
        </div>

        <div className="text-right sm:border-l sm:border-slate-800 sm:pl-4">
          <div className="text-2xl font-black text-white tracking-tight flex items-center sm:justify-end gap-1">
            <span className="text-emerald-400 text-lg">US$</span>
            <span>{totalUsd.toLocaleString('es-AR')},00</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Equiv. em pesos a ${dollarRate}: <span className="text-slate-300 font-medium">{formatCurrency(totalArsAtRate, 'ARS')}</span>
          </p>
        </div>
      </div>

      {/* 3 People Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        
        {/* Rafael */}
        <div className={`p-4 rounded-xl border transition-all ${
          rafaelPaid 
            ? 'bg-emerald-950/20 border-emerald-500/30' 
            : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">RAFAEL</span>
            <span className="text-[10px] text-slate-500 uppercase">Quarto Standard</span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-bold text-white">US$ {rafaelUsd},00</span>
            <button
              onClick={() => onToggleStatus('rentRafael')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                rafaelPaid 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30' 
                  : 'bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20'
              }`}
            >
              {rafaelPaid ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Pago</span>
                </>
              ) : (
                <>
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pendente</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Entrega US$ {rafaelUsd} em mãos/transferência para Otávio
          </p>
        </div>

        {/* Isabella */}
        <div className={`p-4 rounded-xl border transition-all ${
          isaPaid 
            ? 'bg-emerald-950/20 border-emerald-500/30' 
            : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">ISABELLA</span>
            <span className="text-[10px] text-slate-500 uppercase">Quarto Standard</span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-bold text-white">US$ {isabellaUsd},00</span>
            <button
              onClick={() => onToggleStatus('rentIsa')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                isaPaid 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30' 
                  : 'bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20'
              }`}
            >
              {isaPaid ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Pago</span>
                </>
              ) : (
                <>
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pendente</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Entrega US$ {isabellaUsd} em mãos/transferência para Otávio
          </p>
        </div>

        {/* Otavio */}
        <div className="p-4 rounded-xl border bg-slate-950/60 border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-300">OTÁVIO</span>
            <span className="text-[10px] text-indigo-400/80 uppercase">Quarto Principal</span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-bold text-white">US$ {otavioUsd},00</span>
            <span className="text-[11px] font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
              Pagador Final
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Centraliza os US$ {totalUsd} e paga o proprietário
          </p>
        </div>

      </div>

      {/* Contract note if applicable */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/60">
        <span>Contrato: {is900 ? '900 USD (Renovado)' : '800 USD'}</span>
        <span>Proporção por quarto: 32.4% / 32.4% / 35.2%</span>
      </div>
    </div>
  );
}
