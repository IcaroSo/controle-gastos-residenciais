using ControleGastos.Core.Entities;

namespace ControleGastos.Core.Interfaces;

/// <summary>
/// Persiste transacoes mantendo a regra de criacao no Core.
/// </summary>
public interface ITransacaoRepository
{
    Task<Transacao> AdicionarAsync(Transacao transacao, CancellationToken cancellationToken);

    Task<IReadOnlyList<Transacao>> ListarComPessoasAsync(CancellationToken cancellationToken);
}
