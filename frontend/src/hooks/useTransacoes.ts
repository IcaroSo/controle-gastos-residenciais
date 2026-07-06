import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api';
import type { CriarTransacaoRequest, Pessoa, Transacao } from '../types/api';
import { getErrorMessage } from '../utils/formatters';

export function useTransacoes() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [pessoasResult, transacoesResult] = await Promise.all([
        api.listarPessoas(),
        api.listarTransacoes(),
      ]);
      setPessoas(pessoasResult);
      setTransacoes(transacoesResult);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const criar = useCallback(
    async (payload: CriarTransacaoRequest): Promise<boolean> => {
      setSaving(true);
      setError(null);
      setSuccess(null);

      try {
        await api.criarTransacao(payload);
        setSuccess('Transacao cadastrada.');
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

  return { pessoas, transacoes, loading, saving, error, success, carregar, criar };
}
