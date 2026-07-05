namespace ControleGastos.Core.Exceptions;

public sealed class BusinessRuleException : KnownApplicationException
{
    public BusinessRuleException(string code, string message)
        : base(code, message)
    {
    }
}
