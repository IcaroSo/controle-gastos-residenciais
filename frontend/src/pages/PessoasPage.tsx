import { Plus, RefreshCw, Trash2 } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { EmptyState } from '../components/EmptyState';
import { Feedback } from '../components/Feedback';
import { SectionTitle } from '../components/SectionTitle';
import { usePessoas } from '../hooks/usePessoas';

export function PessoasPage() {
  const { pessoas, loading, saving, error, success, carregar, criar, excluir } = usePessoas();
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await criar({ nome, idade: Number(idade) });
    setNome('');
    setIdade('');
  }

  async function handleExcluir(id: string, nomePessoa: string) {
    const confirmed = window.confirm(
      `Excluir ${nomePessoa}? Todas as transacoes vinculadas tambem serao removidas.`,
    );

    if (confirmed) {
      await excluir(id);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <section className="rounded-md border border-slate-200 bg-white p-4">
        <SectionTitle title="Cadastrar pessoa" />
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-1 text-sm font-medium text-slate-700" htmlFor="nome">
            Nome
            <input
              id="nome"
              className="rounded-md border border-slate-300 px-3 py-2 text-base outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
              value={nome}
              minLength={2}
              maxLength={120}
              required
              onChange={(event) => setNome(event.target.value)}
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-slate-700" htmlFor="idade">
            Idade
            <input
              id="idade"
              className="rounded-md border border-slate-300 px-3 py-2 text-base outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
              value={idade}
              type="number"
              min={0}
              max={130}
              required
              onChange={(event) => setIdade(event.target.value)}
            />
          </label>
          <button
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white outline-none transition hover:bg-teal-800 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300"
            type="submit"
            disabled={saving}
          >
            <Plus size={18} aria-hidden="true" />
            Salvar
          </button>
        </form>
      </section>

      <section className="grid gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <SectionTitle title="Pessoas cadastradas" />
          <button
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition hover:border-teal-300 hover:text-teal-800 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
            type="button"
            onClick={() => void carregar()}
            title="Recarregar pessoas"
          >
            <RefreshCw size={16} aria-hidden="true" />
            Recarregar
          </button>
        </div>

        {error ? <Feedback type="error" message={error} /> : null}
        {success ? <Feedback type="success" message={success} /> : null}
        {loading ? <Feedback type="info" message="Carregando pessoas..." /> : null}

        {!loading && pessoas.length === 0 ? <EmptyState message="Nenhuma pessoa cadastrada." /> : null}

        {pessoas.length > 0 ? (
          <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-4 py-3 font-semibold">Nome</th>
                  <th className="px-4 py-3 font-semibold">Idade</th>
                  <th className="w-28 px-4 py-3 text-right font-semibold">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {pessoas.map((pessoa) => (
                  <tr key={pessoa.id} className="border-t border-slate-200">
                    <td className="px-4 py-3 font-medium text-slate-950">{pessoa.nome}</td>
                    <td className="px-4 py-3 text-slate-700">{pessoa.idade}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-red-200 bg-white text-red-700 outline-none transition hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:text-slate-300"
                        type="button"
                        onClick={() => void handleExcluir(pessoa.id, pessoa.nome)}
                        disabled={saving}
                        title={`Excluir ${pessoa.nome}`}
                      >
                        <Trash2 size={17} aria-hidden="true" />
                        <span className="sr-only">Excluir {pessoa.nome}</span>
                      </button>
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
