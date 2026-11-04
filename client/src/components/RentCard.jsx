import React, { useState } from 'react';
import { Home, CheckCircle2, Clock, Edit3, Check, X } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export function RentCard({ 
  rent, 
  dollarRate, 
  paymentStatus, 
  onToggleStatus,
  onSaveRent 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [totalUsd, setTotalUsd] = useState(rent?.totalUsd || 800);
  const [rafaelUsd, setRafaelUsd] = useState(rent?.rafaelUsd || 259);
  const [isabellaUsd, setIsabellaUsd] = useState(rent?.isabellaUsd || 259);
  const [otavioUsd, setOtavioUsd] = useState(rent?.otavioUsd || 282);

  React.useEffect(() => {
    if (rent) {
      setTotalUsd(rent.totalUsd || 800);
      setRafaelUsd(rent.rafaelUsd || (rent.totalUsd >= 900 ? 292 : 259));
      setIsabellaUsd(rent.isabellaUsd || (rent.totalUsd >= 900 ? 292 : 259));
      setOtavioUsd(rent.otavioUsd || (rent.totalUsd >= 900 ? 316 : 282));
    }
  }, [rent]);

  if (!rent) return null;

  const currentTotalUsd = rent.totalUsd || 800;
  const is900 = currentTotalUsd >= 900;
  const currentRafaelUsd = rent.rafaelUsd || (is900 ? 292 : 259);
  const currentIsabellaUsd = rent.isabellaUsd || (is900 ? 292 : 259);
  const currentOtavioUsd = rent.otavioUsd || (is900 ? 316 : 282);

  const rafaelPaid = paymentStatus?.rentRafael || false;
  const isaPaid = paymentStatus?.rentIsa || false;

  const totalArsAtRate = currentTotalUsd * dollarRate;

  const handleSave = () => {
    onSaveRent({
      ...rent,
      totalUsd: parseFloat(totalUsd) || 800,
      rafaelUsd: parseFloat(rafaelUsd) || 259,
      isabellaUsd: parseFloat(isabellaUsd) || 259,
      otavioUsd: parseFloat(otavioUsd) || 282,
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-xl relative overflow-hidden backdrop-blur-sm">
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

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="text-right sm:border-l sm:border-slate-800 sm:pl-4">
            {isEditing ? (
              <div className="flex items-center gap-1 justify-end">
                <span className="text-emerald-400 text-sm font-bold">US$</span>
                <input
                  type="number"
                  value={totalUsd}
                  onChange={(e) => setTotalUsd(e.target.value)}
                  className="w-24 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-sm font-bold text-white text-right focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            ) : (
              <div className="text-2xl font-black text-white tracking-tight flex items-center sm:justify-end gap-1">
                <span className="text-emerald-400 text-lg">US$</span>
                <span>{currentTotalUsd.toLocaleString('es-AR')},00</span>
              </div>
            )}
            <p className="text-[11px] text-slate-400">
              Equiv. em pesos a ${dollarRate}: <span className="text-slate-300 font-medium">{formatCurrency(totalArsAtRate, 'ARS')}</span>
            </p>
          </div>

          {/* Edit toggle */}
          {isEditing ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                onClick={handleSave}
                className="p-1.5 rounded-lg text-white bg-emerald-600 hover:bg-emerald-500 shadow"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800"
              title="Editar valores do aluguel"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}
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
            {isEditing ? (
              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-400">US$</span>
                <input
                  type="number"
                  value={rafaelUsd}
                  onChange={(e) => setRafaelUsd(e.target.value)}
                  className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-base font-bold text-white focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            ) : (
              <span className="text-xl font-bold text-white">US$ {currentRafaelUsd},00</span>
            )}
            <button
              onClick={() => onToggleStatus('rentRafael')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                rafaelPaid 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30' 
                  : 'bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20'
              }`}
            >
              {rafaelPaid ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Clock className="w-3.5 h-3.5 text-amber-400" />}
              <span>{rafaelPaid ? 'Pago' : 'Pendente'}</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Entrega US$ {currentRafaelUsd} em mãos/transferência para Otávio
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
            {isEditing ? (
              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-400">US$</span>
                <input
                  type="number"
                  value={isabellaUsd}
                  onChange={(e) => setIsabellaUsd(e.target.value)}
                  className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-base font-bold text-white focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            ) : (
              <span className="text-xl font-bold text-white">US$ {currentIsabellaUsd},00</span>
            )}
            <button
              onClick={() => onToggleStatus('rentIsa')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                isaPaid 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30' 
                  : 'bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20'
              }`}
            >
              {isaPaid ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Clock className="w-3.5 h-3.5 text-amber-400" />}
              <span>{isaPaid ? 'Pago' : 'Pendente'}</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Entrega US$ {currentIsabellaUsd} em mãos/transferência para Otávio
          </p>
        </div>

        {/* Otavio */}
        <div className="p-4 rounded-xl border bg-slate-950/60 border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-300">OTÁVIO</span>
            <span className="text-[10px] text-indigo-400/80 uppercase">Quarto Principal</span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            {isEditing ? (
              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-400">US$</span>
                <input
                  type="number"
                  value={otavioUsd}
                  onChange={(e) => setOtavioUsd(e.target.value)}
                  className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-base font-bold text-white focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            ) : (
              <span className="text-xl font-bold text-white">US$ {currentOtavioUsd},00</span>
            )}
            <span className="text-[11px] font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
              Pagador Final
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Centraliza os US$ {currentTotalUsd} e paga o proprietário
          </p>
        </div>

      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/60">
        <span>Contrato: {is900 ? '900 USD (Renovado)' : '800 USD'}</span>
        <span>Proporção calculada: {((currentRafaelUsd/currentTotalUsd)*100).toFixed(1)}% / {((currentIsabellaUsd/currentTotalUsd)*100).toFixed(1)}% / {((currentOtavioUsd/currentTotalUsd)*100).toFixed(1)}%</span>
      </div>
    </div>
  );
}
