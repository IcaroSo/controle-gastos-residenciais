using ControleGastos.Api.Contracts;
using ControleGastos.Core.Entities;
using ControleGastos.Core.Models;
using ControleGastos.Core.Services;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastos.Api.Controllers;

[ApiController]
[Route("api/transacoes")]
public sealed class TransacoesController : ControllerBase
{
    private readonly TransacaoService _transacaoService;

    public TransacoesController(TransacaoService transacaoService)
    {
        _transacaoService = transacaoService;
    }

    [HttpPost]
    [ProducesResponseType(typeof(TransacaoResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<TransacaoResponse>> Criar(CriarTransacaoRequest request, CancellationToken cancellationToken)
    {
        var transacao = await _transacaoService.CriarAsync(
            request.Descricao ?? string.Empty,
            request.Valor.GetValueOrDefault(),
            request.Tipo.GetValueOrDefault(),
            request.PessoaId.GetValueOrDefault(),
            cancellationToken);

        var response = ToResponse(transacao);
        return Created($"/api/transacoes/{response.Id}", response);
    }

    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<TransacaoResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<TransacaoResponse>>> Listar(CancellationToken cancellationToken)
    {
        var transacoes = await _transacaoService.ListarAsync(cancellationToken);
        return Ok(transacoes.Select(ToResponse).ToList());
    }

    private static TransacaoResponse ToResponse(Transacao transacao)
    {
        return new TransacaoResponse(
            transacao.Id,
            transacao.Descricao,
            MoneyConverter.FromCentavos(transacao.ValorEmCentavos),
            transacao.Tipo,
            transacao.PessoaId,
            transacao.Pessoa?.Nome ?? string.Empty);
    }
}
