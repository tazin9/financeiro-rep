import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  Home,
  Receipt
} from 'lucide-react';
import { formatCurrency, convertAmount } from '../utils/formatters';

export function UnifiedPersonCard({
  personKey, // 'rafael' | 'isabella' | 'otavio'
  name,
  roomLabel,
  rentUsd,
  billsArs,
  currency,
  dollarRate,
  brlRate,
  bankDetails,
  settlement,
  totals,
  paymentStatus,
  onToggleStatus,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const rentArs = rentUsd * dollarRate;
  const totalArs = rentArs + billsArs;

  // Converted totals according to active currency
  const totalConverted = convertAmount(totalArs, currency, dollarRate, brlRate);
  const rentConverted = convertAmount(rentArs, currency, dollarRate, brlRate);
  const billsConverted = convertAmount(billsArs, currency, dollarRate, brlRate);

  const formatVal = (ars) => {
    const converted = convertAmount(ars, currency, dollarRate, brlRate);
    return formatCurrency(converted, currency);
  };

  const otavioAlias = bankDetails?.otavio?.alias || 'otavio.alias';
  const otavioCbu = bankDetails?.otavio?.cbu || '';
  const isaAlias = bankDetails?.isabella?.alias || 'isa.alias';
  const isaCbu = bankDetails?.isabella?.cbu || '';

  // Status checks
  const rentPaid = personKey === 'rafael' 
    ? (paymentStatus?.rentRafael || false)
    : (personKey === 'isabella' ? (paymentStatus?.rentIsa || false) : true);

  const billsPaid = personKey === 'rafael'
    ? (paymentStatus?.billsRafaelToOtavio && paymentStatus?.billsRafaelToIsa)
    : (personKey === 'isabella' ? (paymentStatus?.billsNetIsaOtavio || false) : true);

  const allPaid = rentPaid && billsPaid;

  const getAccentColor = () => {
    if (personKey === 'rafael') return 'from-blue-600 to-cyan-500';
    if (personKey === 'isabella') return 'from-violet-600 to-fuchsia-500';
    return 'from-indigo-600 to-sky-500';
  };

  const getBadgeColor = () => {
    if (personKey === 'rafael') return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    if (personKey === 'isabella') return 'bg-violet-500/10 text-violet-400 border-violet-500/20';
    return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl shadow-xl flex flex-col justify-between overflow-hidden transition-all hover:border-slate-700/80">
      
      {/* 1. TOP SECTION: HEADER & MASSIVE TOTAL EMPHASIS */}
      <div className="p-5">
        
        {/* Person Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${getAccentColor()} text-white flex items-center justify-center font-bold text-sm shadow-md`}>
              {name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-white text-base tracking-tight">{name.toUpperCase()}</h3>
              <span className="text-[11px] text-slate-400">{roomLabel}</span>
            </div>
          </div>

          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
            allPaid 
              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
              : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
          }`}>
            {allPaid ? 'Tudo Pago' : 'Pendente'}
          </span>
        </div>

        {/* 🌟 MASSIVE TOTAL EMPHASIS 🌟 */}
        <div className="mt-4 pt-1 pb-2">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block">
            Gasto Total do Mês ({currency}):
          </span>
          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
            {formatCurrency(totalConverted, currency)}
          </div>

          {/* Sutil breakdown */}
          <div className="mt-2 text-xs text-slate-400 flex flex-wrap items-center gap-1.5">
            <span className="text-emerald-400 font-semibold">
              US$ {rentUsd},00 aluguel
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300 font-medium">
              {formatVal(billsArs)} contas
            </span>
          </div>
        </div>

      </div>

      {/* 2. ACCORDION (ABA SANFONA) - RETRÁTIL */}
      <div className="border-t border-slate-800/80 bg-slate-950/40">
        
        {/* Accordion Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-5 py-3 flex items-center justify-between text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/30 transition-all"
        >
          <span className="flex items-center gap-2 text-indigo-300">
            <Receipt className="w-3.5 h-3.5 text-indigo-400" />
            <span>{isOpen ? 'Ocultar detalhes e CBU' : 'Ver detalhes de transferência e CBU'}</span>
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {/* Accordion Expandable Content */}
        {isOpen && (
          <div className="p-5 pt-1 space-y-4 border-t border-slate-800/60 text-xs">

            {/* A. BLOCO ALUGUEL */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-emerald-400" />
                  Aluguel em Dólares (USD)
                </span>
                <span className="font-bold text-white text-sm">US$ {rentUsd},00</span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[11px]">
                <span className="text-slate-400">
                  {personKey === 'otavio' 
                    ? 'Centraliza o pagamento ao proprietário'
                    : 'Entrega dólares em mãos para Otávio'}
                </span>
                {personKey !== 'otavio' && (
                  <button
                    onClick={() => onToggleStatus(personKey === 'rafael' ? 'rentRafael' : 'rentIsa')}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                      rentPaid 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                        : 'bg-amber-500/10 text-amber-300 border border-amber-500/20 hover:bg-amber-500/20'
                    }`}
                  >
                    {rentPaid ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Clock className="w-3 h-3 text-amber-400" />}
                    <span>{rentPaid ? 'Pago' : 'Pendente'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* B. BLOCO CONTAS & TRANSFERÊNCIAS */}
            
            {/* 1. SE RAFAEL */}
            {personKey === 'rafael' && (
              <div className="space-y-2.5">
                {/* To Otavio */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Para <strong>Otávio</strong> (Internet + Expensas):</span>
                    <button
                      onClick={() => onToggleStatus('billsRafaelToOtavio')}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                        paymentStatus?.billsRafaelToOtavio
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                      }`}
                    >
                      {paymentStatus?.billsRafaelToOtavio ? 'Pago' : 'Pendente'}
                    </button>
                  </div>
                  <div className="text-base font-bold text-white">
                    {formatVal(settlement?.rafael?.toOtavio || 0)}
                  </div>
                  <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 truncate max-w-[160px]">
                      Alias: <code className="text-indigo-300">{otavioAlias}</code>
                    </span>
                    <button
                      onClick={() => handleCopy(otavioAlias, 'raf-ota')}
                      className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold"
                    >
                      {copiedKey === 'raf-ota' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'raf-ota' ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                </div>

                {/* To Isa */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Para <strong>Isa</strong> (Luz, Gás, ABL, Aysa):</span>
                    <button
                      onClick={() => onToggleStatus('billsRafaelToIsa')}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                        paymentStatus?.billsRafaelToIsa
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                      }`}
                    >
                      {paymentStatus?.billsRafaelToIsa ? 'Pago' : 'Pendente'}
                    </button>
                  </div>
                  <div className="text-base font-bold text-white">
                    {formatVal(settlement?.rafael?.toIsa || 0)}
                  </div>
                  <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 truncate max-w-[160px]">
                      Alias: <code className="text-violet-300">{isaAlias}</code>
                    </span>
                    <button
                      onClick={() => handleCopy(isaAlias, 'raf-isa')}
                      className="flex items-center gap-1 text-violet-400 hover:text-violet-300 font-semibold"
                    >
                      {copiedKey === 'raf-isa' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'raf-isa' ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. SE ISABELLA */}
            {personKey === 'isabella' && (
              <div className="space-y-2.5">
                <div className="p-3.5 rounded-xl bg-gradient-to-b from-indigo-950/40 to-slate-950 border border-indigo-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-indigo-300">
                      Acerto Líquido com Otávio:
                    </span>
                    <button
                      onClick={() => onToggleStatus('billsNetIsaOtavio')}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                        paymentStatus?.billsNetIsaOtavio
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                      }`}
                    >
                      {paymentStatus?.billsNetIsaOtavio ? 'Pago' : 'Pendente'}
                    </button>
                  </div>

                  <div className="text-lg font-black text-white">
                    {formatVal(settlement?.netOtavioIsa?.amount || 0)}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {settlement?.netOtavioIsa?.from === 'ISABELLA'
                      ? 'Isa transfere a diferença líquida para Otávio'
                      : 'Otávio transfere a diferença líquida para Isa'}
                  </p>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 truncate max-w-[160px]">
                      Alias de {settlement?.netOtavioIsa?.to === 'OTAVIO' ? 'Otávio' : 'Isa'}:{' '}
                      <code className="text-white font-mono text-[10px]">
                        {settlement?.netOtavioIsa?.to === 'OTAVIO' ? otavioAlias : isaAlias}
                      </code>
                    </span>
                    <button
                      onClick={() => handleCopy(settlement?.netOtavioIsa?.to === 'OTAVIO' ? otavioAlias : isaAlias, 'isa-net')}
                      className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold"
                    >
                      {copiedKey === 'isa-net' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'isa-net' ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Total de contas adiantado por Isa:</span>
                    <span className="text-white font-mono">{formatVal(totals?.isaPaidServices || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sua cota real (1/3 das contas):</span>
                    <span className="text-white font-mono">{formatVal(billsArs)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. SE OTÁVIO */}
            {personKey === 'otavio' && (
              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <span className="text-[11px] text-slate-400 block">Adiantado por Otávio (Expensas + Internet):</span>
                  <div className="text-base font-bold text-white">
                    {formatVal(totals?.otavioPaidServices || 0)}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <span className="text-[11px] text-slate-400 block">Recebimentos de Contas a Entrar:</span>
                  <div className="flex justify-between text-[11px] text-slate-300">
                    <span>Do Rafael:</span>
                    <span className="font-mono font-bold text-white">{formatVal(settlement?.rafael?.toOtavio || 0)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-300">
                    <span>Da Isabella (Líquido):</span>
                    <span className="font-mono font-bold text-white">{formatVal(settlement?.netOtavioIsa?.amount || 0)}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20">
                  <span className="text-[11px] text-indigo-300 block">Custo Real Final de Otávio em Contas:</span>
                  <div className="text-base font-bold text-indigo-200 mt-0.5">
                    {formatVal(billsArs)}
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    (1/3 exato de todas as despesas da república)
                  </span>
                </div>
              </div>
            )}

          </div>
        )}
      </div>

    </div>
  );
}
