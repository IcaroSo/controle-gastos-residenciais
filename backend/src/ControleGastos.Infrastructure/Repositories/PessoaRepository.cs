using ControleGastos.Core.Entities;
using ControleGastos.Core.Interfaces;
using ControleGastos.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Infrastructure.Repositories;

public sealed class PessoaRepository : IPessoaRepository
{
    private readonly AppDbContext _dbContext;

    public PessoaRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Pessoa> AdicionarAsync(Pessoa pessoa, CancellationToken cancellationToken)
    {
        _dbContext.Pessoas.Add(pessoa);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return pessoa;
    }

    public async Task<IReadOnlyList<Pessoa>> ListarAsync(CancellationToken cancellationToken)
    {
        return await _dbContext.Pessoas
            .AsNoTracking()
            .OrderBy(pessoa => pessoa.Nome)
            .ThenBy(pessoa => pessoa.Id)
            .ToListAsync(cancellationToken);
    }

    public Task<Pessoa?> ObterPorIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return _dbContext.Pessoas
            .AsNoTracking()
            .FirstOrDefaultAsync(pessoa => pessoa.Id == id, cancellationToken);
    }

    public async Task<bool> ExcluirAsync(Guid id, CancellationToken cancellationToken)
    {
        var pessoa = await _dbContext.Pessoas.FirstOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (pessoa is null)
        {
            return false;
        }

        _dbContext.Pessoas.Remove(pessoa);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }
}
