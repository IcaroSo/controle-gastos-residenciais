using ControleGastos.Core.Enums;
using Microsoft.Data.Sqlite;

namespace ControleGastos.IntegrationTests;

public sealed class CascadeTests
{
    [Fact]
    public async Task Deve_excluir_transacoes_no_banco_ao_excluir_pessoa()
    {
        using var factory = new ControleGastosApiFactory();
        using var client = factory.CreateClient();
        var pessoa = await ApiTestClient.CriarPessoaAsync(client, "Marcos", 40);
        await ApiTestClient.CriarTransacaoAsync(client, pessoa.Id, "Aluguel", 1200m, TipoTransacao.Despesa);

        var deleteResponse = await client.DeleteAsync($"/api/pessoas/{pessoa.Id}");
        var transacoesRestantes = await ContarTransacoesAsync(factory.DatabasePath, pessoa.Id);

        Assert.Equal(System.Net.HttpStatusCode.NoContent, deleteResponse.StatusCode);
        Assert.Equal(0, transacoesRestantes);
    }

    private static async Task<long> ContarTransacoesAsync(string databasePath, Guid pessoaId)
    {
        await using var connection = new SqliteConnection($"Data Source={databasePath};Foreign Keys=True");
        await connection.OpenAsync();

        await using var command = connection.CreateCommand();
        command.CommandText = "SELECT COUNT(1) FROM Transacoes WHERE PessoaId = $pessoaId";
        command.Parameters.AddWithValue("$pessoaId", pessoaId);

        return (long)(await command.ExecuteScalarAsync())!;
    }
}
