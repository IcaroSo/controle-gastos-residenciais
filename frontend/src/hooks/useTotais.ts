import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Totais } from '../types/api';
import { getErrorMessage } from '../utils/formatters';

export function useTotais() {
  const [totais, setTotais] = useState<Totais | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setTotais(await api.obterTotais());
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  return { totais, loading, error, carregar };
}
