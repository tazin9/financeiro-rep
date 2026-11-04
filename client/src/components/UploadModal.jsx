import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  FileText, 
  Sparkles, 
  CalendarPlus, 
  RotateCcw,
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { uploadCSV, createNextMonth, resetAllData } from '../api';

export function UploadModal({ 
  isOpen, 
  onClose, 
  onMonthCreated,
  onResetComplete 
}) {
  if (!isOpen) return null;

  const [tab, setTab] = useState('auto'); // 'auto' | 'upload'
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Auto next month params
  const [customDollar, setCustomDollar] = useState('');
  const [customBrl, setCustomBrl] = useState('');
  const [customRent, setCustomRent] = useState('');

  const handleCreateAuto = async () => {
    setLoading(true);
    setError(null);
    try {
      const newMonth = await createNextMonth({
        dollarBlue: customDollar ? parseFloat(customDollar) : null,
        brlRate: customBrl ? parseFloat(customBrl) : null,
        rentUsd: customRent ? parseFloat(customRent) : null,
      });
      onMonthCreated(newMonth);
      onClose();
    } catch (err) {
      setError(err.message || 'Erro ao criar próximo mês.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const dropped = e.dataTransfer.files[0];
      if (dropped.name.endsWith('.csv')) {
        setFile(dropped);
        setError(null);
      } else {
        setError('Por favor envie um arquivo com extensão .csv');
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      if (selected.name.endsWith('.csv')) {
        setFile(selected);
        setError(null);
      } else {
        setError('Por favor envie um arquivo com extensão .csv');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const res = await uploadCSV(file);
      onMonthCreated(res.month);
      onClose();
    } catch (err) {
      setError(err.message || 'Erro ao processar o CSV.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Tem certeza que deseja restaurar os dados originais? Suas edições locais serão substituídas pelos dados de fábrica.')) {
      setLoading(true);
      await resetAllData();
      onResetComplete();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl p-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <CalendarPlus className="w-4 h-4 text-indigo-400" />
            <span>ADICIONAR / GERENCIAR MESES</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 mt-4">
          <button
            onClick={() => setTab('auto')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              tab === 'auto' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Criar Próximo Mês</span>
          </button>
          <button
            onClick={() => setTab('upload')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              tab === 'upload' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Subir Planilha CSV</span>
          </button>
        </div>

        {/* Tab 1: Create Auto */}
        {tab === 'auto' && (
          <div className="mt-4 space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300">
              <p className="font-semibold text-white mb-1">Criação rápida com 1 clique:</p>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                O app copia a estrutura das contas e quartos do último mês (datas e serviços) para você apenas atualizar os valores conforme as faturas forem chegando.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Dólar Blue (opcional):</label>
                <input
                  type="number"
                  placeholder="Ex: 1580"
                  value={customDollar}
                  onChange={(e) => setCustomDollar(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Cotação R$ (opcional):</label>
                <input
                  type="number"
                  placeholder="Ex: 300"
                  value={customBrl}
                  onChange={(e) => setCustomBrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Aluguel USD (opcional):</label>
                <input
                  type="number"
                  placeholder="Ex: 900"
                  value={customRent}
                  onChange={(e) => setCustomRent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>
            </div>

            <button
              disabled={loading}
              onClick={handleCreateAuto}
              className="w-full py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>{loading ? 'Criando...' : 'Adicionar Próximo Mês'}</span>
            </button>
          </div>
        )}

        {/* Tab 2: Upload CSV */}
        {tab === 'upload' && (
          <div className="mt-4">
            <p className="text-xs text-slate-400 mb-3">
              Baixe a aba do mês correspondente no Google Sheets em formato <strong>.csv</strong> e arraste para cá:
            </p>

            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleFileDrop}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                dragOver
                  ? 'border-indigo-500 bg-indigo-500/10'
                  : 'border-slate-700 bg-slate-950/60 hover:border-slate-600'
              }`}
              onClick={() => document.getElementById('csv-file-input').click()}
            >
              <input
                id="csv-file-input"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-10 h-10 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-2">
                <FileText className="w-5 h-5 text-indigo-400" />
              </div>
              {file ? (
                <div className="text-xs">
                  <span className="font-semibold text-white block">{file.name}</span>
                  <span className="text-emerald-400 text-[11px] mt-0.5 inline-block">Arquivo pronto para importar</span>
                </div>
              ) : (
                <div className="text-xs text-slate-400">
                  <span className="font-semibold text-indigo-300">Clique para selecionar</span> ou arraste o arquivo CSV
                  <span className="block text-[11px] text-slate-500 mt-1">Ex: CONTAS REP - Dezembro_26.csv</span>
                </div>
              )}
            </div>

            <div className="mt-3 flex justify-end">
              <button
                disabled={!file || loading}
                onClick={handleUpload}
                className="w-full py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
              >
                {loading ? 'Processando...' : 'Importar Planilha CSV'}
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-3 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Reset Option */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>Precisa reiniciar os dados?</span>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-slate-400 hover:text-rose-400 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restaurar Originais</span>
          </button>
        </div>

      </div>
    </div>
  );
}
