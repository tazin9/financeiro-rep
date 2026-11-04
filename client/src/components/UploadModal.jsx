import React, { useState } from 'react';
import { X, UploadCloud, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { uploadCSV } from '../api';

export function UploadModal({ isOpen, onClose, onUploadSuccess }) {
  if (!isOpen) return null;

  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

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
    setUploading(true);
    setError(null);
    try {
      const res = await uploadCSV(file);
      onUploadSuccess(res.month);
      onClose();
    } catch (err) {
      setError(err.message || 'Erro ao processar o CSV.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full shadow-2xl p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-indigo-400" />
            <span>ADICIONAR NOVO MÊS (CSV)</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

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

          {error && (
            <div className="mt-3 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-lg"
          >
            Cancelar
          </button>
          <button
            disabled={!file || uploading}
            onClick={handleUpload}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md disabled:opacity-50 transition-all flex items-center gap-1.5"
          >
            {uploading ? 'Processando...' : 'Importar Mês'}
          </button>
        </div>
      </div>
    </div>
  );
}
