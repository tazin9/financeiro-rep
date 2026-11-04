const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { parseCSV } = require('./parser');
const { 
  getBankDetails, 
  updateBankDetails, 
  getMonthCustomData, 
  updateMonthCustomData 
} = require('./store');
const { analyzeMonthComparison } = require('./analytics');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const DADOS_DIR = path.join(__dirname, '..', 'Dados');
if (!fs.existsSync(DADOS_DIR)) {
  fs.mkdirSync(DADOS_DIR, { recursive: true });
}

// Multer storage for CSV uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, DADOS_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });

function loadAllMonths() {
  const files = fs.readdirSync(DADOS_DIR).filter(f => f.endsWith('.csv'));
  const parsedList = [];

  for (const file of files) {
    try {
      const fullPath = path.join(DADOS_DIR, file);
      const content = fs.readFileSync(fullPath, 'utf-8');
      const data = parseCSV(content, file);
      parsedList.push(data);
    } catch (err) {
      console.error(`Error parsing file ${file}:`, err);
    }
  }

  // Sort chronologically by year and monthIndex
  parsedList.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.monthIndex - b.monthIndex;
  });

  return parsedList;
}

// 1. Get all months (summary)
app.get('/api/months', (req, res) => {
  const months = loadAllMonths();
  const summary = months.map(m => {
    const custom = getMonthCustomData(m.id);
    return {
      id: m.id,
      name: m.name,
      year: m.year,
      monthIndex: m.monthIndex,
      rentUsd: m.rent.totalUsd,
      dollarBlue: m.rates.dollarBlue,
      brlRate: m.rates.brlRate,
      totalArs: m.totals.totalArs,
      totalCuentasArs: m.totals.totalCuentasArs,
      paymentStatus: custom.paymentStatus,
    };
  });
  res.json(summary);
});

// 2. Get specific month full detail
app.get('/api/months/:id', (req, res) => {
  const { id } = req.params;
  const months = loadAllMonths();
  const index = months.findIndex(m => m.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Mês não encontrado.' });
  }

  const current = months[index];
  const prev = index > 0 ? months[index - 1] : null;
  const next = index < months.length - 1 ? months[index + 1] : null;

  const currentCustom = getMonthCustomData(current.id);
  const prevCustom = prev ? getMonthCustomData(prev.id) : null;

  const analysis = analyzeMonthComparison(current, prev, currentCustom, prevCustom);

  res.json({
    month: current,
    prevMonthId: prev ? prev.id : null,
    nextMonthId: next ? next.id : null,
    customData: currentCustom,
    analysis,
  });
});

// 3. Update custom data for a month (payment status, consumption, expensas breakdown)
app.post('/api/months/:id/custom', (req, res) => {
  const { id } = req.params;
  const updated = updateMonthCustomData(id, req.body);
  res.json({ success: true, customData: updated });
});

// 4. Bank details
app.get('/api/bank-details', (req, res) => {
  res.json(getBankDetails());
});

app.put('/api/bank-details', (req, res) => {
  const updated = updateBankDetails(req.body);
  res.json({ success: true, bankDetails: updated });
});

// 5. Upload new CSV
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
  }

  try {
    const fullPath = path.join(DADOS_DIR, req.file.originalname);
    const content = fs.readFileSync(fullPath, 'utf-8');
    const parsed = parseCSV(content, req.file.originalname);
    res.json({ success: true, month: parsed });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao processar o CSV: ' + err.message });
  }
});

// 6. Annual Overview and Trends
app.get('/api/overview', (req, res) => {
  const months = loadAllMonths();
  const trends = months.map(m => {
    const custom = getMonthCustomData(m.id);
    return {
      id: m.id,
      name: m.name,
      monthIndex: m.monthIndex,
      rentUsd: m.rent.totalUsd,
      dollarBlue: m.rates.dollarBlue,
      brlRate: m.rates.brlRate,
      rentArs: m.rent.totalArs,
      cuentasArs: m.totals.totalCuentasArs,
      totalArs: m.totals.totalArs,
      services: m.services.reduce((acc, s) => {
        acc[s.service] = s.total;
        return acc;
      }, {}),
      consumption: custom.consumption || {},
      expensasBreakdown: custom.expensasBreakdown || {},
    };
  });

  res.json(trends);
});

// Serve frontend static files
const CLIENT_DIST = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(CLIENT_DIST, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n======================================================`);
  console.log(`  FINANCEIRO REP - APP WEB ATIVO`);
  console.log(`  Local: http://localhost:${PORT}`);
  console.log(`  Rede Local (Wi-Fi Moradores): http://0.0.0.0:${PORT}`);
  console.log(`======================================================\n`);
});
