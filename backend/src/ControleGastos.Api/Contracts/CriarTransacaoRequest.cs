using System.ComponentModel.DataAnnotations;
using ControleGastos.Core.Enums;

namespace ControleGastos.Api.Contracts;

public sealed class CriarTransacaoRequest
{
    [Required(AllowEmptyStrings = false)]
    [StringLength(200, MinimumLength = 2)]
    public string? Descricao { get; init; }

    [Required]
    public decimal? Valor { get; init; }

    [Required]
    public TipoTransacao? Tipo { get; init; }

    [Required]
    public Guid? PessoaId { get; init; }
}
