using System.Net.Http.Json;
using ControleGastos.Api.Contracts;
using ControleGastos.Core.Enums;

namespace ControleGastos.IntegrationTests;

public sealed class TotaisEndpointsTests
{
    [Fact]
    public async Task Deve_retornar_pessoa_sem_transacao_e_totais_gerais()
    {
        using var factory = new ControleGastosApiFactory();
        using var client = factory.CreateClient();

        var maria = await ApiTestClient.CriarPessoaAsync(client, "Maria", 30);
        var joao = await ApiTestClient.CriarPessoaAsync(client, "Joao", 17);
        var clara = await ApiTestClient.CriarPessoaAsync(client, "Clara", 25);

        await ApiTestClient.CriarTransacaoAsync(client, maria.Id, "Salario", 3000m, TipoTransacao.Receita);
        await ApiTestClient.CriarTransacaoAsync(client, maria.Id, "Mercado", 450m, TipoTransacao.Despesa);
        await ApiTestClient.CriarTransacaoAsync(client, joao.Id, "Transporte", 50m, TipoTransacao.Despesa);

        var totais = await client.GetFromJsonAsync<TotaisResponse>("/api/totais");

        var mariaTotais = Assert.Single(totais!.Pessoas, pessoa => pessoa.PessoaId == maria.Id);
        Assert.Equal(3000m, mariaTotais.TotalReceitas);
        Assert.Equal(450m, mariaTotais.TotalDespesas);
        Assert.Equal(2550m, mariaTotais.Saldo);

        var claraTotais = Assert.Single(totais.Pessoas, pessoa => pessoa.PessoaId == clara.Id);
        Assert.Equal(0m, claraTotais.TotalReceitas);
        Assert.Equal(0m, claraTotais.TotalDespesas);
        Assert.Equal(0m, claraTotais.Saldo);

        Assert.Equal(3000m, totais.TotalGeral.TotalReceitas);
        Assert.Equal(500m, totais.TotalGeral.TotalDespesas);
        Assert.Equal(2500m, totais.TotalGeral.Saldo);
    }

    [Fact]
    public async Task Deve_retornar_lista_vazia_e_total_zerado_sem_pessoas()
    {
        using var factory = new ControleGastosApiFactory();
        using var client = factory.CreateClient();

        var totais = await client.GetFromJsonAsync<TotaisResponse>("/api/totais");

        Assert.Empty(totais!.Pessoas);
        Assert.Equal(0m, totais.TotalGeral.TotalReceitas);
        Assert.Equal(0m, totais.TotalGeral.TotalDespesas);
        Assert.Equal(0m, totais.TotalGeral.Saldo);
    }
}

