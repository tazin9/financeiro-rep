import React, { useState } from 'react';
import { Calendar, CreditCard, Edit3, Check, Plus, Trash2, RotateCcw } from 'lucide-react';
import { formatCurrency, convertAmount } from '../utils/formatters';

export function ServicesTable({ 
  services, 
  totals, 
  currency, 
  dollarRate, 
  brlRate, 
  onSaveServices 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedServices, setEditedServices] = useState(services || []);

  // Sync state when services prop changes
  React.useEffect(() => {
    setEditedServices(services || []);
    setIsEditing(false);
  }, [services]);

  if (!services || services.length === 0) return null;

  const formatVal = (ars) => {
    const converted = convertAmount(ars, currency, dollarRate, brlRate);
    return formatCurrency(converted, currency);
  };

  const handleFieldChange = (index, field, value) => {
    const updated = [...editedServices];
    updated[index] = {
      ...updated[index],
      [field]: field === 'total' ? (parseFloat(value) || 0) : value,
    };
    setEditedServices(updated);
  };

  const handleAddService = () => {
    setEditedServices([
      ...editedServices,
      {
        vto: '15/12',
        service: 'OUTRO',
        name: 'NOVA CONTA',
        total: 10000,
        payer: 'ISABELLA',
      }
    ]);
  };

  const handleRemoveService = (index) => {
    const updated = editedServices.filter((_, i) => i !== index);
    setEditedServices(updated);
  };

  const handleSave = () => {
    onSaveServices(editedServices);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedServices(services);
    setIsEditing(false);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-white text-sm sm:text-base tracking-tight flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-indigo-400" />
            <span>DETALHAMENTO DE CONTAS E SERVIÇOS DO MÊS</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {isEditing 
              ? 'Modo de edição: altere valores, vencimentos (VTO) ou adicione novas contas.'
              : 'Valores individuais faturados e divisão por morador.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right sm:border-r sm:border-slate-800 sm:pr-3">
            <span className="text-[11px] text-slate-400 block">Total Serviços:</span>
            <div className="text-base sm:text-lg font-bold text-white tracking-tight">
              {formatVal(totals.totalCuentasArs)}
            </div>
          </div>

          {/* Edit / Save Buttons */}
          {isEditing ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 transition-all"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Salvar</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 transition-all"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editar Contas</span>
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Vencimento (VTO)</th>
              <th className="py-3 px-4">Serviço</th>
              <th className="py-3 px-4">Quem Paga</th>
              <th className="py-3 px-4 text-right">Valor Total</th>
              <th className="py-3 px-4 text-right">Cota (1/3)</th>
              {isEditing && <th className="py-3 px-4 text-center w-12">Ação</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {(isEditing ? editedServices : services).map((item, index) => {
              const isOtavio = item.payer === 'OTAVIO';
              return (
                <tr key={index} className="hover:bg-slate-800/30 transition-colors">
                  
                  {/* VTO */}
                  <td className="py-3 px-4 text-slate-300">
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <input
                          type="text"
                          value={item.vto || ''}
                          placeholder="DD/MM"
                          onChange={(e) => handleFieldChange(index, 'vto', e.target.value)}
                          className="w-20 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{item.vto || '—'}</span>
                      </div>
                    )}
                  </td>

                  {/* Service Name */}
                  <td className="py-3 px-4 text-white font-semibold">
                    {isEditing ? (
                      <input
                        type="text"
                        value={item.name || item.service}
                        onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                        className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    ) : (
                      item.name || item.service
                    )}
                  </td>

                  {/* Payer */}
                  <td className="py-3 px-4">
                    {isEditing ? (
                      <select
                        value={item.payer}
                        onChange={(e) => handleFieldChange(index, 'payer', e.target.value)}
                        className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                      >
                        <option value="OTAVIO">Otávio</option>
                        <option value="ISABELLA">Isabella</option>
                      </select>
                    ) : (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                        isOtavio
                          ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                          : 'bg-violet-500/10 text-violet-400 border-violet-500/20'
                      }`}>
                        {isOtavio ? 'Otávio' : 'Isabella'}
                      </span>
                    )}
                  </td>

                  {/* Total Value */}
                  <td className="py-3 px-4 text-right font-mono text-white">
                    {isEditing ? (
                      <div className="flex items-center justify-end gap-1">
                        <span className="text-slate-500">$</span>
                        <input
                          type="number"
                          step="any"
                          value={item.total}
                          onChange={(e) => handleFieldChange(index, 'total', e.target.value)}
                          className="w-28 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-right font-bold"
                        />
                      </div>
                    ) : (
                      formatVal(item.total)
                    )}
                  </td>

                  {/* Share per person */}
                  <td className="py-3 px-4 text-right font-mono text-slate-300">
                    {formatVal(item.total / 3)}
                  </td>

                  {/* Action Delete in edit mode */}
                  {isEditing && (
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveService(index)}
                        className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Remover conta"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>

          {/* Footer */}
          <tfoot className="bg-slate-950/90 border-t border-slate-800 font-bold text-white text-xs sm:text-sm">
            <tr>
              <td colSpan="3" className="py-3.5 px-4 text-slate-400">
                {isEditing ? (
                  <button
                    type="button"
                    onClick={handleAddService}
                    className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar Outra Conta</span>
                  </button>
                ) : (
                  'SOMA TOTAL DAS CONTAS:'
                )}
              </td>
              <td className="py-3.5 px-4 text-right font-mono text-indigo-300 text-base">
                {formatVal(isEditing ? editedServices.reduce((a, s) => a + (s.total || 0), 0) : totals.totalCuentasArs)}
              </td>
              <td className="py-3.5 px-4 text-right font-mono text-slate-300">
                {formatVal((isEditing ? editedServices.reduce((a, s) => a + (s.total || 0), 0) : totals.totalCuentasArs) / 3)}
              </td>
              {isEditing && <td></td>}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
