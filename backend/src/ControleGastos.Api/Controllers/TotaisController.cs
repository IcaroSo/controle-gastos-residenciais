using ControleGastos.Api.Contracts;
using ControleGastos.Core.Models;
using ControleGastos.Core.Services;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastos.Api.Controllers;

[ApiController]
[Route("api/totais")]
public sealed class TotaisController : ControllerBase
{
    private readonly TotaisService _totaisService;

    public TotaisController(TotaisService totaisService)
    {
        _totaisService = totaisService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(TotaisResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<TotaisResponse>> Obter(CancellationToken cancellationToken)
    {
        var totais = await _totaisService.ObterAsync(cancellationToken);
        return Ok(ToResponse(totais));
    }

    private static TotaisResponse ToResponse(TotaisResultado resultado)
    {
        return new TotaisResponse(
            resultado.Pessoas.Select(pessoa => new PessoaTotalResponse(
                pessoa.PessoaId,
                pessoa.Nome,
                MoneyConverter.FromCentavos(pessoa.TotalReceitasEmCentavos),
                MoneyConverter.FromCentavos(pessoa.TotalDespesasEmCentavos),
                MoneyConverter.FromCentavos(pessoa.SaldoEmCentavos))).ToList(),
            new TotalGeralResponse(
                MoneyConverter.FromCentavos(resultado.TotalGeral.TotalReceitasEmCentavos),
                MoneyConverter.FromCentavos(resultado.TotalGeral.TotalDespesasEmCentavos),
                MoneyConverter.FromCentavos(resultado.TotalGeral.SaldoEmCentavos)));
    }
}
