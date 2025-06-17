import { countryCurrencyList } from './currencyList';

export const getCurrencyByCountry = (country: string) => {
  const currencyInfo = countryCurrencyList.find(c => c.country === country);
  return {
    currencyCode: currencyInfo?.currencyCode || 'USD',
    currencySymbol: currencyInfo?.currencySymbol || '$',
    precision: currencyInfo?.precision || 100
  };
};

export const formatAmount = (amount: number, currencyCode: string) => {
  const currencyInfo = countryCurrencyList.find(c => c.currencyCode === currencyCode);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount / (currencyInfo?.precision || 100));
};