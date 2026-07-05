using System.Net.Http.Json;
using System.Net;
using ControleGastos.Api.Contracts;

namespace ControleGastos.IntegrationTests;

public sealed class PessoasEndpointsTests
{
    [Fact]
    public async Task Deve_criar_e_listar_pessoa()
    {
        using var factory = new ControleGastosApiFactory();
        using var client = factory.CreateClient();

        var criada = await ApiTestClient.CriarPessoaAsync(client, " Maria Silva ", 30);
        var pessoas = await client.GetFromJsonAsync<IReadOnlyList<PessoaResponse>>("/api/pessoas");

        Assert.Equal("Maria Silva", criada.Nome);
        Assert.Contains(pessoas!, pessoa => pessoa.Id == criada.Id && pessoa.Nome == "Maria Silva");
    }

    [Fact]
    public async Task Deve_retornar_404_ao_excluir_pessoa_inexistente()
    {
        using var factory = new ControleGastosApiFactory();
        using var client = factory.CreateClient();

        var response = await client.DeleteAsync($"/api/pessoas/{Guid.NewGuid()}");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}

