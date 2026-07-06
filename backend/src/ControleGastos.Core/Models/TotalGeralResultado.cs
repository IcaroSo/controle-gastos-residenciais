namespace ControleGastos.Core.Models;

public sealed record TotalGeralResultado(long TotalReceitasEmCentavos, long TotalDespesasEmCentavos)
{
    public long SaldoEmCentavos => TotalReceitasEmCentavos - TotalDespesasEmCentavos;
}
