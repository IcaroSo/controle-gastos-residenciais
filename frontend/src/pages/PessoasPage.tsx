import { Loader2, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { Feedback } from '../components/Feedback';
import { SectionTitle } from '../components/SectionTitle';
import { usePessoas } from '../hooks/usePessoas';
import type { Pessoa } from '../types/api';

export function PessoasPage() {
  const { pessoas, loading, saving, error, success, carregar, criar, excluir } = usePessoas();
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [pessoaParaExcluir, setPessoaParaExcluir] = useState<Pessoa | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const criada = await criar({ nome, idade: Number(idade) });

    if (criada) {
      setNome('');
      setIdade('');
    }
  }

  async function handleConfirmarExclusao() {
    if (!pessoaParaExcluir) {
      return;
    }

    const excluida = await excluir(pessoaParaExcluir.id);
    if (excluida) {
      setPessoaParaExcluir(null);
    }
  }

  return (
    <>
      <div className="grid gap-5 lg:grid-cols-[minmax(280px,360px)_1fr] lg:items-start">
        <section className="rounded-md border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-6">
          <SectionTitle title="Cadastrar pessoa" description="Informe nome e idade para começar a registrar transações." />
          <form className="mt-4 grid gap-4" onSubmit={handleSubmit} aria-busy={saving}>
            <label className="grid gap-1.5 text-sm font-medium text-slate-700" htmlFor="nome">
              Nome
              <input
                id="nome"
                className="min-h-11 rounded-md border border-slate-300 bg-white px-3 py-2 text-base text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
                value={nome}
                minLength={2}
                maxLength={120}
                required
                autoComplete="name"
                onChange={(event) => setNome(event.target.value)}
              />
            </label>
            <label className="grid gap-1.5 text-sm font-medium text-slate-700" htmlFor="idade">
              Idade
              <input
                id="idade"
                className="min-h-11 rounded-md border border-slate-300 bg-white px-3 py-2 text-base text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
                value={idade}
                type="number"
                min={0}
                max={130}
                required
                inputMode="numeric"
                onChange={(event) => setIdade(event.target.value)}
              />
            </label>
            <button
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white outline-none transition hover:bg-teal-800 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300"
              type="submit"
              disabled={saving}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Plus size={18} aria-hidden="true" />}
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </form>
        </section>

        <section className="grid gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <SectionTitle title="Pessoas cadastradas" description="A exclusão remove também as transações vinculadas." />
            <button
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              type="button"
              onClick={() => void carregar()}
              disabled={loading}
              title="Recarregar pessoas"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
              Recarregar
            </button>
          </div>

          {error && !pessoaParaExcluir ? <Feedback type="error" message={error} /> : null}
          {success ? <Feedback type="success" message={success} /> : null}
          {loading ? <Feedback type="info" message="Carregando pessoas..." /> : null}

          {!loading && pessoas.length === 0 ? <EmptyState message="Nenhuma pessoa cadastrada." /> : null}

          {pessoas.length > 0 ? (
            <div className="overflow-x-auto rounded-md border border-slate-200 bg-white shadow-sm">
              <table className="min-w-[560px] w-full border-collapse text-left text-sm">
                <caption className="sr-only">Lista de pessoas cadastradas</caption>
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Nome</th>
                    <th className="px-4 py-3 font-semibold">Idade</th>
                    <th className="w-28 px-4 py-3 text-right font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {pessoas.map((pessoa) => (
                    <tr key={pessoa.id} className="transition hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-950">{pessoa.nome}</td>
                      <td className="px-4 py-3 text-slate-700">{pessoa.idade}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-red-200 bg-white text-red-700 outline-none transition hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:text-slate-300"
                          type="button"
                          onClick={() => setPessoaParaExcluir(pessoa)}
                          disabled={saving}
                          title={`Excluir ${pessoa.nome}`}
                          aria-label={`Excluir ${pessoa.nome}`}
                        >
                          <Trash2 size={17} aria-hidden="true" />
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

      <ConfirmDialog
        open={pessoaParaExcluir !== null}
        title="Excluir pessoa"
        description="Ao confirmar, esta pessoa e todas as transações vinculadas a ela serão removidas."
        itemLabel={pessoaParaExcluir ? pessoaParaExcluir.nome : undefined}
        confirmLabel="Excluir pessoa"
        loading={saving}
        error={pessoaParaExcluir ? error : null}
        onCancel={() => {
          if (!saving) {
            setPessoaParaExcluir(null);
          }
        }}
        onConfirm={() => void handleConfirmarExclusao()}
      />
    </>
  );
}
