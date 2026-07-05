using ControleGastos.Core.Exceptions;

namespace ControleGastos.Core.Models;

public static class MoneyConverter
{
    public static long ToCentavos(decimal valor)
    {
        if (valor <= 0)
        {
            throw new DomainValidationException("transaction_amount_invalid", "O valor deve ser maior que zero.");
        }

        var valorEscalado = valor * 100m;
        if (decimal.Truncate(valorEscalado) != valorEscalado)
        {
            throw new DomainValidationException("transaction_amount_precision_invalid", "O valor deve possuir no maximo duas casas decimais.");
        }

        try
        {
            return checked((long)valorEscalado);
        }
        catch (OverflowException)
        {
            throw new DomainValidationException("transaction_amount_invalid", "O valor informado excede o limite suportado.");
        }
    }

    public static decimal FromCentavos(long valorEmCentavos)
    {
        return valorEmCentavos / 100m;
    }
}
