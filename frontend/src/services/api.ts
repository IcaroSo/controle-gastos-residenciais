import type {
  CriarPessoaRequest,
  CriarTransacaoRequest,
  Pessoa,
  ProblemDetails,
  Totais,
  Transacao,
} from '../types/api';

const apiUrl = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(public readonly problem: ProblemDetails) {
    super(problem.detail ?? problem.title ?? 'Nao foi possivel concluir a requisicao.');
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new ApiError(await readProblem(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

async function readProblem(response: Response): Promise<ProblemDetails> {
  try {
    return (await response.json()) as ProblemDetails;
  } catch {
    return {
      title: 'Erro de comunicacao',
      status: response.status,
      detail: 'A API retornou uma resposta inesperada.',
    };
  }
}

export const api = {
  listarPessoas: () => request<Pessoa[]>('/pessoas'),
  criarPessoa: (payload: CriarPessoaRequest) =>
    request<Pessoa>('/pessoas', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  excluirPessoa: (id: string) =>
    request<void>(`/pessoas/${id}`, {
      method: 'DELETE',
    }),
  listarTransacoes: () => request<Transacao[]>('/transacoes'),
  criarTransacao: (payload: CriarTransacaoRequest) =>
    request<Transacao>('/transacoes', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  obterTotais: () => request<Totais>('/totais'),
};
