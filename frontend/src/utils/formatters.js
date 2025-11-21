export function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString();
}

export function formatCurrency(amount, locale = 'en-US', currency = 'USD') {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}
