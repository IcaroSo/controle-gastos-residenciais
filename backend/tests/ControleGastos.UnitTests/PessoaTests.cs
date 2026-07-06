using ControleGastos.Core.Entities;
using ControleGastos.Core.Exceptions;

namespace ControleGastos.UnitTests;

public sealed class PessoaTests
{
    [Fact]
    public void Deve_criar_pessoa_valida_com_nome_normalizado()
    {
        var pessoa = new Pessoa(" Maria Silva ", 30);

        Assert.NotEqual(Guid.Empty, pessoa.Id);
        Assert.Equal("Maria Silva", pessoa.Nome);
        Assert.Equal(30, pessoa.Idade);
    }

    [Fact]
    public void Deve_rejeitar_nome_vazio()
    {
        var exception = Assert.Throws<DomainValidationException>(() => new Pessoa("   ", 30));

        Assert.Equal("person_name_invalid", exception.Code);
    }

    [Theory]
    [InlineData(-1)]
    [InlineData(131)]
    public void Deve_rejeitar_idade_invalida(int idade)
    {
        var exception = Assert.Throws<DomainValidationException>(() => new Pessoa("Maria", idade));

        Assert.Equal("person_age_invalid", exception.Code);
    }
}
