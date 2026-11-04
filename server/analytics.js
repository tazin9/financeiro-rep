function analyzeMonthComparison(currentMonth, prevMonth, currentCustom, prevCustom) {
  if (!currentMonth) return null;

  const comparison = {
    currentName: currentMonth.name,
    prevName: prevMonth ? prevMonth.name : null,
    services: {},
    expensas: null,
    rent: null,
    summaryInsights: [],
  };

  // 1. Rent Comparison
  if (prevMonth) {
    const usdDelta = currentMonth.rent.totalUsd - prevMonth.rent.totalUsd;
    const arsDelta = currentMonth.rent.totalArs - prevMonth.rent.totalArs;
    const arsPercent = prevMonth.rent.totalArs > 0 ? (arsDelta / prevMonth.rent.totalArs) * 100 : 0;
    const dollarDelta = currentMonth.rates.dollarBlue - prevMonth.rates.dollarBlue;
    const dollarPercent = prevMonth.rates.dollarBlue > 0 ? (dollarDelta / prevMonth.rates.dollarBlue) * 100 : 0;

    comparison.rent = {
      prevUsd: prevMonth.rent.totalUsd,
      currentUsd: currentMonth.rent.totalUsd,
      usdDelta,
      prevArs: prevMonth.rent.totalArs,
      currentArs: currentMonth.rent.totalArs,
      arsDelta,
      arsPercent,
      prevDollarRate: prevMonth.rates.dollarBlue,
      currentDollarRate: currentMonth.rates.dollarBlue,
      dollarDelta,
      dollarPercent,
      insight: usdDelta !== 0
        ? `Renovação de contrato: Aluguel aumentou de US$ ${prevMonth.rent.totalUsd} para US$ ${currentMonth.rent.totalUsd} (+US$ ${usdDelta}).`
        : `Valor fixo em US$ ${currentMonth.rent.totalUsd}. Variação em pesos (${arsPercent >= 0 ? '+' : ''}${arsPercent.toFixed(1)}%) exclusivamente decorrente da cotação do Dólar Blue (${prevMonth.rates.dollarBlue} -> ${currentMonth.rates.dollarBlue}).`,
    };
  }

  // 2. Services Comparison
  const currentServicesMap = {};
  currentMonth.services.forEach(s => { currentServicesMap[s.service] = s; });

  const prevServicesMap = {};
  if (prevMonth) {
    prevMonth.services.forEach(s => { prevServicesMap[s.service] = s; });
  }

  const allServiceKeys = ['INTERNET', 'EXPENSAS', 'ABL', 'GAS', 'LUZ', 'AYSA'];

  allServiceKeys.forEach(serviceKey => {
    const curr = currentServicesMap[serviceKey];
    const prev = prevServicesMap[serviceKey];
    if (!curr) return;

    const currTotal = curr.total;
    const prevTotal = prev ? prev.total : 0;
    const deltaAmount = prev ? (currTotal - prevTotal) : 0;
    const deltaPercent = prevTotal > 0 ? (deltaAmount / prevTotal) * 100 : 0;

    const servAnalysis = {
      service: serviceKey,
      currTotal,
      prevTotal,
      deltaAmount,
      deltaPercent,
      type: (serviceKey === 'INTERNET' || serviceKey === 'ABL') ? 'fixed_service' : 'variable_consumption',
      hasConsumption: false,
      insight: '',
    };

    // Services without consumption (Internet, ABL) -> 100% inflation/tariffs
    if (serviceKey === 'INTERNET' || serviceKey === 'ABL') {
      if (!prev) {
        servAnalysis.insight = 'Primeiro registro disponível.';
      } else if (deltaAmount === 0) {
        servAnalysis.insight = 'Sem alteração de valor em relação ao mês anterior.';
      } else {
        const sign = deltaAmount > 0 ? '+' : '';
        servAnalysis.insight = `Variação de ${sign}${deltaPercent.toFixed(1)}% (${sign}$ ${Math.round(deltaAmount).toLocaleString('es-AR')}) atribuída 100% a reajuste tarifário / inflação.`;
      }
    } else if (serviceKey === 'LUZ' || serviceKey === 'GAS' || serviceKey === 'AYSA') {
      // Consumption services
      const metricKey = serviceKey === 'LUZ' ? 'luz' : (serviceKey === 'GAS' ? 'gas' : 'aysa');
      const unit = serviceKey === 'LUZ' ? 'kWh' : 'm³';
      
      const currCons = currentCustom && currentCustom.consumption && currentCustom.consumption[metricKey] ? currentCustom.consumption[metricKey].kwh || currentCustom.consumption[metricKey].m3 : null;
      const prevCons = prevCustom && prevCustom.consumption && prevCustom.consumption[metricKey] ? prevCustom.consumption[metricKey].kwh || prevCustom.consumption[metricKey].m3 : null;

      if (currCons && prevCons && prevCons > 0) {
        servAnalysis.hasConsumption = true;
        const consDelta = currCons - prevCons;
        const consPercent = (consDelta / prevCons) * 100;

        const currUnitPrice = currTotal / currCons;
        const prevUnitPrice = prevTotal / prevCons;
        const priceDelta = currUnitPrice - prevUnitPrice;
        const pricePercent = (priceDelta / prevUnitPrice) * 100;

        servAnalysis.consumption = {
          unit,
          currCons,
          prevCons,
          consDelta,
          consPercent,
          currUnitPrice,
          prevUnitPrice,
          priceDelta,
          pricePercent,
        };

        const consSign = consDelta >= 0 ? '+' : '';
        const priceSign = priceDelta >= 0 ? '+' : '';

        if (Math.abs(consPercent) > Math.abs(pricePercent)) {
          servAnalysis.insight = `Variação puxada principalmente pelo consumo (${consSign}${consPercent.toFixed(1)}% ${unit}). A tarifa unitária variou ${priceSign}${pricePercent.toFixed(1)}% ($/${unit}).`;
        } else {
          servAnalysis.insight = `Variação puxada principalmente pelo aumento tarifário (${priceSign}${pricePercent.toFixed(1)}% $/ ${unit}). O consumo físico variou ${consSign}${consPercent.toFixed(1)}% ${unit}.`;
        }
      } else {
        const sign = deltaAmount >= 0 ? '+' : '';
        servAnalysis.insight = prev 
          ? `Total variou ${sign}${deltaPercent.toFixed(1)}%. Adicione os ${unit} consumidos para separar o que foi inflação/tarifa do que foi gasto real da casa.`
          : 'Primeiro registro disponível.';
      }
    }

    comparison.services[serviceKey] = servAnalysis;
  });

  // 3. Expensas Detailed Breakdown Comparison
  const currExp = currentCustom && currentCustom.expensasBreakdown ? currentCustom.expensasBreakdown : {};
  const prevExp = prevCustom && prevCustom.expensasBreakdown ? prevCustom.expensasBreakdown : {};

  const expTotalCurr = currentServicesMap['EXPENSAS'] ? currentServicesMap['EXPENSAS'].total : 0;
  const expTotalPrev = prevServicesMap['EXPENSAS'] ? prevServicesMap['EXPENSAS'].total : 0;
  const expDelta = expTotalCurr - expTotalPrev;

  const items = [
    { key: 'expensasA', label: 'Expensas A (Ordinarias)', curr: currExp.expensasA || 0, prev: prevExp.expensasA || 0 },
    { key: 'fundoDeCaja', label: 'Fundo de Reserva / Caja', curr: currExp.fundoDeCaja || 0, prev: prevExp.fundoDeCaja || 0 },
    { key: 'gastosParticulares', label: 'Gastos Particulares', curr: currExp.gastosParticulares || 0, prev: prevExp.gastosParticulares || 0 },
    { key: 'interesesPunitorios', label: 'Interesses Punitorios', curr: currExp.interesesPunitorios || 0, prev: prevExp.interesesPunitorios || 0 },
    { key: 'redondeo', label: 'Redondeo / Ajustes', curr: currExp.redondeo || 0, prev: prevExp.redondeo || 0 },
  ];

  const breakdownWithDelta = items.map(item => ({
    ...item,
    delta: item.curr - item.prev,
  }));

  // Identify highest driver if breakdown is entered
  const drivers = breakdownWithDelta.filter(i => Math.abs(i.delta) > 0).sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
  let expensasInsight = '';
  if (drivers.length > 0) {
    const top = drivers[0];
    const topSign = top.delta > 0 ? '+' : '';
    expensasInsight = `O principal fator de mudança nas expensas foi "${top.label}" (${topSign}$ ${Math.round(top.delta).toLocaleString('es-AR')}).`;
  } else if (prevMonth && expTotalPrev > 0) {
    const sign = expDelta >= 0 ? '+' : '';
    const pct = ((expDelta / expTotalPrev) * 100).toFixed(1);
    expensasInsight = `As expensas variaram ${sign}${pct}% (${sign}$ ${Math.round(expDelta).toLocaleString('es-AR')}). Preencha os subitens da fatura (Expensas A, Fundo de Caja, etc.) para ver os motivos exatos.`;
  }

  comparison.expensas = {
    totalCurr: expTotalCurr,
    totalPrev: expTotalPrev,
    delta: expDelta,
    breakdown: breakdownWithDelta,
    insight: expensasInsight,
  };

  return comparison;
}

module.exports = { analyzeMonthComparison };
