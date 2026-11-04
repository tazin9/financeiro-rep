import initialMonthsData from './data/initialMonths.json';
import { parseCSVClient } from './utils/csvParser';

const API_BASE = '/api';

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

function getLocalCustomStore() {
  try {
    const raw = localStorage.getItem('rep_months_custom');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocalCustomStore(data) {
  localStorage.setItem('rep_months_custom', JSON.stringify(data));
}

function getLocalUploadedMonths() {
  try {
    const raw = localStorage.getItem('rep_uploaded_months');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function getAllClientMonths() {
  const uploaded = getLocalUploadedMonths();
  const all = [...initialMonthsData];
  for (const u of uploaded) {
    const idx = all.findIndex(m => m.id === u.id);
    if (idx !== -1) all[idx] = u;
    else all.push(u);
  }
  all.sort((a, b) => a.year !== b.year ? a.year - b.year : a.monthIndex - b.monthIndex);
  return all;
}

export async function fetchMonths() {
  try {
    const res = await fetch(`${API_BASE}/months`);
    if (res.ok) return await res.json();
  } catch (err) {
    // fallback to client static data
  }

  const all = getAllClientMonths();
  const store = getLocalCustomStore();
  return all.map(m => ({
    id: m.id,
    name: m.name,
    year: m.year,
    monthIndex: m.monthIndex,
    rentUsd: m.rent.totalUsd,
    dollarBlue: m.rates.dollarBlue,
    brlRate: m.rates.brlRate,
    totalArs: m.totals.totalArs,
    totalCuentasArs: m.totals.totalCuentasArs,
    paymentStatus: store[m.id]?.paymentStatus || null,
  }));
}

export async function fetchMonthDetail(id) {
  try {
    const res = await fetch(`${API_BASE}/months/${id}`);
    if (res.ok) return await res.json();
  } catch (err) {
    // fallback
  }

  const all = getAllClientMonths();
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
    analysis: null,
  };
}

export async function updateMonthCustom(id, payload) {
  try {
    const res = await fetch(`${API_BASE}/months/${id}/custom`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) return await res.json();
  } catch (err) {
    // fallback
  }

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
    const res = await fetch(`${API_BASE}/bank-details`);
    if (res.ok) return await res.json();
  } catch (err) {
    // fallback
  }

  const raw = localStorage.getItem('rep_bank_details');
  return raw ? JSON.parse(raw) : DEFAULT_BANK_DETAILS;
}

export async function updateBankDetails(payload) {
  try {
    const res = await fetch(`${API_BASE}/bank-details`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) return await res.json();
  } catch (err) {
    // fallback
  }

  localStorage.setItem('rep_bank_details', JSON.stringify(payload));
  return { success: true, bankDetails: payload };
}

export async function uploadCSV(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData,
    });
    if (res.ok) return await res.json();
  } catch (err) {
    // fallback
  }

  // Client-side parse
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const parsed = parseCSVClient(text, file.name);
        const uploaded = getLocalUploadedMonths();
        uploaded.push(parsed);
        localStorage.setItem('rep_uploaded_months', JSON.stringify(uploaded));
        resolve({ success: true, month: parsed });
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    reader.readAsText(file);
  });
}
