using ControleGastos.Core.Enums;
using ControleGastos.Core.Exceptions;

namespace ControleGastos.Core.Entities;

public sealed class Transacao
{
    private Transacao()
    {
        Descricao = string.Empty;
    }

    public Transacao(string descricao, long valorEmCentavos, TipoTransacao tipo, Guid pessoaId)
        : this(Guid.NewGuid(), descricao, valorEmCentavos, tipo, pessoaId)
    {
    }

    public Transacao(Guid id, string descricao, long valorEmCentavos, TipoTransacao tipo, Guid pessoaId)
    {
        if (id == Guid.Empty)
        {
            throw new DomainValidationException("transaction_id_required", "O identificador da transacao deve ser preenchido.");
        }

        Id = id;
        Descricao = NormalizarDescricao(descricao);
        ValorEmCentavos = ValidarValor(valorEmCentavos);
        Tipo = ValidarTipo(tipo);
        PessoaId = ValidarPessoaId(pessoaId);
    }

    public Guid Id { get; private set; }

    public string Descricao { get; private set; }

    public long ValorEmCentavos { get; private set; }

    public TipoTransacao Tipo { get; private set; }

    public Guid PessoaId { get; private set; }

    public Pessoa? Pessoa { get; private set; }

    private static string NormalizarDescricao(string? descricao)
    {
        var descricaoNormalizada = descricao?.Trim() ?? string.Empty;

        if (descricaoNormalizada.Length < 2)
        {
            throw new DomainValidationException("transaction_description_invalid", "A descricao deve possuir pelo menos 2 caracteres.");
        }

        if (descricaoNormalizada.Length > 200)
        {
            throw new DomainValidationException("transaction_description_invalid", "A descricao deve possuir no maximo 200 caracteres.");
        }

        return descricaoNormalizada;
    }

    private static long ValidarValor(long valorEmCentavos)
    {
        if (valorEmCentavos <= 0)
        {
            throw new DomainValidationException("transaction_amount_invalid", "O valor deve ser maior que zero.");
        }

        return valorEmCentavos;
    }

    private static TipoTransacao ValidarTipo(TipoTransacao tipo)
    {
        if (!Enum.IsDefined(tipo))
        {
            throw new DomainValidationException("transaction_type_invalid", "O tipo da transacao deve ser Receita ou Despesa.");
        }

        return tipo;
    }

    private static Guid ValidarPessoaId(Guid pessoaId)
    {
        if (pessoaId == Guid.Empty)
        {
            throw new DomainValidationException("person_id_required", "O identificador da pessoa deve ser preenchido.");
        }

        return pessoaId;
    }
}
