import React, { useState } from 'react';
import { X, CreditCard, Copy, Check, Save, ShieldCheck } from 'lucide-react';

export function BankModal({ 
  isOpen, 
  onClose, 
  bankDetails, 
  onSaveBankDetails 
}) {
  if (!isOpen) return null;

  const [saving, setSaving] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [otavioData, setOtavioData] = useState({
    name: bankDetails?.otavio?.name || 'Otávio',
    bank: bankDetails?.otavio?.bank || 'Mercado Pago / Santander',
    alias: bankDetails?.otavio?.alias || 'otavio.mp',
    cbu: bankDetails?.otavio?.cbu || '0000003100012345678901',
    holder: bankDetails?.otavio?.holder || 'Otavio',
    cuitCuil: bankDetails?.otavio?.cuitCuil || '',
  });

  const [isaData, setIsaData] = useState({
    name: bankDetails?.isabella?.name || 'Isabella',
    bank: bankDetails?.isabella?.bank || 'Brubank / Galicia',
    alias: bankDetails?.isabella?.alias || 'isa.alias',
    cbu: bankDetails?.isabella?.cbu || '0000003100098765432101',
    holder: bankDetails?.isabella?.holder || 'Isabella',
    cuitCuil: bankDetails?.isabella?.cuitCuil || '',
  });

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSaveBankDetails({
        otavio: otavioData,
        isabella: isaData,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      alert('Erro ao salvar dados bancários: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                DADOS BANCÁRIOS PARA RECEBIMENTO (CBU / ALIAS)
              </h2>
              <p className="text-xs text-slate-400">
                Copie com 1 clique para fazer as transferências no app do banco ou edite as informações.
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

        {/* Content */}
        <form onSubmit={handleSave} className="p-4 sm:p-6 space-y-5">

          {/* OTÁVIO */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-indigo-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wide flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                Dados de Recebimento de Otávio (Expensas + Internet)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Alias Bancário:</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={otavioData.alias}
                    onChange={(e) => setOtavioData({ ...otavioData, alias: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopy(otavioData.alias, 'otavio-alias')}
                    className="px-2.5 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-semibold flex items-center gap-1 flex-shrink-0"
                    title="Copiar Alias"
                  >
                    {copiedKey === 'otavio-alias' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">CBU / CVU:</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={otavioData.cbu}
                    onChange={(e) => setOtavioData({ ...otavioData, cbu: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopy(otavioData.cbu, 'otavio-cbu')}
                    className="px-2.5 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-semibold flex items-center gap-1 flex-shrink-0"
                    title="Copiar CBU"
                  >
                    {copiedKey === 'otavio-cbu' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Banco / Carteira:</label>
                <input
                  type="text"
                  value={otavioData.bank}
                  onChange={(e) => setOtavioData({ ...otavioData, bank: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Titular da Conta:</label>
                <input
                  type="text"
                  value={otavioData.holder}
                  onChange={(e) => setOtavioData({ ...otavioData, holder: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* ISABELLA */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-violet-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-violet-300 uppercase tracking-wide flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-violet-400" />
                Dados de Recebimento de Isabella (Luz + Gás + ABL + Aysa)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Alias Bancário:</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={isaData.alias}
                    onChange={(e) => setIsaData({ ...isaData, alias: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopy(isaData.alias, 'isa-alias')}
                    className="px-2.5 py-1.5 bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 rounded-lg text-xs font-semibold flex items-center gap-1 flex-shrink-0"
                    title="Copiar Alias"
                  >
                    {copiedKey === 'isa-alias' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">CBU / CVU:</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={isaData.cbu}
                    onChange={(e) => setIsaData({ ...isaData, cbu: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopy(isaData.cbu, 'isa-cbu')}
                    className="px-2.5 py-1.5 bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 rounded-lg text-xs font-semibold flex items-center gap-1 flex-shrink-0"
                    title="Copiar CBU"
                  >
                    {copiedKey === 'isa-cbu' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Banco / Carteira:</label>
                <input
                  type="text"
                  value={isaData.bank}
                  onChange={(e) => setIsaData({ ...isaData, bank: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Titular da Conta:</label>
                <input
                  type="text"
                  value={isaData.holder}
                  onChange={(e) => setIsaData({ ...isaData, holder: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>
            </div>
          </div>

          {/* Footer Save Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {savedSuccess ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="w-4 h-4" /> Dados bancários atualizados com sucesso!
                </span>
              ) : (
                'Fica salvo para todos os moradores consultarem e copiarem.'
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
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Salvando...' : 'Salvar Dados'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
