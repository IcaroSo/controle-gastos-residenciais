using ControleGastos.Core.Enums;

namespace ControleGastos.Api.Contracts;

public sealed record TransacaoResponse(
    Guid Id,
    string Descricao,
    decimal Valor,
    TipoTransacao Tipo,
    Guid PessoaId,
    string PessoaNome);
