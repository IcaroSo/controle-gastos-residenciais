import { Loader2, Plus, RefreshCw } from 'lucide-react';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { EmptyState } from '../components/EmptyState';
import { Feedback } from '../components/Feedback';
import { SectionTitle } from '../components/SectionTitle';
import { useTransacoes } from '../hooks/useTransacoes';
import type { TipoTransacao } from '../types/api';
import { formatCurrency, formatCurrencyInput, parseCurrencyInput } from '../utils/formatters';

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

    const valorNumerico = parseCurrencyInput(valor);
    if (!Number.isFinite(valorNumerico) || valorNumerico <= 0) {
      setFormError('Informe um valor maior que zero.');
      return;
    }

    const criada = await criar({
      pessoaId,
      descricao,
      valor: valorNumerico,
      tipo,
    });

    if (criada) {
      setDescricao('');
      setValor('');
      setTipo('Despesa');
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(300px,380px)_1fr] lg:items-start">
      <section className="rounded-md border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-6">
        <SectionTitle title="Cadastrar transação" description="Registre receitas e despesas vinculadas a uma pessoa." />
        <form className="mt-4 grid gap-4" onSubmit={handleSubmit} aria-busy={saving}>
          <label className="grid gap-1.5 text-sm font-medium text-slate-700" htmlFor="pessoaId">
            Pessoa
            <select
              id="pessoaId"
              className="min-h-11 rounded-md border border-slate-300 bg-white px-3 py-2 text-base text-slate-950 outline-none transition hover:border-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 disabled:cursor-not-allowed disabled:bg-slate-100"
              value={pessoaId}
              required
              disabled={loading || pessoas.length === 0}
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

          <label className="grid gap-1.5 text-sm font-medium text-slate-700" htmlFor="descricao">
            Descrição
            <input
              id="descricao"
              className="min-h-11 rounded-md border border-slate-300 bg-white px-3 py-2 text-base text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
              value={descricao}
              minLength={2}
              maxLength={200}
              required
              onChange={(event) => {
                setDescricao(event.target.value);
                setFormError(null);
              }}
            />
          </label>

          <label className="grid gap-1.5 text-sm font-medium text-slate-700" htmlFor="valor">
            Valor
            <input
              id="valor"
              className="min-h-11 rounded-md border border-slate-300 bg-white px-3 py-2 text-base text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
              value={valor}
              inputMode="numeric"
              placeholder="1.234,56"
              required
              onChange={(event) => {
                setValor(formatCurrencyInput(event.target.value));
                setFormError(null);
              }}
            />
          </label>

          <fieldset className="grid gap-2">
            <legend className="text-sm font-medium text-slate-700">Tipo</legend>
            <div className="grid grid-cols-2 gap-2">
              {(['Despesa', 'Receita'] as TipoTransacao[]).map((item) => (
                <label
                  key={item}
                  className="flex min-h-11 items-center justify-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition has-[:checked]:border-teal-700 has-[:checked]:bg-teal-50 has-[:checked]:text-teal-800 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-teal-600 has-[:focus-visible]:ring-offset-2 has-[:disabled]:cursor-not-allowed has-[:disabled]:bg-slate-100 has-[:disabled]:text-slate-400"
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
              <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm leading-5 text-amber-800">
                Pessoas menores de 18 anos podem possuir apenas despesas.
              </p>
            ) : null}
          </fieldset>

          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white outline-none transition hover:bg-teal-800 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300"
            type="submit"
            disabled={saving || pessoas.length === 0}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Plus size={18} aria-hidden="true" />}
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </form>
      </section>

      <section className="grid gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <SectionTitle title="Transações cadastradas" description="A lista mostra a pessoa vinculada e o valor já formatado." />
          <button
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            type="button"
            onClick={() => void carregar()}
            disabled={loading}
            title="Recarregar transações"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
            Recarregar
          </button>
        </div>

        {error ? <Feedback type="error" message={error} /> : null}
        {formError ? <Feedback type="error" message={formError} /> : null}
        {success ? <Feedback type="success" message={success} /> : null}
        {loading ? <Feedback type="info" message="Carregando transações..." /> : null}

        {!loading && pessoas.length === 0 ? <EmptyState message="Cadastre uma pessoa antes de criar transações." /> : null}
        {!loading && pessoas.length > 0 && transacoes.length === 0 ? (
          <EmptyState message="Nenhuma transação cadastrada." />
        ) : null}

        {transacoes.length > 0 ? (
          <div className="overflow-x-auto rounded-md border border-slate-200 bg-white shadow-sm">
            <table className="min-w-[680px] w-full border-collapse text-left text-sm">
              <caption className="sr-only">Lista de transações cadastradas</caption>
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-4 py-3 font-semibold">Descrição</th>
                  <th className="px-4 py-3 font-semibold">Pessoa</th>
                  <th className="px-4 py-3 font-semibold">Tipo</th>
                  <th className="px-4 py-3 text-right font-semibold">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {transacoes.map((transacao) => (
                  <tr key={transacao.id} className="transition hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-950">{transacao.descricao}</td>
                    <td className="px-4 py-3 text-slate-700">{transacao.pessoaNome}</td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          transacao.tipo === 'Receita'
                            ? 'inline-flex rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200'
                            : 'inline-flex rounded-md bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-200'
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
