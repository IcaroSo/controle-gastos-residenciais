using ControleGastos.Core.Entities;
using ControleGastos.Core.Enums;
using ControleGastos.Core.Exceptions;
using ControleGastos.Core.Interfaces;
using ControleGastos.Core.Models;

namespace ControleGastos.Core.Services;

public sealed class TransacaoService
{
    private readonly IPessoaRepository _pessoaRepository;
    private readonly ITransacaoRepository _transacaoRepository;

    public TransacaoService(IPessoaRepository pessoaRepository, ITransacaoRepository transacaoRepository)
    {
        _pessoaRepository = pessoaRepository;
        _transacaoRepository = transacaoRepository;
    }

    public Task<IReadOnlyList<Transacao>> ListarAsync(CancellationToken cancellationToken)
    {
        return _transacaoRepository.ListarComPessoasAsync(cancellationToken);
    }

    public async Task<Transacao> CriarAsync(
        string descricao,
        decimal valor,
        TipoTransacao tipo,
        Guid pessoaId,
        CancellationToken cancellationToken)
    {
        var pessoa = await _pessoaRepository.ObterPorIdAsync(pessoaId, cancellationToken);
        if (pessoa is null)
        {
            throw new BusinessRuleException("person_not_found", "Pessoa da transacao nao encontrada.");
        }

        // Regra critica: menores de 18 anos so podem possuir despesas.
        if (!pessoa.PodePossuir(tipo))
        {
            throw new BusinessRuleException("minor_income_not_allowed", "Pessoas menores de 18 anos so podem possuir despesas.");
        }

        var valorEmCentavos = MoneyConverter.ToCentavos(valor);
        var transacao = new Transacao(descricao, valorEmCentavos, tipo, pessoa.Id);
        return await _transacaoRepository.AdicionarAsync(transacao, cancellationToken);
    }
}
