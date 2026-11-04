const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

const DEFAULT_STORE = {
  bankDetails: {
    otavio: {
      name: 'Otávio',
      bank: 'Mercado Pago / Santander',
      alias: 'otavio.cbu.alias',
      cbu: '0000003100012345678901',
      holder: 'Otavio',
      cuitCuil: '',
    },
    isabella: {
      name: 'Isabella',
      bank: 'Brubank / Galicia',
      alias: 'isa.cbu.alias',
      cbu: '0000003100098765432101',
      holder: 'Isabella',
      cuitCuil: '',
    }
  },
  monthsData: {}, // keyed by month id, e.g. "janeiro-26"
};

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(STORE_FILE)) {
    fs.writeFileSync(STORE_FILE, JSON.stringify(DEFAULT_STORE, null, 2), 'utf-8');
  }
}

function getStore() {
  ensureStore();
  try {
    const raw = fs.readFileSync(STORE_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading store.json, returning default:', err);
    return DEFAULT_STORE;
  }
}

function saveStore(data) {
  ensureStore();
  fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function getBankDetails() {
  const store = getStore();
  return store.bankDetails || DEFAULT_STORE.bankDetails;
}

function updateBankDetails(details) {
  const store = getStore();
  store.bankDetails = {
    ...store.bankDetails,
    ...details,
  };
  saveStore(store);
  return store.bankDetails;
}

function getMonthCustomData(monthId) {
  const store = getStore();
  return store.monthsData[monthId] || {
    paymentStatus: {
      rentRafael: false,
      rentIsa: false,
      billsRafaelToOtavio: false,
      billsRafaelToIsa: false,
      billsNetIsaOtavio: false,
    },
    consumption: {
      luz: { kwh: null, notes: '' },
      gas: { m3: null, notes: '' },
      aysa: { m3: null, notes: '' },
    },
    expensasBreakdown: {
      expensasA: null,
      fundoDeCaja: null,
      gastosParticulares: null,
      interesesPunitorios: null,
      redondeo: null,
      notes: '',
    },
    userNotes: '',
  };
}

function updateMonthCustomData(monthId, updateObj) {
  const store = getStore();
  if (!store.monthsData) store.monthsData = {};
  
  const existing = store.monthsData[monthId] || getMonthCustomData(monthId);
  store.monthsData[monthId] = {
    ...existing,
    ...updateObj,
    paymentStatus: {
      ...existing.paymentStatus,
      ...(updateObj.paymentStatus || {})
    },
    consumption: {
      ...existing.consumption,
      ...(updateObj.consumption || {})
    },
    expensasBreakdown: {
      ...existing.expensasBreakdown,
      ...(updateObj.expensasBreakdown || {})
    }
  };

  saveStore(store);
  return store.monthsData[monthId];
}

module.exports = {
  getStore,
  saveStore,
  getBankDetails,
  updateBankDetails,
  getMonthCustomData,
  updateMonthCustomData,
};
