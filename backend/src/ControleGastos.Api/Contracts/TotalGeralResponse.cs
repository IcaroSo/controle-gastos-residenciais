namespace ControleGastos.Api.Contracts;

public sealed record TotalGeralResponse(decimal TotalReceitas, decimal TotalDespesas, decimal Saldo);
