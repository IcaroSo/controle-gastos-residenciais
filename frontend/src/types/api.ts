export type TipoTransacao = 'Receita' | 'Despesa';

export interface Pessoa {
  id: string;
  nome: string;
  idade: number;
}

export interface CriarPessoaRequest {
  nome: string;
  idade: number;
}

export interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  pessoaId: string;
  pessoaNome: string;
}

export interface CriarTransacaoRequest {
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  pessoaId: string;
}

export interface PessoaTotal {
  pessoaId: string;
  nome: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface TotalGeral {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface Totais {
  pessoas: PessoaTotal[];
  totalGeral: TotalGeral;
}

export interface ProblemDetails {
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  code?: string;
  errors?: Record<string, string[]>;
}
