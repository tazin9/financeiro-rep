import initialMonthsData from './data/initialMonths.json';
import { parseCSVClient } from './utils/csvParser';
import { recalculateMonth } from './utils/calculator';

const LOCAL_STORAGE_MONTHS_KEY = 'rep_all_months_v2';
const LOCAL_STORAGE_CUSTOM_KEY = 'rep_months_custom';
const LOCAL_STORAGE_BANK_KEY = 'rep_bank_details';

const DEFAULT_BANK_DETAILS = {
  otavio: {
    name: 'Otávio',
    bank: 'Mercado Pago / Santander',
    alias: 'otavio.cbu.alias',
    cbu: '0000003100012345678901',
    holder: 'Otavio',
  },
  isabella: {
    name: 'Isabella',
    bank: 'Brubank / Galicia',
    alias: 'isa.cbu.alias',
    cbu: '0000003100098765432101',
    holder: 'Isabella',
  }
};

export function getStoredMonths() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_MONTHS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading months from localStorage:', err);
  }

  // Initialize with initial data
  const initial = initialMonthsData.map(m => recalculateMonth(m));
  localStorage.setItem(LOCAL_STORAGE_MONTHS_KEY, JSON.stringify(initial));
  return initial;
}

export function saveStoredMonths(months) {
  localStorage.setItem(LOCAL_STORAGE_MONTHS_KEY, JSON.stringify(months));
}

export async function fetchMonths() {
  const all = getStoredMonths();
  const customStore = getLocalCustomStore();
  return all.map(m => ({
    id: m.id,
    name: m.name,
    year: m.year,
    monthIndex: m.monthIndex,
    rentUsd: m.rent?.totalUsd || 800,
    dollarBlue: m.rates?.dollarBlue || 1500,
    brlRate: m.rates?.brlRate || 300,
    totalArs: m.totals?.totalArs || 0,
    totalCuentasArs: m.totals?.totalCuentasArs || 0,
    paymentStatus: customStore[m.id]?.paymentStatus || null,
  }));
}

export async function fetchMonthDetail(id) {
  const all = getStoredMonths();
  const index = all.findIndex(m => m.id === id);
  if (index === -1) throw new Error('Mês não encontrado.');

  const current = all[index];
  const prev = index > 0 ? all[index - 1] : null;
  const next = index < all.length - 1 ? all[index + 1] : null;

  const store = getLocalCustomStore();
  const currentCustom = store[id] || {
    paymentStatus: {
      rentRafael: false,
      rentIsa: false,
      billsRafaelToOtavio: false,
      billsRafaelToIsa: false,
      billsNetIsaOtavio: false,
    },
    consumption: { luz: { kwh: null }, gas: { m3: null }, aysa: { m3: null } },
    expensasBreakdown: { expensasA: null, fundoDeCaja: null, gastosParticulares: null, interesesPunitorios: null, redondeo: null },
  };

  return {
    month: current,
    prevMonthId: prev ? prev.id : null,
    nextMonthId: next ? next.id : null,
    customData: currentCustom,
  };
}

export async function updateMonth(updatedMonth) {
  const recalculated = recalculateMonth(updatedMonth);
  const all = getStoredMonths();
  const index = all.findIndex(m => m.id === recalculated.id);
  if (index !== -1) {
    all[index] = recalculated;
  } else {
    all.push(recalculated);
  }
  all.sort((a, b) => a.year !== b.year ? a.year - b.year : a.monthIndex - b.monthIndex);
  saveStoredMonths(all);
  return recalculated;
}

export async function createNextMonth(params = {}) {
  const all = getStoredMonths();
  const lastMonth = all[all.length - 1];

  let nextYear = lastMonth ? lastMonth.year : 2026;
  let nextIndex = lastMonth ? lastMonth.monthIndex + 1 : 12;
  if (nextIndex > 12) {
    nextIndex = 1;
    nextYear += 1;
  }

  const MONTH_NAMES_LIST = [
    '', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const monthNameStr = MONTH_NAMES_LIST[nextIndex] || `Mês ${nextIndex}`;
  const monthId = `${monthNameStr.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}-${nextYear.toString().slice(-2)}`;

  // Copy services structure from previous month
  const baseServices = lastMonth?.services?.map(s => ({
    vto: s.vto ? s.vto.replace(/\/\d+/, `/${nextIndex.toString().padStart(2, '0')}`) : '',
    service: s.service,
    name: s.name,
    total: s.total,
    payer: s.payer,
    rafael: s.total / 3,
    isabella: s.total / 3,
    otavio: s.total / 3,
  })) || [
    { vto: `10/${nextIndex.toString().padStart(2, '0')}`, service: 'INTERNET', name: 'INTERNET', total: 45000, payer: 'OTAVIO' },
    { vto: `12/${nextIndex.toString().padStart(2, '0')}`, service: 'EXPENSAS', name: 'EXPENSAS', total: 350000, payer: 'OTAVIO' },
    { vto: `14/${nextIndex.toString().padStart(2, '0')}`, service: 'ABL', name: 'ABL', total: 42000, payer: 'ISABELLA' },
    { vto: `16/${nextIndex.toString().padStart(2, '0')}`, service: 'GAS', name: 'GAS', total: 45000, payer: 'ISABELLA' },
    { vto: `20/${nextIndex.toString().padStart(2, '0')}`, service: 'LUZ', name: 'LUZ', total: 130000, payer: 'ISABELLA' },
    { vto: `22/${nextIndex.toString().padStart(2, '0')}`, service: 'AYSA', name: 'AYSA', total: 38000, payer: 'ISABELLA' },
  ];

  const dollarBlue = params.dollarBlue || lastMonth?.rates?.dollarBlue || 1570;
  const brlRate = params.brlRate || lastMonth?.rates?.brlRate || 300;
  const rentUsd = params.rentUsd || lastMonth?.rent?.totalUsd || 900;

  const newMonthRaw = {
    id: monthId,
    name: `${monthNameStr} ${nextYear}`,
    year: nextYear,
    monthIndex: nextIndex,
    filename: `CONTAS REP - ${monthNameStr}_${nextYear.toString().slice(-2)}.csv`,
    rent: {
      label: `ALQUILER ${rentUsd}usd`,
      totalUsd: rentUsd,
      rafaelUsd: rentUsd >= 900 ? 292 : 259,
      isabellaUsd: rentUsd >= 900 ? 292 : 259,
      otavioUsd: rentUsd >= 900 ? 316 : 282,
    },
    services: baseServices,
    rates: {
      dollarBlue,
      brlRate,
    },
  };

  const recalculated = recalculateMonth(newMonthRaw);
  all.push(recalculated);
  all.sort((a, b) => a.year !== b.year ? a.year - b.year : a.monthIndex - b.monthIndex);
  saveStoredMonths(all);
  return recalculated;
}

export async function deleteMonth(monthId) {
  const all = getStoredMonths();
  const filtered = all.filter(m => m.id !== monthId);
  saveStoredMonths(filtered);
  return filtered;
}

export async function resetAllData() {
  localStorage.removeItem(LOCAL_STORAGE_MONTHS_KEY);
  return getStoredMonths();
}

function getLocalCustomStore() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CUSTOM_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocalCustomStore(data) {
  localStorage.setItem(LOCAL_STORAGE_CUSTOM_KEY, JSON.stringify(data));
}

export async function updateMonthCustom(id, payload) {
  const store = getLocalCustomStore();
  const existing = store[id] || {};
  store[id] = {
    ...existing,
    ...payload,
    paymentStatus: { ...(existing.paymentStatus || {}), ...(payload.paymentStatus || {}) },
    consumption: { ...(existing.consumption || {}), ...(payload.consumption || {}) },
    expensasBreakdown: { ...(existing.expensasBreakdown || {}), ...(payload.expensasBreakdown || {}) },
  };
  saveLocalCustomStore(store);
  return { success: true, customData: store[id] };
}

export async function fetchBankDetails() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_BANK_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_BANK_DETAILS;
  } catch {
    return DEFAULT_BANK_DETAILS;
  }
}

export async function updateBankDetails(payload) {
  localStorage.setItem(LOCAL_STORAGE_BANK_KEY, JSON.stringify(payload));
  return { success: true, bankDetails: payload };
}

export async function uploadCSV(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const parsed = parseCSVClient(text, file.name);
        const recalculated = recalculateMonth(parsed);
        const all = getStoredMonths();
        const idx = all.findIndex(m => m.id === recalculated.id);
        if (idx !== -1) all[idx] = recalculated;
        else all.push(recalculated);
        all.sort((a, b) => a.year !== b.year ? a.year - b.year : a.monthIndex - b.monthIndex);
        saveStoredMonths(all);
        resolve({ success: true, month: recalculated });
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    reader.readAsText(file);
  });
}
