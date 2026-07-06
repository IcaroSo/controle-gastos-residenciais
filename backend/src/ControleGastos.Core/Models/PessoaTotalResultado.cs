namespace ControleGastos.Core.Models;

public sealed record PessoaTotalResultado(
    Guid PessoaId,
    string Nome,
    long TotalReceitasEmCentavos,
    long TotalDespesasEmCentavos)
{
    public long SaldoEmCentavos => TotalReceitasEmCentavos - TotalDespesasEmCentavos;
}
