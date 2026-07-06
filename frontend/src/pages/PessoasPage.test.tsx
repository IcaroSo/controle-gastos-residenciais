import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usePessoas } from '../hooks/usePessoas';
import { PessoasPage } from './PessoasPage';

vi.mock('../hooks/usePessoas', () => ({
  usePessoas: vi.fn(),
}));

const mockedUsePessoas = vi.mocked(usePessoas);

describe('PessoasPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('confirma exclusao em modal informando cascade antes de chamar a API', async () => {
    const excluir = vi.fn().mockResolvedValue(true);
    mockedUsePessoas.mockReturnValue({
      pessoas: [{ id: 'pessoa-1', nome: 'Maria', idade: 30 }],
      loading: false,
      saving: false,
      error: null,
      success: null,
      carregar: vi.fn(),
      criar: vi.fn(),
      excluir,
    });

    render(<PessoasPage />);
    await userEvent.click(screen.getByTitle('Excluir Maria'));

    expect(screen.getByRole('dialog', { name: 'Excluir pessoa' })).toBeInTheDocument();
    const dialog = screen.getByRole('dialog', { name: 'Excluir pessoa' });
    expect(within(dialog).getByText('Maria')).toBeInTheDocument();
    expect(
      screen.getByText('Ao confirmar, esta pessoa e todas as transações vinculadas a ela serão removidas.'),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Excluir pessoa' }));

    expect(excluir).toHaveBeenCalledWith('pessoa-1');
  });

  it('nao exclui pessoa quando o modal e cancelado', async () => {
    const excluir = vi.fn().mockResolvedValue(true);
    mockedUsePessoas.mockReturnValue({
      pessoas: [{ id: 'pessoa-1', nome: 'Maria', idade: 30 }],
      loading: false,
      saving: false,
      error: null,
      success: null,
      carregar: vi.fn(),
      criar: vi.fn(),
      excluir,
    });

    render(<PessoasPage />);
    await userEvent.click(screen.getByTitle('Excluir Maria'));
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(excluir).not.toHaveBeenCalled();
    expect(screen.queryByRole('dialog', { name: 'Excluir pessoa' })).not.toBeInTheDocument();
  });

  it('mantem campos preenchidos quando a API rejeita a pessoa', async () => {
    const criar = vi.fn().mockResolvedValue(false);
    mockedUsePessoas.mockReturnValue({
      pessoas: [],
      loading: false,
      saving: false,
      error: 'Nome invalido.',
      success: null,
      carregar: vi.fn(),
      criar,
      excluir: vi.fn(),
    });

    render(<PessoasPage />);
    await userEvent.type(screen.getByLabelText('Nome'), 'A');
    await userEvent.type(screen.getByLabelText('Idade'), '30');
    await userEvent.click(screen.getByRole('button', { name: /salvar/i }));

    expect(criar).toHaveBeenCalledWith({ nome: 'A', idade: 30 });
    expect(screen.getByLabelText('Nome')).toHaveValue('A');
    expect(screen.getByLabelText('Idade')).toHaveValue(30);
  });
});

