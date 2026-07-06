using ControleGastos.Core.Entities;
using ControleGastos.Core.Exceptions;
using ControleGastos.Core.Interfaces;

namespace ControleGastos.Core.Services;

public sealed class PessoaService
{
    private readonly IPessoaRepository _pessoaRepository;

    public PessoaService(IPessoaRepository pessoaRepository)
    {
        _pessoaRepository = pessoaRepository;
    }

    public Task<IReadOnlyList<Pessoa>> ListarAsync(CancellationToken cancellationToken)
    {
        return _pessoaRepository.ListarAsync(cancellationToken);
    }

    public Task<Pessoa> CriarAsync(string nome, int idade, CancellationToken cancellationToken)
    {
        var pessoa = new Pessoa(nome, idade);
        return _pessoaRepository.AdicionarAsync(pessoa, cancellationToken);
    }

    public async Task ExcluirAsync(Guid id, CancellationToken cancellationToken)
    {
        var excluida = await _pessoaRepository.ExcluirAsync(id, cancellationToken);
        if (!excluida)
        {
            throw new ResourceNotFoundException("person_not_found", "Pessoa nao encontrada.");
        }
    }
}
