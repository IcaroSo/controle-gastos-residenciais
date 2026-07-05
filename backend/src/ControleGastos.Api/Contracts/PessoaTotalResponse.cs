namespace ControleGastos.Api.Contracts;

public sealed record PessoaTotalResponse(
    Guid PessoaId,
    string Nome,
    decimal TotalReceitas,
    decimal TotalDespesas,
    decimal Saldo);
