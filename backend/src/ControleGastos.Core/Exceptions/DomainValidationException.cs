namespace ControleGastos.Core.Exceptions;

public sealed class DomainValidationException : KnownApplicationException
{
    public DomainValidationException(string code, string message)
        : base(code, message)
    {
    }
}
