using ControleGastos.Core.Enums;
using ControleGastos.Core.Exceptions;

namespace ControleGastos.Core.Entities;

public sealed class Pessoa
{
    private readonly List<Transacao> _transacoes = [];

    private Pessoa()
    {
        Nome = string.Empty;
    }

    public Pessoa(string nome, int idade)
        : this(Guid.NewGuid(), nome, idade)
    {
    }

    public Pessoa(Guid id, string nome, int idade)
    {
        if (id == Guid.Empty)
        {
            throw new DomainValidationException("person_id_required", "O identificador da pessoa deve ser preenchido.");
        }

        Id = id;
        Nome = NormalizarNome(nome);
        Idade = ValidarIdade(idade);
    }

    public Guid Id { get; private set; }

    public string Nome { get; private set; }

    public int Idade { get; private set; }

    public IReadOnlyCollection<Transacao> Transacoes => _transacoes.AsReadOnly();

    public bool PodePossuir(TipoTransacao tipo)
    {
        return tipo == TipoTransacao.Despesa || Idade >= 18;
    }

    private static string NormalizarNome(string? nome)
    {
        var nomeNormalizado = nome?.Trim() ?? string.Empty;

        if (nomeNormalizado.Length < 2)
        {
            throw new DomainValidationException("person_name_invalid", "O nome deve possuir pelo menos 2 caracteres.");
        }

        if (nomeNormalizado.Length > 120)
        {
            throw new DomainValidationException("person_name_invalid", "O nome deve possuir no maximo 120 caracteres.");
        }

        return nomeNormalizado;
    }

    private static int ValidarIdade(int idade)
    {
        if (idade is < 0 or > 130)
        {
            throw new DomainValidationException("person_age_invalid", "A idade deve estar entre 0 e 130 anos.");
        }

        return idade;
    }
}
