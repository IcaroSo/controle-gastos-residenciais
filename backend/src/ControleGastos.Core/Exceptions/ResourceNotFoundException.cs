namespace ControleGastos.Core.Exceptions;

public sealed class ResourceNotFoundException : KnownApplicationException
{
    public ResourceNotFoundException(string code, string message)
        : base(code, message)
    {
    }
}
