using ControleGastos.Core.Models;

namespace ControleGastos.Core.Interfaces;

/// <summary>
/// Consulta agregados monetarios no banco para evitar carregar transacoes individualmente.
/// </summary>
public interface ITotaisConsultaRepository
{
    Task<TotaisResultado> ObterTotaisAsync(CancellationToken cancellationToken);
}
