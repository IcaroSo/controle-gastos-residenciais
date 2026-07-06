using ControleGastos.Core.Entities;
using ControleGastos.Core.Enums;
using ControleGastos.Core.Exceptions;
using ControleGastos.Core.Interfaces;
using ControleGastos.Core.Services;

namespace ControleGastos.UnitTests;

public sealed class TransacaoServiceTests
{
    [Fact]
    public async Task Deve_rejeitar_receita_para_pessoa_de_17_anos()
    {
        var pessoa = new Pessoa("Ana", 17);
        var service = CriarService(pessoa);

        var exception = await Assert.ThrowsAsync<BusinessRuleException>(() =>
            service.CriarAsync("Salario", 100m, TipoTransacao.Receita, pessoa.Id, CancellationToken.None));

        Assert.Equal("minor_income_not_allowed", exception.Code);
    }

    [Fact]
    public async Task Deve_permitir_receita_para_pessoa_de_18_anos()
    {
        var pessoa = new Pessoa("Bruno", 18);
        var transacaoRepository = new FakeTransacaoRepository();
        var service = CriarService(pessoa, transacaoRepository);

        var transacao = await service.CriarAsync("Bolsa", 100m, TipoTransacao.Receita, pessoa.Id, CancellationToken.None);

        Assert.Equal(TipoTransacao.Receita, transacao.Tipo);
        Assert.Equal(10000, transacao.ValorEmCentavos);
        Assert.Single(transacaoRepository.Transacoes);
    }

    [Fact]
    public async Task Deve_permitir_despesa_para_pessoa_de_17_anos()
    {
        var pessoa = new Pessoa("Clara", 17);
        var service = CriarService(pessoa);

        var transacao = await service.CriarAsync("Mercado", 45.90m, TipoTransacao.Despesa, pessoa.Id, CancellationToken.None);

        Assert.Equal(TipoTransacao.Despesa, transacao.Tipo);
        Assert.Equal(4590, transacao.ValorEmCentavos);
    }

    [Fact]
    public async Task Deve_rejeitar_pessoa_inexistente()
    {
        var service = CriarService();

        var exception = await Assert.ThrowsAsync<BusinessRuleException>(() =>
            service.CriarAsync("Salario", 100m, TipoTransacao.Receita, Guid.NewGuid(), CancellationToken.None));

        Assert.Equal("person_not_found", exception.Code);
    }

    private static TransacaoService CriarService(
        Pessoa? pessoa = null,
        FakeTransacaoRepository? transacaoRepository = null)
    {
        return new TransacaoService(
            new FakePessoaRepository(pessoa is null ? [] : [pessoa]),
            transacaoRepository ?? new FakeTransacaoRepository());
    }

    private sealed class FakePessoaRepository : IPessoaRepository
    {
        private readonly Dictionary<Guid, Pessoa> _pessoas;

        public FakePessoaRepository(IEnumerable<Pessoa> pessoas)
        {
            _pessoas = pessoas.ToDictionary(pessoa => pessoa.Id);
        }

        public Task<Pessoa> AdicionarAsync(Pessoa pessoa, CancellationToken cancellationToken)
        {
            _pessoas[pessoa.Id] = pessoa;
            return Task.FromResult(pessoa);
        }

        public Task<IReadOnlyList<Pessoa>> ListarAsync(CancellationToken cancellationToken)
        {
            return Task.FromResult<IReadOnlyList<Pessoa>>(_pessoas.Values.ToList());
        }

        public Task<Pessoa?> ObterPorIdAsync(Guid id, CancellationToken cancellationToken)
        {
            _pessoas.TryGetValue(id, out var pessoa);
            return Task.FromResult(pessoa);
        }

        public Task<bool> ExcluirAsync(Guid id, CancellationToken cancellationToken)
        {
            return Task.FromResult(_pessoas.Remove(id));
        }
    }

    private sealed class FakeTransacaoRepository : ITransacaoRepository
    {
        public List<Transacao> Transacoes { get; } = [];

        public Task<Transacao> AdicionarAsync(Transacao transacao, CancellationToken cancellationToken)
        {
            Transacoes.Add(transacao);
            return Task.FromResult(transacao);
        }

        public Task<IReadOnlyList<Transacao>> ListarComPessoasAsync(CancellationToken cancellationToken)
        {
            return Task.FromResult<IReadOnlyList<Transacao>>(Transacoes);
        }
    }
}
