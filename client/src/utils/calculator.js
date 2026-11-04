export function recalculateMonth(month) {
  const dollarBlue = parseFloat(month.rates?.dollarBlue) || 1500;
  const brlRate = parseFloat(month.rates?.brlRate) || 300;

  // 1. Recalculate Services
  const updatedServices = (month.services || []).map(s => {
    const total = parseFloat(s.total) || 0;
    const share = total / 3;
    return {
      ...s,
      total,
      rafael: share,
      isabella: share,
      otavio: share,
    };
  });

  const otavioPaidServices = updatedServices
    .filter(s => s.payer === 'OTAVIO')
    .reduce((acc, s) => acc + s.total, 0);

  const isaPaidServices = updatedServices
    .filter(s => s.payer === 'ISABELLA')
    .reduce((acc, s) => acc + s.total, 0);

  const totalCuentasArs = otavioPaidServices + isaPaidServices;
  const otavioSharePerPerson = otavioPaidServices / 3;
  const isaSharePerPerson = isaPaidServices / 3;

  // 2. Recalculate Rent
  const rent = { ...(month.rent || {}) };
  const totalUsd = parseFloat(rent.totalUsd) || 800;
  const rafaelUsd = parseFloat(rent.rafaelUsd) || (totalUsd >= 900 ? 292 : 259);
  const isabellaUsd = parseFloat(rent.isabellaUsd) || (totalUsd >= 900 ? 292 : 259);
  const otavioUsd = parseFloat(rent.otavioUsd) || (totalUsd - rafaelUsd - isabellaUsd);

  rent.totalUsd = totalUsd;
  rent.rafaelUsd = rafaelUsd;
  rent.isabellaUsd = isabellaUsd;
  rent.otavioUsd = otavioUsd;

  rent.totalArs = totalUsd * dollarBlue;
  rent.rafaelArs = rafaelUsd * dollarBlue;
  rent.isabellaArs = isabellaUsd * dollarBlue;
  rent.otavioArs = otavioUsd * dollarBlue;

  // 3. Totals
  const totalArs = rent.totalArs + totalCuentasArs;
  const totalBrl = brlRate > 0 ? (totalArs / brlRate) : 0;

  // 4. Rafael Settlement
  const rafaelTransfers = {
    toOtavio: otavioSharePerPerson,
    toIsa: isaSharePerPerson,
    totalBills: otavioSharePerPerson + isaSharePerPerson,
    rentUsd: rent.rafaelUsd,
  };

  // 5. Net Settlement Otavio & Isa
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
    ...month,
    rent,
    services: updatedServices,
    rates: {
      ...month.rates,
      dollarBlue,
      brlRate,
    },
    totals: {
      totalCuentasArs,
      totalArs,
      totalBrl,
      otavioPaidServices,
      isaPaidServices,
    },
    settlement: {
      rafael: rafaelTransfers,
      netOtavioIsa: netTransfer,
      grossOtavioPaidPerPerson: otavioSharePerPerson,
      grossIsaPaidPerPerson: isaSharePerPerson,
      isabellaRentUsd: rent.isabellaUsd,
      otavioRentUsd: rent.otavioRentUsd,
    }
  };
}
