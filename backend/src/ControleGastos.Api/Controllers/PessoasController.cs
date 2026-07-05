using ControleGastos.Api.Contracts;
using ControleGastos.Core.Entities;
using ControleGastos.Core.Services;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastos.Api.Controllers;

[ApiController]
[Route("api/pessoas")]
public sealed class PessoasController : ControllerBase
{
    private readonly PessoaService _pessoaService;

    public PessoasController(PessoaService pessoaService)
    {
        _pessoaService = pessoaService;
    }

    [HttpPost]
    [ProducesResponseType(typeof(PessoaResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<PessoaResponse>> Criar(CriarPessoaRequest request, CancellationToken cancellationToken)
    {
        var pessoa = await _pessoaService.CriarAsync(request.Nome ?? string.Empty, request.Idade, cancellationToken);
        var response = ToResponse(pessoa);
        return Created($"/api/pessoas/{response.Id}", response);
    }

    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<PessoaResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<PessoaResponse>>> Listar(CancellationToken cancellationToken)
    {
        var pessoas = await _pessoaService.ListarAsync(cancellationToken);
        return Ok(pessoas.Select(ToResponse).ToList());
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Excluir(Guid id, CancellationToken cancellationToken)
    {
        await _pessoaService.ExcluirAsync(id, cancellationToken);
        return NoContent();
    }

    private static PessoaResponse ToResponse(Pessoa pessoa)
    {
        return new PessoaResponse(pessoa.Id, pessoa.Nome, pessoa.Idade);
    }
}
