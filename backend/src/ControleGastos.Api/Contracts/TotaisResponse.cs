namespace ControleGastos.Api.Contracts;

public sealed record TotaisResponse(
    IReadOnlyList<PessoaTotalResponse> Pessoas,
    TotalGeralResponse TotalGeral);
