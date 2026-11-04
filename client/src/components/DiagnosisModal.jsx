import React, { useState } from 'react';
import { 
  X, 
  TrendingUp, 
  Zap, 
  Flame, 
  Droplet, 
  Wifi, 
  Building, 
  Save, 
  Check, 
  Info,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export function DiagnosisModal({ 
  isOpen, 
  onClose, 
  analysis, 
  customData, 
  monthId, 
  monthName,
  onSaveCustomData 
}) {
  if (!isOpen) return null;

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Local form states
  const [luzKwh, setLuzKwh] = useState(customData?.consumption?.luz?.kwh || '');
  const [gasM3, setGasM3] = useState(customData?.consumption?.gas?.m3 || '');
  const [aysaM3, setAysaM3] = useState(customData?.consumption?.aysa?.m3 || '');

  const [expensasA, setExpensasA] = useState(customData?.expensasBreakdown?.expensasA || '');
  const [fundoDeCaja, setFundoDeCaja] = useState(customData?.expensasBreakdown?.fundoDeCaja || '');
  const [gastosParticulares, setGastosParticulares] = useState(customData?.expensasBreakdown?.gastosParticulares || '');
  const [interesesPunitorios, setInteresesPunitorios] = useState(customData?.expensasBreakdown?.interesesPunitorios || '');
  const [redondeo, setRedondeo] = useState(customData?.expensasBreakdown?.redondeo || '');
  const [expensasNotes, setExpensasNotes] = useState(customData?.expensasBreakdown?.notes || '');

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSaveCustomData(monthId, {
        consumption: {
          luz: { kwh: luzKwh ? parseFloat(luzKwh) : null },
          gas: { m3: gasM3 ? parseFloat(gasM3) : null },
          aysa: { m3: aysaM3 ? parseFloat(aysaM3) : null },
        },
        expensasBreakdown: {
          expensasA: expensasA ? parseFloat(expensasA) : null,
          fundoDeCaja: fundoDeCaja ? parseFloat(fundoDeCaja) : null,
          gastosParticulares: gastosParticulares ? parseFloat(gastosParticulares) : null,
          interesesPunitorios: interesesPunitorios ? parseFloat(interesesPunitorios) : null,
          redondeo: redondeo ? parseFloat(redondeo) : null,
          notes: expensasNotes,
        }
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar diagnóstico: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const services = analysis?.services || {};
  const expAnalysis = analysis?.expensas;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                DIAGNÓSTICO DE CONTAS & INFLAÇÃO ({monthName})
              </h2>
              <p className="text-xs text-slate-400">
                Descubra por que pagamos mais ou menos: separe consumo real de aumento de tarifas e inflação.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSave} className="p-4 sm:p-6 space-y-6">

          {/* 1. SEÇÃO: CONTAS COM CONSUMO VARIÁVEL */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                1. Serviços com Medição de Consumo
              </span>
              <span className="text-[11px] text-slate-500">• Luz (kWh), Gás (m³), Água</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Luz */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" /> LUZ (EDENOR)
                    </span>
                    <span className="text-xs font-mono font-bold text-white">
                      {formatCurrency(services['LUZ']?.currTotal || 0)}
                    </span>
                  </div>

                  <div className="mt-3">
                    <label className="text-[11px] text-slate-400 block mb-1">
                      Consumo faturado (kWh):
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder="Ex: 175"
                      value={luzKwh}
                      onChange={(e) => setLuzKwh(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                    />
                  </div>

                  {/* Insight / result */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] text-slate-400">
                    <p className="leading-relaxed">
                      {services['LUZ']?.insight || 'Sem dados do mês anterior.'}
                    </p>
                    {services['LUZ']?.consumption && (
                      <div className="mt-1.5 bg-slate-900/80 p-2 rounded border border-slate-800 text-[10px] space-y-0.5">
                        <div className="flex justify-between">
                          <span>Tarifa unitária:</span>
                          <span className="font-mono text-white">
                            ${services['LUZ'].consumption.currUnitPrice.toFixed(2)} / kWh
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Variação de tarifa:</span>
                          <span className={`font-mono font-semibold ${services['LUZ'].consumption.priceDelta >= 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {services['LUZ'].consumption.pricePercent.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Gás */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-orange-400" /> GÁS (METROGAS)
                    </span>
                    <span className="text-xs font-mono font-bold text-white">
                      {formatCurrency(services['GAS']?.currTotal || 0)}
                    </span>
                  </div>

                  <div className="mt-3">
                    <label className="text-[11px] text-slate-400 block mb-1">
                      Consumo faturado (m³):
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder="Ex: 42"
                      value={gasM3}
                      onChange={(e) => setGasM3(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                    />
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] text-slate-400">
                    <p className="leading-relaxed">
                      {services['GAS']?.insight || 'Sem dados do mês anterior.'}
                    </p>
                    {services['GAS']?.consumption && (
                      <div className="mt-1.5 bg-slate-900/80 p-2 rounded border border-slate-800 text-[10px] space-y-0.5">
                        <div className="flex justify-between">
                          <span>Tarifa unitária:</span>
                          <span className="font-mono text-white">
                            ${services['GAS'].consumption.currUnitPrice.toFixed(2)} / m³
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Variação de tarifa:</span>
                          <span className={`font-mono font-semibold ${services['GAS'].consumption.priceDelta >= 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {services['GAS'].consumption.pricePercent.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Água (Aysa) */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <Droplet className="w-3.5 h-3.5 text-cyan-400" /> ÁGUA (AYSA)
                    </span>
                    <span className="text-xs font-mono font-bold text-white">
                      {formatCurrency(services['AYSA']?.currTotal || 0)}
                    </span>
                  </div>

                  <div className="mt-3">
                    <label className="text-[11px] text-slate-400 block mb-1">
                      Consumo (m³ opcional):
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder="Ex: 12"
                      value={aysaM3}
                      onChange={(e) => setAysaM3(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                    />
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] text-slate-400">
                    <p className="leading-relaxed">
                      {services['AYSA']?.insight || 'Tarifa fixa/medida de água.'}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* 2. SEÇÃO: CONTAS SEM CONSUMO (INFLAÇÃO / TARIFA PURA) */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                2. Serviços sem Consumo (100% Inflação / Reajuste Tarifário)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Internet */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Wifi className="w-3.5 h-3.5 text-indigo-400" /> INTERNET (TELECENTRO)
                  </span>
                  <span className="text-xs font-mono font-bold text-white">
                    {formatCurrency(services['INTERNET']?.currTotal || 0)}
                  </span>
                </div>
                <div className="mt-2 text-xs text-slate-300">
                  <p className="leading-relaxed">{services['INTERNET']?.insight}</p>
                </div>
              </div>

              {/* ABL */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-violet-400" /> ABL (IMPOSTO PREDIAL)
                  </span>
                  <span className="text-xs font-mono font-bold text-white">
                    {formatCurrency(services['ABL']?.currTotal || 0)}
                  </span>
                </div>
                <div className="mt-2 text-xs text-slate-300">
                  <p className="leading-relaxed">{services['ABL']?.insight}</p>
                </div>
              </div>

            </div>
          </div>

          {/* 3. SEÇÃO: SUBDIVISÃO DAS EXPENSAS */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  3. Detalhamento Interno das Expensas
                </span>
                <span className="text-[11px] text-slate-500">
                  Total Faturado: <strong className="text-white font-mono">{formatCurrency(services['EXPENSAS']?.currTotal || 0)}</strong>
                </span>
              </div>
            </div>

            {expAnalysis?.insight && (
              <div className="mb-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
                <p>{expAnalysis.insight}</p>
              </div>
            )}

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <p className="text-[11px] text-slate-400">
                Consulte o demonstrativo do condomínio para preencher os valores componentes e identificar exatamente o que causou o aumento:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Expensas A (Ordinarias):</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="$ 0,00"
                    value={expensasA}
                    onChange={(e) => setExpensasA(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Fundo de Reserva / Caja:</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="$ 0,00"
                    value={fundoDeCaja}
                    onChange={(e) => setFundoDeCaja(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Gastos Particulares:</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="$ 0,00"
                    value={gastosParticulares}
                    onChange={(e) => setGastosParticulares(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Intereses Punitorios:</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="$ 0,00"
                    value={interesesPunitorios}
                    onChange={(e) => setInteresesPunitorios(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Redondeo / Ajustes:</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="$ 0,00"
                    value={redondeo}
                    onChange={(e) => setRedondeo(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Anotações / Motivo:</label>
                  <input
                    type="text"
                    placeholder="Ex: Reforma da portaria, 13º salário..."
                    value={expensasNotes}
                    onChange={(e) => setExpensasNotes(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

              </div>
            </div>
          </div>

          {/* Footer Save Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {savedSuccess ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="w-4 h-4" /> Diagnóstico salvo com sucesso no arquivo do mês!
                </span>
              ) : (
                'Os dados ficam salvos para compor o histórico e relatórios.'
              )}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all"
              >
                Fechar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Salvando...' : 'Salvar Diagnóstico'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
