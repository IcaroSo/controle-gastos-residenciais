using System.Net.Http.Json;
using System.Net;
using System.Text.Json;
using ControleGastos.Api.Contracts;
using ControleGastos.Core.Enums;

namespace ControleGastos.IntegrationTests;

public sealed class TransacoesEndpointsTests
{
    [Fact]
    public async Task Deve_criar_e_listar_transacao()
    {
        using var factory = new ControleGastosApiFactory();
        using var client = factory.CreateClient();
        var pessoa = await ApiTestClient.CriarPessoaAsync(client, "Joao", 18);

        var transacao = await ApiTestClient.CriarTransacaoAsync(client, pessoa.Id, "Salario", 3000m, TipoTransacao.Receita);
        var listaResponse = await client.GetAsync("/api/transacoes");
        var transacoes = await listaResponse.Content.ReadJsonAsync<IReadOnlyList<TransacaoResponse>>();

        Assert.Equal("Salario", transacao.Descricao);
        Assert.Equal(3000m, transacao.Valor);
        Assert.Equal(TipoTransacao.Receita, transacao.Tipo);
        Assert.Equal("Joao", transacao.PessoaNome);
        Assert.Contains(transacoes!, item => item.Id == transacao.Id && item.PessoaNome == "Joao");
    }

    [Fact]
    public async Task Deve_rejeitar_transacao_com_pessoa_inexistente()
    {
        using var factory = new ControleGastosApiFactory();
        using var client = factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/transacoes", new CriarTransacaoRequest
        {
            Descricao = "Salario",
            Valor = 100m,
            Tipo = TipoTransacao.Receita,
            PessoaId = Guid.NewGuid()
        }, ApiTestClient.JsonOptions);

        var problem = await response.Content.ReadJsonAsync<JsonElement>();

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal("person_not_found", problem.GetProperty("code").GetString());
    }

    [Fact]
    public async Task Deve_rejeitar_receita_para_menor_de_idade()
    {
        using var factory = new ControleGastosApiFactory();
        using var client = factory.CreateClient();
        var pessoa = await ApiTestClient.CriarPessoaAsync(client, "Lia", 17);

        var response = await client.PostAsJsonAsync("/api/transacoes", new CriarTransacaoRequest
        {
            Descricao = "Bolsa",
            Valor = 100m,
            Tipo = TipoTransacao.Receita,
            PessoaId = pessoa.Id
        }, ApiTestClient.JsonOptions);

        var problem = await response.Content.ReadJsonAsync<JsonElement>();

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal("minor_income_not_allowed", problem.GetProperty("code").GetString());
    }
}

