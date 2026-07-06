using System.Net.Http.Json;
using ControleGastos.Api.Contracts;

namespace ControleGastos.IntegrationTests;

public sealed class PersistenceTests
{
    [Fact]
    public async Task Deve_manter_dados_recriando_host_com_mesmo_arquivo_sqlite()
    {
        var databasePath = Path.Combine(Path.GetTempPath(), $"controle-gastos-persistencia-{Guid.NewGuid():N}.db");
        Guid pessoaId;

        using (var factory = new ControleGastosApiFactory(databasePath, deleteDatabaseOnDispose: false))
        using (var client = factory.CreateClient())
        {
            var pessoa = await ApiTestClient.CriarPessoaAsync(client, "Persistente", 29);
            pessoaId = pessoa.Id;
        }

        using (var factory = new ControleGastosApiFactory(databasePath))
        using (var client = factory.CreateClient())
        {
            var pessoas = await client.GetFromJsonAsync<IReadOnlyList<PessoaResponse>>("/api/pessoas");

            Assert.Contains(pessoas!, pessoa => pessoa.Id == pessoaId && pessoa.Nome == "Persistente");
        }
    }
}

