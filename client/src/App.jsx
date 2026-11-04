import React, { useState, useEffect } from 'react';
import { 
  fetchMonths, 
  fetchMonthDetail, 
  updateMonth,
  updateMonthCustom, 
  fetchBankDetails, 
  updateBankDetails 
} from './api';
import { Navbar } from './components/Navbar';
import { RatesBar } from './components/RatesBar';
import { RentCard } from './components/RentCard';
import { SettlementCards } from './components/SettlementCards';
import { ServicesTable } from './components/ServicesTable';
import { DiagnosisModal } from './components/DiagnosisModal';
import { BankModal } from './components/BankModal';
import { UploadModal } from './components/UploadModal';
import { formatCurrency, convertAmount } from './utils/formatters';
import { Sparkles, Calendar, ChevronLeft, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react';

export function App() {
  const [months, setMonths] = useState([]);
  const [currentMonthId, setCurrentMonthId] = useState(null);
  const [currentMonthData, setCurrentMonthData] = useState(null);
  const [customData, setCustomData] = useState(null);
  const [bankDetails, setBankDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Currency & Rate Simulation
  const [currency, setCurrency] = useState(() => localStorage.getItem('rep_currency') || 'ARS');
  const [ratesOpen, setRatesOpen] = useState(false);
  const [customDollar, setCustomDollar] = useState(() => {
    const val = localStorage.getItem('rep_custom_dollar');
    return val ? parseFloat(val) : null;
  });
  const [customBrlRate, setCustomBrlRate] = useState(() => {
    const val = localStorage.getItem('rep_custom_brl');
    return val ? parseFloat(val) : null;
  });

  // Modals
  const [diagnosisOpen, setDiagnosisOpen] = useState(false);
  const [bankOpen, setBankOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  // Initial load
  useEffect(() => {
    loadInitial();
  }, []);

  const loadInitial = async () => {
    setLoading(true);
    setError(null);
    try {
      const [monthsList, banks] = await Promise.all([
        fetchMonths(),
        fetchBankDetails(),
      ]);
      setMonths(monthsList);
      setBankDetails(banks);

      if (monthsList.length > 0) {
        // Default to latest month
        const latest = monthsList[monthsList.length - 1];
        setCurrentMonthId(latest.id);
        await loadMonthDetail(latest.id);
      }
    } catch (err) {
      console.error(err);
      setError('Não foi possível carregar os dados.');
    } finally {
      setLoading(false);
    }
  };

  const loadMonthDetail = async (id) => {
    try {
      const res = await fetchMonthDetail(id);
      setCurrentMonthData(res.month);
      setCustomData(res.customData);
      setCurrentMonthId(id);
    } catch (err) {
      console.error(err);
      alert('Erro ao carregar o mês selecionado.');
    }
  };

  const handleSelectMonth = (id) => {
    loadMonthDetail(id);
  };

  // Toggle Payment Status
  const handleToggleStatus = async (statusKey) => {
    if (!currentMonthId || !customData) return;
    const currentStatus = customData.paymentStatus || {};
    const newStatus = {
      ...currentStatus,
      [statusKey]: !currentStatus[statusKey],
    };

    setCustomData({
      ...customData,
      paymentStatus: newStatus,
    });

    try {
      await updateMonthCustom(currentMonthId, {
        paymentStatus: newStatus,
      });
      setMonths(months.map(m => m.id === currentMonthId ? { ...m, paymentStatus: newStatus } : m));
    } catch (err) {
      console.error(err);
      setCustomData({
        ...customData,
        paymentStatus: currentStatus,
      });
    }
  };

  // Save Services (Values, VTOs, names, added/deleted services)
  const handleSaveServices = async (updatedServices) => {
    if (!currentMonthData) return;
    const updatedMonth = {
      ...currentMonthData,
      services: updatedServices,
    };
    const saved = await updateMonth(updatedMonth);
    setCurrentMonthData(saved);
    // Refresh month in summary
    const updatedMonths = await fetchMonths();
    setMonths(updatedMonths);
  };

  // Save Rent (Total USD, Rafael USD, Isabella USD, Otávio USD)
  const handleSaveRent = async (updatedRent) => {
    if (!currentMonthData) return;
    const updatedMonth = {
      ...currentMonthData,
      rent: updatedRent,
    };
    const saved = await updateMonth(updatedMonth);
    setCurrentMonthData(saved);
    const updatedMonths = await fetchMonths();
    setMonths(updatedMonths);
  };

  // Save Official Global Rates for Month
  const handleSaveOfficialRates = async ({ dollarBlue, brlRate }) => {
    if (!currentMonthData) return;
    const updatedMonth = {
      ...currentMonthData,
      rates: {
        ...currentMonthData.rates,
        dollarBlue: parseFloat(dollarBlue) || currentMonthData.rates.dollarBlue,
        brlRate: parseFloat(brlRate) || currentMonthData.rates.brlRate,
      }
    };
    const saved = await updateMonth(updatedMonth);
    setCurrentMonthData(saved);
    // Clear simulated custom rates since official was changed
    setCustomDollar(null);
    setCustomBrlRate(null);
    localStorage.removeItem('rep_custom_dollar');
    localStorage.removeItem('rep_custom_brl');
    const updatedMonths = await fetchMonths();
    setMonths(updatedMonths);
  };

  const handleSaveCustomDiagnosis = async (id, payload) => {
    const res = await updateMonthCustom(id, payload);
    setCustomData(res.customData);
    await loadMonthDetail(id);
  };

  const handleSaveBankDetails = async (payload) => {
    const res = await updateBankDetails(payload);
    setBankDetails(res.bankDetails);
  };

  const handleCurrencyChange = (newCur) => {
    setCurrency(newCur);
    localStorage.setItem('rep_currency', newCur);
  };

  const handleCustomDollarChange = (val) => {
    setCustomDollar(val);
    if (val) localStorage.setItem('rep_custom_dollar', val.toString());
    else localStorage.removeItem('rep_custom_dollar');
  };

  const handleCustomBrlRateChange = (val) => {
    setCustomBrlRate(val);
    if (val) localStorage.setItem('rep_custom_brl', val.toString());
    else localStorage.removeItem('rep_custom_brl');
  };

  const handleResetRates = () => {
    setCustomDollar(null);
    setCustomBrlRate(null);
    localStorage.removeItem('rep_custom_dollar');
    localStorage.removeItem('rep_custom_brl');
  };

  const handleMonthCreated = async (newMonth) => {
    const updatedMonths = await fetchMonths();
    setMonths(updatedMonths);
    if (newMonth && newMonth.id) {
      setCurrentMonthId(newMonth.id);
      await loadMonthDetail(newMonth.id);
    }
  };

  const officialDollar = currentMonthData?.rates?.dollarBlue || 1500;
  const officialBrlRate = currentMonthData?.rates?.brlRate || 300;
  const activeDollar = customDollar || officialDollar;
  const activeBrlRate = customBrlRate || officialBrlRate;

  // Navigation between months
  const currentIndex = months.findIndex(m => m.id === currentMonthId);
  const prevMonth = currentIndex > 0 ? months[currentIndex - 1] : null;
  const nextMonth = currentIndex < months.length - 1 ? months[currentIndex + 1] : null;

  if (loading && !currentMonthData) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-3">
        <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
        <span className="text-sm font-medium">Carregando despesas da casa...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md text-center">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-white mb-2">Erro de Carregamento</h2>
          <p className="text-xs text-slate-400 mb-4">{error}</p>
          <button
            onClick={loadInitial}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-500"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500/30">
      
      {/* 1. Header & Navigation */}
      <Navbar
        months={months}
        currentMonthId={currentMonthId}
        onSelectMonth={handleSelectMonth}
        onOpenRates={() => setRatesOpen(!ratesOpen)}
        ratesOpen={ratesOpen}
        onOpenDiagnosis={() => setDiagnosisOpen(true)}
        onOpenBank={() => setBankOpen(true)}
        onOpenUpload={() => setUploadOpen(true)}
        currency={currency}
        onCurrencyChange={handleCurrencyChange}
      />

      {/* 2. Personalized Currency Simulator & Official Rate Editor */}
      {ratesOpen && (
        <RatesBar
          officialDollar={officialDollar}
          officialBrlRate={officialBrlRate}
          customDollar={customDollar}
          customBrlRate={customBrlRate}
          onCustomDollarChange={handleCustomDollarChange}
          onCustomBrlRateChange={handleCustomBrlRateChange}
          onResetRates={handleResetRates}
          onSaveAsOfficial={handleSaveOfficialRates}
          currency={currency}
          onCurrencyChange={handleCurrencyChange}
        />
      )}

      {/* 3. Main Dashboard Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Month Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800/60">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-white tracking-tight">
              {currentMonthData?.name}
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
              <span>Dólar Blue:</span>
              <strong className="text-emerald-400">${activeDollar}</strong>
              <span className="text-slate-600">|</span>
              <span>R$ 1 =</span>
              <strong className="text-indigo-400">${activeBrlRate}</strong>
            </div>
          </div>

          {/* Month Prev/Next Buttons */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              disabled={!prevMonth}
              onClick={() => prevMonth && handleSelectMonth(prevMonth.id)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>{prevMonth ? prevMonth.name.split(' ')[0] : 'Anterior'}</span>
            </button>
            <button
              disabled={!nextMonth}
              onClick={() => nextMonth && handleSelectMonth(nextMonth.id)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <span>{nextMonth ? nextMonth.name.split(' ')[0] : 'Próximo'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4. ALUGUEL (USD) - SEPARADO DAS CONTAS & EDITÁVEL */}
        <RentCard
          rent={currentMonthData?.rent}
          dollarRate={activeDollar}
          paymentStatus={customData?.paymentStatus}
          onToggleStatus={handleToggleStatus}
          onSaveRent={handleSaveRent}
        />

        {/* 5. ACERTOS DAS CONTAS (SERVIÇOS) - 3 CARTÕES */}
        <SettlementCards
          settlement={currentMonthData?.settlement}
          totals={currentMonthData?.totals}
          bankDetails={bankDetails}
          paymentStatus={customData?.paymentStatus}
          onToggleStatus={handleToggleStatus}
          currency={currency}
          dollarRate={activeDollar}
          brlRate={activeBrlRate}
        />

        {/* 6. TABELA DETALHADA DE CONTAS E SERVIÇOS & EDITÁVEL */}
        <ServicesTable
          services={currentMonthData?.services}
          totals={currentMonthData?.totals}
          currency={currency}
          dollarRate={activeDollar}
          brlRate={activeBrlRate}
          onSaveServices={handleSaveServices}
        />

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 text-center text-xs text-slate-500">
        Financeiro Repartição • Feito para Otávio, Isabella e Rafael • Buenos Aires
      </footer>

      {/* Modals */}
      <DiagnosisModal
        isOpen={diagnosisOpen}
        onClose={() => setDiagnosisOpen(false)}
        analysis={null}
        customData={customData}
        monthId={currentMonthId}
        monthName={currentMonthData?.name}
        onSaveCustomData={handleSaveCustomDiagnosis}
      />

      <BankModal
        isOpen={bankOpen}
        onClose={() => setBankOpen(false)}
        bankDetails={bankDetails}
        onSaveBankDetails={handleSaveBankDetails}
      />

      <UploadModal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onMonthCreated={handleMonthCreated}
        onResetComplete={loadInitial}
      />

    </div>
  );
}

export default App;
