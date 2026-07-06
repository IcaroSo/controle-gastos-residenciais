using ControleGastos.Core.Entities;
using ControleGastos.Core.Interfaces;
using ControleGastos.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Infrastructure.Repositories;

public sealed class TransacaoRepository : ITransacaoRepository
{
    private readonly AppDbContext _dbContext;

    public TransacaoRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Transacao> AdicionarAsync(Transacao transacao, CancellationToken cancellationToken)
    {
        _dbContext.Transacoes.Add(transacao);
        await _dbContext.SaveChangesAsync(cancellationToken);
        await _dbContext.Entry(transacao).Reference(item => item.Pessoa).LoadAsync(cancellationToken);
        return transacao;
    }

    public async Task<IReadOnlyList<Transacao>> ListarComPessoasAsync(CancellationToken cancellationToken)
    {
        return await _dbContext.Transacoes
            .AsNoTracking()
            .Include(transacao => transacao.Pessoa)
            .OrderBy(transacao => transacao.Descricao)
            .ThenBy(transacao => transacao.Id)
            .ToListAsync(cancellationToken);
    }
}
