import React, { useState } from 'react';
import { 
  ArrowRight, 
  Copy, 
  Check, 
  CheckCircle2, 
  Clock, 
  User, 
  Sparkles,
  ArrowRightLeft,
  Receipt
} from 'lucide-react';
import { formatCurrency, convertAmount } from '../utils/formatters';

export function SettlementCards({
  settlement,
  totals,
  bankDetails,
  paymentStatus,
  onToggleStatus,
  currency,
  dollarRate,
  brlRate,
}) {
  const [copiedKey, setCopiedKey] = useState(null);

  if (!settlement) return null;

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const { rafael, netOtavioIsa, grossOtavioPaidPerPerson, grossIsaPaidPerPerson } = settlement;

  const rafaelToOtavioStatus = paymentStatus?.billsRafaelToOtavio || false;
  const rafaelToIsaStatus = paymentStatus?.billsRafaelToIsa || false;
  const netIsaOtavioStatus = paymentStatus?.billsNetIsaOtavio || false;

  const otavioAlias = bankDetails?.otavio?.alias || 'otavio.alias';
  const isaAlias = bankDetails?.isabella?.alias || 'isa.alias';

  // Format values according to chosen currency
  const formatVal = (ars) => {
    const converted = convertAmount(ars, currency, dollarRate, brlRate);
    return formatCurrency(converted, currency);
  };

  return (
    <div className="space-y-4">
      {/* Section Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>ACERTOS DAS CONTAS (SERVIÇOS)</span>
            <span className="text-xs font-normal text-slate-400">
              (Expensas, Internet, Luz, Gás, Aysa, ABL)
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Quem transfere para quem neste mês, já com compensações calculadas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* 1. RAFAEL */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold text-sm">
                  R
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">RAFAEL</h3>
                  <span className="text-[11px] text-slate-400">Total contas: {formatVal(rafael.totalBills)}</span>
                </div>
              </div>
              <span className="text-[10px] uppercase font-semibold bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20">
                1/3 de todas as contas
              </span>
            </div>

            {/* Transfer to Otavio */}
            <div className="mt-4 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Transferir para <strong className="text-indigo-300">Otávio</strong></span>
                <span className="text-[10px] text-slate-500">Expensas + Internet</span>
              </div>
              <div className="mt-1.5 flex items-baseline justify-between">
                <span className="text-lg font-bold text-white tracking-tight">
                  {formatVal(rafael.toOtavio)}
                </span>
                <button
                  onClick={() => onToggleStatus('billsRafaelToOtavio')}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                    rafaelToOtavioStatus
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20'
                  }`}
                >
                  {rafaelToOtavioStatus ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                  <span>{rafaelToOtavioStatus ? 'Pago' : 'Pendente'}</span>
                </button>
              </div>

              {/* Copy Otavio CBU/Alias */}
              <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 truncate max-w-[170px]">
                  Alias: <code className="text-indigo-300">{otavioAlias}</code>
                </span>
                <button
                  onClick={() => handleCopy(otavioAlias, 'rafael-otavio-alias')}
                  className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  {copiedKey === 'rafael-otavio-alias' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Transfer to Isa */}
            <div className="mt-3 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Transferir para <strong className="text-violet-300">Isa</strong></span>
                <span className="text-[10px] text-slate-500">Luz, Gás, ABL, Aysa</span>
              </div>
              <div className="mt-1.5 flex items-baseline justify-between">
                <span className="text-lg font-bold text-white tracking-tight">
                  {formatVal(rafael.toIsa)}
                </span>
                <button
                  onClick={() => onToggleStatus('billsRafaelToIsa')}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                    rafaelToIsaStatus
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20'
                  }`}
                >
                  {rafaelToIsaStatus ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                  <span>{rafaelToIsaStatus ? 'Pago' : 'Pendente'}</span>
                </button>
              </div>

              {/* Copy Isa CBU/Alias */}
              <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 truncate max-w-[170px]">
                  Alias: <code className="text-violet-300">{isaAlias}</code>
                </span>
                <button
                  onClick={() => handleCopy(isaAlias, 'rafael-isa-alias')}
                  className="flex items-center gap-1 text-violet-400 hover:text-violet-300 font-medium"
                >
                  {copiedKey === 'rafael-isa-alias' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. ACERTO OTÁVIO & ISABELLA (Compensação Líquida) */}
        <div className="bg-slate-900/60 border border-indigo-500/30 rounded-2xl p-5 shadow-lg shadow-indigo-500/5 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 text-white flex items-center justify-center font-bold text-xs">
                  <ArrowRightLeft className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">ACERTO: OTÁVIO & ISA</h3>
                  <span className="text-[11px] text-indigo-400 font-medium">Compensação Líquida</span>
                </div>
              </div>
              <span className="text-[10px] uppercase font-semibold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
                1 Transferência só
              </span>
            </div>

            {/* Net settlement highlight */}
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-b from-indigo-950/40 to-slate-950 border border-indigo-500/30">
              <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-medium">
                <span>{netOtavioIsa.from === 'ISABELLA' ? 'Isabella' : 'Otávio'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-bold text-white">{netOtavioIsa.to === 'OTAVIO' ? 'Otávio' : 'Isabella'}</span>
              </div>

              <div className="mt-2 flex items-baseline justify-between">
                <div>
                  <div className="text-2xl font-black text-white tracking-tight">
                    {formatVal(netOtavioIsa.amount)}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {netOtavioIsa.from === 'ISABELLA' 
                      ? 'Isa transfere a diferença líquida para Otávio' 
                      : 'Otávio transfere a diferença líquida para Isa'}
                  </p>
                </div>

                <button
                  onClick={() => onToggleStatus('billsNetIsaOtavio')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    netIsaOtavioStatus
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20'
                  }`}
                >
                  {netIsaOtavioStatus ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Clock className="w-3.5 h-3.5 text-amber-400" />}
                  <span>{netIsaOtavioStatus ? 'Pago' : 'Pendente'}</span>
                </button>
              </div>

              {/* Copy destination Alias */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 truncate max-w-[190px]">
                  Alias de {netOtavioIsa.to === 'OTAVIO' ? 'Otávio' : 'Isa'}:{' '}
                  <code className="text-white font-mono text-[11px]">
                    {netOtavioIsa.to === 'OTAVIO' ? otavioAlias : isaAlias}
                  </code>
                </span>
                <button
                  onClick={() => handleCopy(netOtavioIsa.to === 'OTAVIO' ? otavioAlias : isaAlias, 'net-settlement-alias')}
                  className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  {copiedKey === 'net-settlement-alias' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Detailed math explanation (transparent) */}
            <div className="mt-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 text-[11px] space-y-1.5 text-slate-400">
              <div className="flex justify-between">
                <span>Cota paga por Otávio (1/3 Exp + Net):</span>
                <span className="text-slate-200 font-mono">{formatVal(grossOtavioPaidPerPerson)}</span>
              </div>
              <div className="flex justify-between">
                <span>Cota paga por Isa (1/3 Luz+Gás+ABL+Ay):</span>
                <span className="text-slate-200 font-mono">{formatVal(grossIsaPaidPerPerson)}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-800 font-medium text-slate-300">
                <span>Diferença Líquida ({formatVal(grossOtavioPaidPerPerson)} - {formatVal(grossIsaPaidPerPerson)}):</span>
                <span className="text-indigo-300 font-mono">{formatVal(netOtavioIsa.amount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. RESUMO OTÁVIO */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold text-sm">
                  O
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">OTÁVIO (RESUMO)</h3>
                  <span className="text-[11px] text-slate-400">Fluxo de Caixa do Mês</span>
                </div>
              </div>
              <span className="text-[10px] uppercase font-semibold bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/20">
                Gestão
              </span>
            </div>

            <div className="mt-4 space-y-2.5">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block">Total adiantado em contas (Internet + Expensas):</span>
                <span className="text-base font-bold text-white tracking-tight mt-0.5 block">
                  {formatVal(totals.otavioPaidServices)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block">Valores a receber de contas neste mês:</span>
                <div className="mt-1 space-y-1 text-xs">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Do Rafael:</span>
                    <span className="font-mono font-semibold text-white">{formatVal(rafael.toOtavio)}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Da Isabella (Líquido):</span>
                    <span className="font-mono font-semibold text-white">{formatVal(netOtavioIsa.amount)}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20">
                <span className="text-[11px] text-indigo-300 block">Custo Real Final de Otávio em contas:</span>
                <span className="text-base font-bold text-indigo-200 tracking-tight mt-0.5 block">
                  {formatVal(rafael.toOtavio)}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  (Sua cota de 1/3 de todos os serviços da casa)
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
