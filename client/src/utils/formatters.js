export function formatCurrency(amount, currency = 'ARS') {
  if (amount === undefined || amount === null || isNaN(amount)) return '$ 0';
  
  if (currency === 'USD') {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount).replace('USD', 'US$');
  }

  if (currency === 'BRL') {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  // Default ARS
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount).replace('ARS', '$');
}

export function convertAmount(arsAmount, targetCurrency, dollarRate, brlRate) {
  if (!arsAmount || arsAmount <= 0) return 0;
  if (targetCurrency === 'ARS') return arsAmount;
  if (targetCurrency === 'USD') {
    return dollarRate > 0 ? (arsAmount / dollarRate) : 0;
  }
  if (targetCurrency === 'BRL') {
    return brlRate > 0 ? (arsAmount / brlRate) : 0;
  }
  return arsAmount;
}
