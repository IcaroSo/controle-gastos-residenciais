import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api';
import type { CriarPessoaRequest, Pessoa } from '../types/api';
import { getErrorMessage } from '../utils/formatters';

export function usePessoas() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setPessoas(await api.listarPessoas());
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const criar = useCallback(
    async (payload: CriarPessoaRequest): Promise<boolean> => {
      setSaving(true);
      setError(null);
      setSuccess(null);

      try {
        await api.criarPessoa(payload);
        setSuccess('Pessoa cadastrada.');
        await carregar();
        return true;
      } catch (err) {
        setError(getErrorMessage(err));
        return false;
      } finally {
        setSaving(false);
      }
    },
    [carregar],
  );

  const excluir = useCallback(
    async (id: string): Promise<boolean> => {
      setSaving(true);
      setError(null);
      setSuccess(null);

      try {
        await api.excluirPessoa(id);
        setSuccess('Pessoa excluída.');
        await carregar();
        return true;
      } catch (err) {
        setError(getErrorMessage(err));
        return false;
      } finally {
        setSaving(false);
      }
    },
    [carregar],
  );

  useEffect(() => {
    void carregar();
  }, [carregar]);

  return { pessoas, loading, saving, error, success, carregar, criar, excluir };
}
