import React, { useState, useEffect } from 'react';
import { X, Home, Save, Check } from 'lucide-react';

export function RentEditModal({ 
  isOpen, 
  onClose, 
  rent, 
  onSaveRent 
}) {
  if (!isOpen) return null;

  const [totalUsd, setTotalUsd] = useState(rent?.totalUsd || 800);
  const [rafaelUsd, setRafaelUsd] = useState(rent?.rafaelUsd || 259);
  const [isabellaUsd, setIsabellaUsd] = useState(rent?.isabellaUsd || 259);
  const [otavioUsd, setOtavioUsd] = useState(rent?.otavioUsd || 282);

  useEffect(() => {
    if (rent) {
      setTotalUsd(rent.totalUsd || 800);
      setRafaelUsd(rent.rafaelUsd || (rent.totalUsd >= 900 ? 292 : 259));
      setIsabellaUsd(rent.isabellaUsd || (rent.totalUsd >= 900 ? 292 : 259));
      setOtavioUsd(rent.otavioUsd || (rent.totalUsd >= 900 ? 316 : 282));
    }
  }, [rent]);

  const handleSave = (e) => {
    e.preventDefault();
    onSaveRent({
      ...rent,
      totalUsd: parseFloat(totalUsd) || 800,
      rafaelUsd: parseFloat(rafaelUsd) || 259,
      isabellaUsd: parseFloat(isabellaUsd) || 259,
      otavioUsd: parseFloat(otavioUsd) || 282,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full shadow-2xl p-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Home className="w-4 h-4 text-emerald-400" />
            <span>EDITAR ALUGUEL & QUARTOS (USD)</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-4 space-y-4">
          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1">
              Valor Total do Contrato de Aluguel (USD):
            </label>
            <div className="flex items-center bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white">
              <span className="text-emerald-400 font-bold mr-1">US$</span>
              <input
                type="number"
                value={totalUsd}
                onChange={(e) => setTotalUsd(e.target.value)}
                className="w-full bg-transparent font-bold text-base focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Ex: 800 no início do ano, 900 após renovação.</p>
          </div>

          <div className="pt-2 border-t border-slate-800/80 space-y-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Divisão por Quarto (USD)
            </span>

            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Rafael:</label>
                <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-white">
                  <span className="text-xs text-slate-500 mr-1">$</span>
                  <input
                    type="number"
                    value={rafaelUsd}
                    onChange={(e) => setRafaelUsd(e.target.value)}
                    className="w-full bg-transparent font-semibold text-xs focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Isabella:</label>
                <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-white">
                  <span className="text-xs text-slate-500 mr-1">$</span>
                  <input
                    type="number"
                    value={isabellaUsd}
                    onChange={(e) => setIsabellaUsd(e.target.value)}
                    className="w-full bg-transparent font-semibold text-xs focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Otávio:</label>
                <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-white">
                  <span className="text-xs text-slate-500 mr-1">$</span>
                  <input
                    type="number"
                    value={otavioUsd}
                    onChange={(e) => setOtavioUsd(e.target.value)}
                    className="w-full bg-transparent font-semibold text-xs focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 flex justify-between pt-1">
              <span>Soma dos quartos:</span>
              <span className={`font-mono font-bold ${
                (parseFloat(rafaelUsd) || 0) + (parseFloat(isabellaUsd) || 0) + (parseFloat(otavioUsd) || 0) === (parseFloat(totalUsd) || 0)
                  ? 'text-emerald-400'
                  : 'text-amber-400'
              }`}>
                US$ {(parseFloat(rafaelUsd) || 0) + (parseFloat(isabellaUsd) || 0) + (parseFloat(otavioUsd) || 0)}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Salvar Aluguel</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
