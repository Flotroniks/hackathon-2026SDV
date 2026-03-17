import i18n from '../i18n';

function getLocale() {
  return i18n.language.startsWith('fr') ? 'fr-FR' : 'en-US';
}

function t(key: string, fallback: string) {
  const translated = i18n.t(key);
  return translated === key ? fallback : translated;
}

export function formatKg(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return t('common.na', 'N/A');
  }

  if (value >= 1000) {
    const amount = Intl.NumberFormat(getLocale(), {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 1000);
    return `${amount} ${t('common.units.tco2e', 'tCO2e')}`;
  }

  const amount = Intl.NumberFormat(getLocale(), {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
  return `${amount} ${t('common.units.kgco2e', 'kgCO2e')}`;
}

export function formatKgCo2e(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return t('common.na', 'N/A');
  }
  return `${formatNumber(value)} ${t('common.units.kgco2e', 'kgCO2e')}`;
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) {
    return t('common.na', 'N/A');
  }

  return new Date(value).toLocaleString(getLocale());
}

export function formatNumber(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return t('common.na', 'N/A');
  }

  return Intl.NumberFormat(getLocale(), { maximumFractionDigits: 2 }).format(value);
}
