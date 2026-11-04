import React from 'react';
import { Calendar, Tag, CreditCard } from 'lucide-react';
import { formatCurrency, convertAmount } from '../utils/formatters';

export function ServicesTable({ services, totals, currency, dollarRate, brlRate }) {
  if (!services || services.length === 0) return null;

  const formatVal = (ars) => {
    const converted = convertAmount(ars, currency, dollarRate, brlRate);
    return formatCurrency(converted, currency);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
      <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-white text-sm sm:text-base tracking-tight flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-indigo-400" />
            <span>DETALHAMENTO DE CONTAS E SERVIÇOS DO MÊS</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Valores individuais faturados e divisão por morador.
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400">Total Serviços:</span>
          <div className="text-lg font-bold text-white tracking-tight">
            {formatVal(totals.totalCuentasArs)}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Vencimento (VTO)</th>
              <th className="py-3 px-4">Serviço</th>
              <th className="py-3 px-4">Quem Paga</th>
              <th className="py-3 px-4 text-right">Valor Total</th>
              <th className="py-3 px-4 text-right">Cota por Pessoa (1/3)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {services.map((item, index) => {
              const isOtavio = item.payer === 'OTAVIO';
              return (
                <tr key={index} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{item.vto || '—'}</span>
                  </td>
                  <td className="py-3 px-4 text-white font-semibold">
                    {item.name || item.service}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                      isOtavio
                        ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                        : 'bg-violet-500/10 text-violet-400 border-violet-500/20'
                    }`}>
                      {isOtavio ? 'Otávio' : 'Isabella'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-white">
                    {formatVal(item.total)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-300">
                    {formatVal(item.total / 3)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-slate-950/90 border-t border-slate-800 font-bold text-white text-xs sm:text-sm">
            <tr>
              <td colSpan="3" className="py-3.5 px-4 text-slate-400">
                SOMA TOTAL DAS CONTAS:
              </td>
              <td className="py-3.5 px-4 text-right font-mono text-indigo-300 text-base">
                {formatVal(totals.totalCuentasArs)}
              </td>
              <td className="py-3.5 px-4 text-right font-mono text-slate-300">
                {formatVal(totals.totalCuentasArs / 3)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
