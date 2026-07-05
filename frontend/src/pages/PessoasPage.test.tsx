import { render, screen } from '@testing-library/react';
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

  it('confirma exclusao informando cascade antes de chamar a API', async () => {
    const excluir = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(window, 'confirm').mockReturnValue(true);
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

    expect(window.confirm).toHaveBeenCalledWith(
      'Excluir Maria? Todas as transacoes vinculadas tambem serao removidas.',
    );
    expect(excluir).toHaveBeenCalledWith('pessoa-1');
  });
});
