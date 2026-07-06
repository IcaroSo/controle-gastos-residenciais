using ControleGastos.Core.Exceptions;
using ControleGastos.Core.Models;

namespace ControleGastos.UnitTests;

public sealed class MoneyConverterTests
{
    [Theory]
    [InlineData("125.90", 12590)]
    [InlineData("1", 100)]
    [InlineData("0.01", 1)]
    public void Deve_converter_decimal_para_centavos(string valor, long esperado)
    {
        var resultado = MoneyConverter.ToCentavos(decimal.Parse(valor, System.Globalization.CultureInfo.InvariantCulture));

        Assert.Equal(esperado, resultado);
    }

    [Theory]
    [InlineData("0")]
    [InlineData("-1")]
    public void Deve_rejeitar_valor_zero_ou_negativo(string valor)
    {
        var exception = Assert.Throws<DomainValidationException>(
            () => MoneyConverter.ToCentavos(decimal.Parse(valor, System.Globalization.CultureInfo.InvariantCulture)));

        Assert.Equal("transaction_amount_invalid", exception.Code);
    }

    [Fact]
    public void Deve_rejeitar_mais_de_duas_casas_decimais()
    {
        var exception = Assert.Throws<DomainValidationException>(() => MoneyConverter.ToCentavos(10.999m));

        Assert.Equal("transaction_amount_precision_invalid", exception.Code);
    }

    [Fact]
    public void Deve_converter_centavos_para_decimal()
    {
        Assert.Equal(125.90m, MoneyConverter.FromCentavos(12590));
        Assert.Equal(-10.50m, MoneyConverter.FromCentavos(-1050));
    }
}
