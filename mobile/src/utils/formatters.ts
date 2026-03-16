export function formatKg(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return 'N/A';
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(2)} tCO2e`;
  }
  return `${value.toFixed(1)} kgCO2e`;
}
