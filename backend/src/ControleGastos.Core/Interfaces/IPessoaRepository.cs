using ControleGastos.Core.Entities;

namespace ControleGastos.Core.Interfaces;

/// <summary>
/// Persiste pessoas sem expor detalhes de banco para a camada de regras.
/// </summary>
public interface IPessoaRepository
{
    Task<Pessoa> AdicionarAsync(Pessoa pessoa, CancellationToken cancellationToken);

    Task<IReadOnlyList<Pessoa>> ListarAsync(CancellationToken cancellationToken);

    Task<Pessoa?> ObterPorIdAsync(Guid id, CancellationToken cancellationToken);

    Task<bool> ExcluirAsync(Guid id, CancellationToken cancellationToken);
}
