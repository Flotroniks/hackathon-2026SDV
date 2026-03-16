export function formatKg(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return 'N/A';
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(2)} tCO2e`;
  }

  return `${value.toFixed(1)} kgCO2e`;
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) {
    return 'N/A';
  }

  return new Date(value).toLocaleString();
}

export function formatNumber(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return 'N/A';
  }

  return Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value);
}
