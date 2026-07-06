export const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const currencyInputFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

export function formatCurrencyInput(value: string): string {
  const digits = value.replace(/\D/g, '');

  if (!digits) {
    return '';
  }

  return currencyInputFormatter.format(Number(digits) / 100);
}

export function parseCurrencyInput(value: string): number {
  const digits = value.replace(/\D/g, '');

  if (!digits) {
    return Number.NaN;
  }

  return Number(digits) / 100;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Nao foi possivel concluir a acao.';
}