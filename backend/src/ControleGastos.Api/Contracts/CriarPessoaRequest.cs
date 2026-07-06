using System.ComponentModel.DataAnnotations;

namespace ControleGastos.Api.Contracts;

public sealed class CriarPessoaRequest
{
    [Required(AllowEmptyStrings = false)]
    [StringLength(120, MinimumLength = 2)]
    public string? Nome { get; init; }

    [Range(0, 130)]
    public int Idade { get; init; }
}
