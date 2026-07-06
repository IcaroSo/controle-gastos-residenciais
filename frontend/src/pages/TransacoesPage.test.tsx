import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it('mantem campos preenchidos quando a API rejeita a transacao', async () => {
    const criar = vi.fn().mockResolvedValue(false);
    mockedUseTransacoes.mockReturnValue({
      pessoas: [{ id: 'pessoa-1', nome: 'Ana', idade: 18 }],
      transacoes: [],
      loading: false,
      saving: false,
      error: 'Valor invalido.',
      success: null,
      carregar: vi.fn(),
      criar,
    });

    render(<TransacoesPage />);
    await userEvent.type(screen.getByLabelText('Descrição'), 'Mercado');
    await userEvent.type(screen.getByLabelText('Valor'), '1234');
    await userEvent.click(screen.getByLabelText('Receita'));
    await userEvent.click(screen.getByRole('button', { name: /salvar/i }));

    expect(criar).toHaveBeenCalledWith({
      pessoaId: 'pessoa-1',
      descricao: 'Mercado',
      valor: 12.34,
      tipo: 'Receita',
    });
    expect(screen.getByLabelText('Descrição')).toHaveValue('Mercado');
    expect(screen.getByLabelText('Valor')).toHaveValue('12,34');
    expect(screen.getByLabelText('Receita')).toBeChecked();
  });
  it('formata o valor com separador de milhar enquanto digita', async () => {
    const criar = vi.fn().mockResolvedValue(false);
    mockedUseTransacoes.mockReturnValue({
      pessoas: [{ id: 'pessoa-1', nome: 'Ana', idade: 18 }],
      transacoes: [],
      loading: false,
      saving: false,
      error: null,
      success: null,
      carregar: vi.fn(),
      criar,
    });

    render(<TransacoesPage />);
    await userEvent.type(screen.getByLabelText('Descrição'), 'Aluguel');
    await userEvent.type(screen.getByLabelText('Valor'), '123456');
    await userEvent.click(screen.getByRole('button', { name: /salvar/i }));

    expect(screen.getByLabelText('Valor')).toHaveValue('1.234,56');
    expect(criar).toHaveBeenCalledWith({
      pessoaId: 'pessoa-1',
      descricao: 'Aluguel',
      valor: 1234.56,
      tipo: 'Despesa',
    });
  });
});
