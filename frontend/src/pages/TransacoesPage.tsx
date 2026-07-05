import { Plus, RefreshCw } from 'lucide-react';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { EmptyState } from '../components/EmptyState';
import { Feedback } from '../components/Feedback';
import { SectionTitle } from '../components/SectionTitle';
import { useTransacoes } from '../hooks/useTransacoes';
import type { TipoTransacao } from '../types/api';
import { formatCurrency } from '../utils/formatters';

export function TransacoesPage() {
  const { pessoas, transacoes, loading, saving, error, success, carregar, criar } = useTransacoes();
  const [pessoaId, setPessoaId] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState<TipoTransacao>('Despesa');
  const [formError, setFormError] = useState<string | null>(null);

  const pessoaSelecionada = useMemo(
    () => pessoas.find((pessoa) => pessoa.id === pessoaId),
    [pessoas, pessoaId],
  );
  const pessoaMenor = pessoaSelecionada ? pessoaSelecionada.idade < 18 : false;

  useEffect(() => {
    if (!pessoaId && pessoas.length > 0) {
      setPessoaId(pessoas[0].id);
    }
  }, [pessoaId, pessoas]);

  useEffect(() => {
    if (pessoaMenor && tipo === 'Receita') {
      setTipo('Despesa');
    }
  }, [pessoaMenor, tipo]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const valorNumerico = Number(valor.replace(',', '.'));
    if (!Number.isFinite(valorNumerico) || valorNumerico <= 0) {
      setFormError('Informe um valor maior que zero.');
      return;
    }

    await criar({
      pessoaId,
      descricao,
      valor: valorNumerico,
      tipo,
    });

    setDescricao('');
    setValor('');
    setTipo('Despesa');
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <section className="rounded-md border border-slate-200 bg-white p-4">
        <SectionTitle title="Cadastrar transacao" />
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-1 text-sm font-medium text-slate-700" htmlFor="pessoaId">
            Pessoa
            <select
              id="pessoaId"
              className="rounded-md border border-slate-300 px-3 py-2 text-base outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
              value={pessoaId}
              required
              onChange={(event) => setPessoaId(event.target.value)}
            >
              <option value="" disabled>
                Selecione
              </option>
              {pessoas.map((pessoa) => (
                <option key={pessoa.id} value={pessoa.id}>
                  {pessoa.nome} ({pessoa.idade})
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1 text-sm font-medium text-slate-700" htmlFor="descricao">
            Descricao
            <input
              id="descricao"
              className="rounded-md border border-slate-300 px-3 py-2 text-base outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
              value={descricao}
              minLength={2}
              maxLength={200}
              required
              onChange={(event) => setDescricao(event.target.value)}
            />
          </label>

          <label className="grid gap-1 text-sm font-medium text-slate-700" htmlFor="valor">
            Valor
            <input
              id="valor"
              className="rounded-md border border-slate-300 px-3 py-2 text-base outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
              value={valor}
              inputMode="decimal"
              placeholder="125,90"
              required
              onChange={(event) => setValor(event.target.value)}
            />
          </label>

          <fieldset className="grid gap-2">
            <legend className="text-sm font-medium text-slate-700">Tipo</legend>
            <div className="grid grid-cols-2 gap-2">
              {(['Despesa', 'Receita'] as TipoTransacao[]).map((item) => (
                <label
                  key={item}
                  className="flex min-h-10 items-center justify-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 has-[:checked]:border-teal-700 has-[:checked]:bg-teal-50 has-[:checked]:text-teal-800 has-[:disabled]:cursor-not-allowed has-[:disabled]:bg-slate-100 has-[:disabled]:text-slate-400"
                >
                  <input
                    className="h-4 w-4 accent-teal-700"
                    type="radio"
                    name="tipo"
                    value={item}
                    checked={tipo === item}
                    disabled={item === 'Receita' && pessoaMenor}
                    onChange={() => setTipo(item)}
                  />
                  {item}
                </label>
              ))}
            </div>
            {pessoaMenor ? (
              <p className="text-sm text-amber-700">
                Pessoas menores de 18 anos podem possuir apenas despesas.
              </p>
            ) : null}
          </fieldset>

          <button
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white outline-none transition hover:bg-teal-800 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300"
            type="submit"
            disabled={saving || pessoas.length === 0}
          >
            <Plus size={18} aria-hidden="true" />
            Salvar
          </button>
        </form>
      </section>

      <section className="grid gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <SectionTitle title="Transacoes cadastradas" />
          <button
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition hover:border-teal-300 hover:text-teal-800 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
            type="button"
            onClick={() => void carregar()}
            title="Recarregar transacoes"
          >
            <RefreshCw size={16} aria-hidden="true" />
            Recarregar
          </button>
        </div>

        {error ? <Feedback type="error" message={error} /> : null}
        {formError ? <Feedback type="error" message={formError} /> : null}
        {success ? <Feedback type="success" message={success} /> : null}
        {loading ? <Feedback type="info" message="Carregando transacoes..." /> : null}

        {!loading && pessoas.length === 0 ? <EmptyState message="Cadastre uma pessoa antes de criar transacoes." /> : null}
        {!loading && pessoas.length > 0 && transacoes.length === 0 ? (
          <EmptyState message="Nenhuma transacao cadastrada." />
        ) : null}

        {transacoes.length > 0 ? (
          <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-4 py-3 font-semibold">Descricao</th>
                  <th className="px-4 py-3 font-semibold">Pessoa</th>
                  <th className="px-4 py-3 font-semibold">Tipo</th>
                  <th className="px-4 py-3 text-right font-semibold">Valor</th>
                </tr>
              </thead>
              <tbody>
                {transacoes.map((transacao) => (
                  <tr key={transacao.id} className="border-t border-slate-200">
                    <td className="px-4 py-3 font-medium text-slate-950">{transacao.descricao}</td>
                    <td className="px-4 py-3 text-slate-700">{transacao.pessoaNome}</td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          transacao.tipo === 'Receita'
                            ? 'rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700'
                            : 'rounded-md bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700'
                        }
                      >
                        {transacao.tipo}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-slate-950">
                      {formatCurrency(transacao.valor)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </div>
  );
}
