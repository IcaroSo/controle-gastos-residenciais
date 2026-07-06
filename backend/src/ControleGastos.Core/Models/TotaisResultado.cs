namespace ControleGastos.Core.Models;

public sealed record TotaisResultado(
    IReadOnlyList<PessoaTotalResultado> Pessoas,
    TotalGeralResultado TotalGeral);
