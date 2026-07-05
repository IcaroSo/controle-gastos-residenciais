using ControleGastos.Core.Interfaces;
using ControleGastos.Core.Models;
using ControleGastos.Core.Services;
using ControleGastos.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Infrastructure.Repositories;

public sealed class TotaisConsultaRepository : ITotaisConsultaRepository
{
    private readonly AppDbContext _dbContext;

    public TotaisConsultaRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<TotaisResultado> ObterTotaisAsync(CancellationToken cancellationToken)
    {
        var pessoas = await _dbContext.Pessoas
            .AsNoTracking()
            .OrderBy(pessoa => pessoa.Nome)
            .ThenBy(pessoa => pessoa.Id)
            .Select(pessoa => new PessoaResumo(pessoa.Id, pessoa.Nome))
            .ToListAsync(cancellationToken);

        var agregados = await _dbContext.Transacoes
            .AsNoTracking()
            .GroupBy(transacao => new { transacao.PessoaId, transacao.Tipo })
            .Select(grupo => new TransacaoAgregadoResultado(
                grupo.Key.PessoaId,
                grupo.Key.Tipo,
                grupo.Sum(transacao => transacao.ValorEmCentavos)))
            .ToListAsync(cancellationToken);

        return TotaisCalculator.Calcular(pessoas, agregados);
    }
}
