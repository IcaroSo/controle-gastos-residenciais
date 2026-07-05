import { RefreshCw } from 'lucide-react';
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
        <SectionTitle title="Totais por pessoa" />
        <button
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition hover:border-teal-300 hover:text-teal-800 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
          type="button"
          onClick={() => void carregar()}
          title="Recarregar totais"
        >
          <RefreshCw size={16} aria-hidden="true" />
          Recarregar
        </button>
      </div>

      {error ? <Feedback type="error" message={error} /> : null}
      {loading ? <Feedback type="info" message="Carregando totais..." /> : null}

      {totais ? (
        <section className="grid gap-4">
          <div className="grid gap-3 rounded-md border border-slate-200 bg-white p-4 sm:grid-cols-3">
            <div>
              <p className="text-sm font-medium text-slate-600">Receitas</p>
              <p className="mt-1 text-2xl font-semibold text-emerald-700">
                {formatCurrency(totais.totalGeral.totalReceitas)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Despesas</p>
              <p className="mt-1 text-2xl font-semibold text-rose-700">
                {formatCurrency(totais.totalGeral.totalDespesas)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Saldo</p>
              <p
                className={`mt-1 text-2xl font-semibold ${
                  totais.totalGeral.saldo < 0 ? 'text-rose-700' : 'text-slate-950'
                }`}
              >
                {formatCurrency(totais.totalGeral.saldo)}
              </p>
            </div>
          </div>

          {totais.pessoas.length === 0 ? <EmptyState message="Nenhuma pessoa cadastrada." /> : null}

          {totais.pessoas.length > 0 ? (
            <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Pessoa</th>
                    <th className="px-4 py-3 text-right font-semibold">Receitas</th>
                    <th className="px-4 py-3 text-right font-semibold">Despesas</th>
                    <th className="px-4 py-3 text-right font-semibold">Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {totais.pessoas.map((pessoa) => (
                    <tr key={pessoa.pessoaId} className="border-t border-slate-200">
                      <td className="px-4 py-3 font-medium text-slate-950">{pessoa.nome}</td>
                      <td className="px-4 py-3 text-right text-emerald-700">
                        {formatCurrency(pessoa.totalReceitas)}
                      </td>
                      <td className="px-4 py-3 text-right text-rose-700">
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
