function cleanNumber(str) {
  if (!str) return 0;
  let cleaned = str.replace(/[R$\s"']/g, '').trim();
  if (!cleaned) return 0;
  cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

const MONTH_NAMES = {
  'janeiro': { name: 'Janeiro', index: 1 },
  'fevereiro': { name: 'Fevereiro', index: 2 },
  'março': { name: 'Março', index: 3 },
  'marco': { name: 'Março', index: 3 },
  'abril': { name: 'Abril', index: 4 },
  'maio': { name: 'Maio', index: 5 },
  'junho': { name: 'Junho', index: 6 },
  'julho': { name: 'Julho', index: 7 },
  'agosto': { name: 'Agosto', index: 8 },
  'setembro': { name: 'Setembro', index: 9 },
  'outubro': { name: 'Outubro', index: 10 },
  'novembro': { name: 'Novembro', index: 11 },
  'dezembro': { name: 'Dezembro', index: 12 },
};

export function parseCSVClient(content, filename) {
  const lines = content.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  
  const match = filename.match(/CONTAS REP -\s*([A-Za-zçÇ]+)_(\d+)/i);
  let monthKey = filename.replace('.csv', '').toLowerCase();
  let monthName = filename;
  let monthIndex = 0;
  let year = 2026;

  if (match) {
    const rawMonth = match[1].toLowerCase();
    const yr = '20' + match[2];
    year = parseInt(yr, 10);
    const mInfo = MONTH_NAMES[rawMonth] || { name: match[1], index: 99 };
    monthName = `${mInfo.name} ${year}`;
    monthIndex = mInfo.index;
    monthKey = `${rawMonth}-${match[2]}`;
  }

  const parsedRows = lines.map(line => {
    const row = [];
    let insideQuote = false;
    let entry = '';
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        insideQuote = !insideQuote;
      } else if (char === ',' && !insideQuote) {
        row.push(entry.trim());
        entry = '';
      } else {
        entry += char;
      }
    }
    row.push(entry.trim());
    return row;
  });

  let rent = {
    label: 'ALQUILER',
    totalUsd: 800,
    totalArs: 0,
    rafaelArs: 0,
    isabellaArs: 0,
    otavioArs: 0,
    rafaelUsd: 259,
    isabellaUsd: 259,
    otavioUsd: 282,
  };

  const services = [];
  let dollarBlue = 1450;
  let brlRate = 275;
  let totalCuentasArs = 0;
  let totalArs = 0;
  let totalBrl = 0;

  for (const row of parsedRows) {
    const col1 = (row[1] || '').toUpperCase();

    if (col1.includes('ALQUILER')) {
      rent.label = row[1];
      rent.totalArs = cleanNumber(row[2]);
      rent.rafaelArs = cleanNumber(row[3]);
      rent.isabellaArs = cleanNumber(row[4]);
      rent.otavioArs = cleanNumber(row[5]);

      if (col1.includes('900')) {
        rent.totalUsd = 900;
        rent.rafaelUsd = 292;
        rent.isabellaUsd = 292;
        rent.otavioUsd = 316;
      } else {
        rent.totalUsd = 800;
        rent.rafaelUsd = 259;
        rent.isabellaUsd = 259;
        rent.otavioUsd = 282;
      }
    }

    for (let c = 0; c < row.length; c++) {
      if ((row[c] || '').toUpperCase().includes('COTACAO') || (row[c] || '').toUpperCase().includes('COTAÇÃO')) {
        const nextVal = cleanNumber(row[c + 1]);
        if (nextVal > 0) brlRate = nextVal;
      }
    }

    if (col1.includes('PREÇO DÓLAR FINAL') || col1.includes('PREÇO DOLAR FINAL') || col1.includes('PRECO DOLAR')) {
      const val = cleanNumber(row[2]);
      if (val > 0) dollarBlue = val;
    }

    if (col1.includes('TOTAL CUENTAS')) {
      totalCuentasArs = cleanNumber(row[2]);
    }

    if (col1.includes('TOTAL (AR$)')) {
      totalArs = cleanNumber(row[2]);
    }

    if (col1.includes('TOTAL (R$)')) {
      totalBrl = cleanNumber(row[2]);
    }

    const knownServices = ['INTERNET', 'EXPENSAS', 'ABL', 'GAS', 'LUZ', 'AYSA'];
    for (const s of knownServices) {
      if (col1 === s || col1.startsWith(s + ' ') || col1.endsWith(' ' + s)) {
        const vto = row[0] || '';
        const total = cleanNumber(row[2]);
        const rafael = cleanNumber(row[3]);
        const isabella = cleanNumber(row[4]);
        const otavio = cleanNumber(row[5]);
        const payer = (s === 'INTERNET' || s === 'EXPENSAS') ? 'OTAVIO' : 'ISABELLA';

        services.push({
          vto,
          service: s,
          name: row[1],
          total,
          rafael,
          isabella,
          otavio,
          payer,
        });
      }
    }
  }

  if (dollarBlue > 0 && rent.totalArs > 0) {
    const calculatedTotalUsd = Math.round(rent.totalArs / dollarBlue);
    if (Math.abs(calculatedTotalUsd - 900) < 20) {
      rent.totalUsd = 900;
      rent.rafaelUsd = 292;
      rent.isabellaUsd = 292;
      rent.otavioUsd = 316;
    } else if (Math.abs(calculatedTotalUsd - 800) < 20) {
      rent.totalUsd = 800;
      rent.rafaelUsd = 259;
      rent.isabellaUsd = 259;
      rent.otavioUsd = 282;
    }
  }

  const otavioPaidServices = services.filter(s => s.payer === 'OTAVIO').reduce((acc, s) => acc + s.total, 0);
  const isaPaidServices = services.filter(s => s.payer === 'ISABELLA').reduce((acc, s) => acc + s.total, 0);

  const otavioSharePerPerson = otavioPaidServices / 3;
  const isaSharePerPerson = isaPaidServices / 3;

  const rafaelTransfers = {
    toOtavio: otavioSharePerPerson,
    toIsa: isaSharePerPerson,
    totalBills: otavioSharePerPerson + isaSharePerPerson,
    rentUsd: rent.rafaelUsd,
  };

  let netTransfer = null;
  if (otavioSharePerPerson > isaSharePerPerson) {
    netTransfer = {
      from: 'ISABELLA',
      to: 'OTAVIO',
      amount: otavioSharePerPerson - isaSharePerPerson,
      reason: 'Otávio adiantou mais em serviços que Isa',
    };
  } else if (isaSharePerPerson > otavioSharePerPerson) {
    netTransfer = {
      from: 'OTAVIO',
      to: 'ISABELLA',
      amount: isaSharePerPerson - otavioSharePerPerson,
      reason: 'Isa adiantou mais em serviços que Otávio',
    };
  } else {
    netTransfer = {
      from: 'NONE',
      to: 'NONE',
      amount: 0,
      reason: 'Valores iguais',
    };
  }

  return {
    id: monthKey,
    name: monthName,
    year,
    monthIndex,
    filename,
    rent,
    services,
    totals: {
      totalCuentasArs: totalCuentasArs || (otavioPaidServices + isaPaidServices),
      totalArs: totalArs || (rent.totalArs + otavioPaidServices + isaPaidServices),
      totalBrl: totalBrl || (brlRate > 0 ? (totalArs / brlRate) : 0),
      otavioPaidServices,
      isaPaidServices,
    },
    rates: {
      dollarBlue,
      brlRate,
    },
    settlement: {
      rafael: rafaelTransfers,
      netOtavioIsa: netTransfer,
      grossOtavioPaidPerPerson: otavioSharePerPerson,
      grossIsaPaidPerPerson: isaSharePerPerson,
      isabellaRentUsd: rent.isabellaUsd,
      otavioRentUsd: rent.otavioUsd,
    }
  };
}
