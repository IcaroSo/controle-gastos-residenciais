using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using ControleGastos.Api.Contracts;
using ControleGastos.Core.Enums;

namespace ControleGastos.IntegrationTests;

internal static class ApiTestClient
{
    public static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web)
    {
        Converters = { new JsonStringEnumConverter(allowIntegerValues: false) }
    };

    public static async Task<PessoaResponse> CriarPessoaAsync(HttpClient client, string nome, int idade)
    {
        var response = await client.PostAsJsonAsync("/api/pessoas", new CriarPessoaRequest
        {
            Nome = nome,
            Idade = idade
        }, JsonOptions);

        response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<PessoaResponse>(JsonOptions))!;
    }

    public static async Task<TransacaoResponse> CriarTransacaoAsync(
        HttpClient client,
        Guid pessoaId,
        string descricao,
        decimal valor,
        TipoTransacao tipo)
    {
        var response = await client.PostAsJsonAsync("/api/transacoes", new CriarTransacaoRequest
        {
            Descricao = descricao,
            Valor = valor,
            Tipo = tipo,
            PessoaId = pessoaId
        }, JsonOptions);

        response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<TransacaoResponse>(JsonOptions))!;
    }

    public static Task<T?> ReadJsonAsync<T>(this HttpContent content)
    {
        return content.ReadFromJsonAsync<T>(JsonOptions);
    }
}

