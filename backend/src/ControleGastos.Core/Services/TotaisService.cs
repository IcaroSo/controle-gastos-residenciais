using ControleGastos.Core.Interfaces;
using ControleGastos.Core.Models;

namespace ControleGastos.Core.Services;

public sealed class TotaisService
{
    private readonly ITotaisConsultaRepository _totaisConsultaRepository;

    public TotaisService(ITotaisConsultaRepository totaisConsultaRepository)
    {
        _totaisConsultaRepository = totaisConsultaRepository;
    }

    public Task<TotaisResultado> ObterAsync(CancellationToken cancellationToken)
    {
        return _totaisConsultaRepository.ObterTotaisAsync(cancellationToken);
    }
}
