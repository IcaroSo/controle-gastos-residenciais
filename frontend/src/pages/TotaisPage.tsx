import { ArrowDownCircle, ArrowUpCircle, RefreshCw, Scale } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';
import { Feedback } from '../components/Feedback';
import { SectionTitle } from '../components/SectionTitle';
import { useTotais } from '../hooks/useTotais';
import { formatCurrency } from '../utils/formatters';

export function TotaisPage() {
  const { totais, loading, error, carregar } = useTotais();

  return (
    <div className="grid gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <SectionTitle title="Totais por pessoa" description="Resumo consolidado de receitas, despesas e saldo." />
        <button
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          onClick={() => void carregar()}
          disabled={loading}
          title="Recarregar totais"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
          Recarregar
        </button>
      </div>

      {error ? <Feedback type="error" message={error} /> : null}
      {loading ? <Feedback type="info" message="Carregando totais..." /> : null}

      {totais ? (
        <section className="grid gap-4" aria-label="Resumo financeiro">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-md border border-emerald-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-slate-600">Receitas</p>
                <ArrowUpCircle className="h-5 w-5 text-emerald-600" aria-hidden="true" />
              </div>
              <p className="mt-2 text-2xl font-semibold leading-8 text-emerald-700">
                {formatCurrency(totais.totalGeral.totalReceitas)}
              </p>
            </div>
            <div className="rounded-md border border-rose-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-slate-600">Despesas</p>
                <ArrowDownCircle className="h-5 w-5 text-rose-600" aria-hidden="true" />
              </div>
              <p className="mt-2 text-2xl font-semibold leading-8 text-rose-700">
                {formatCurrency(totais.totalGeral.totalDespesas)}
              </p>
            </div>
            <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-slate-600">Saldo</p>
                <Scale className="h-5 w-5 text-slate-500" aria-hidden="true" />
              </div>
              <p
                className={`mt-2 text-2xl font-semibold leading-8 ${
                  totais.totalGeral.saldo < 0 ? 'text-rose-700' : 'text-slate-950'
                }`}
              >
                {formatCurrency(totais.totalGeral.saldo)}
              </p>
            </div>
          </div>

          {totais.pessoas.length === 0 ? <EmptyState message="Nenhuma pessoa cadastrada." /> : null}

          {totais.pessoas.length > 0 ? (
            <div className="overflow-x-auto rounded-md border border-slate-200 bg-white shadow-sm">
              <table className="min-w-[680px] w-full border-collapse text-left text-sm">
                <caption className="sr-only">Totais financeiros por pessoa</caption>
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Pessoa</th>
                    <th className="px-4 py-3 text-right font-semibold">Receitas</th>
                    <th className="px-4 py-3 text-right font-semibold">Despesas</th>
                    <th className="px-4 py-3 text-right font-semibold">Saldo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {totais.pessoas.map((pessoa) => (
                    <tr key={pessoa.pessoaId} className="transition hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-950">{pessoa.nome}</td>
                      <td className="px-4 py-3 text-right font-medium text-emerald-700">
                        {formatCurrency(pessoa.totalReceitas)}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-rose-700">
                        {formatCurrency(pessoa.totalDespesas)}
                      </td>
                      <td
                        className={`px-4 py-3 text-right font-semibold ${
                          pessoa.saldo < 0 ? 'text-rose-700' : 'text-slate-950'
                        }`}
                      >
                        {formatCurrency(pessoa.saldo)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
