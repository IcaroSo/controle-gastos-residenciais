import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useTransacoes } from '../hooks/useTransacoes';
import { TransacoesPage } from './TransacoesPage';

vi.mock('../hooks/useTransacoes', () => ({
  useTransacoes: vi.fn(),
}));

const mockedUseTransacoes = vi.mocked(useTransacoes);

describe('TransacoesPage', () => {
  beforeEach(() => {
    mockedUseTransacoes.mockReturnValue({
      pessoas: [{ id: 'pessoa-1', nome: 'Ana', idade: 17 }],
      transacoes: [],
      loading: false,
      saving: false,
      error: null,
      success: null,
      carregar: vi.fn(),
      criar: vi.fn(),
    });
  });

  it('desabilita receita quando a pessoa selecionada e menor de idade', () => {
    render(<TransacoesPage />);

    expect(screen.getByLabelText('Receita')).toBeDisabled();
    expect(screen.getByText('Pessoas menores de 18 anos podem possuir apenas despesas.')).toBeInTheDocument();
  });
});
