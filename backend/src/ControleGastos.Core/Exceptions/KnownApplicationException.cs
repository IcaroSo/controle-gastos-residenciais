namespace ControleGastos.Core.Exceptions;

public abstract class KnownApplicationException : Exception
{
    protected KnownApplicationException(string code, string message)
        : base(message)
    {
        Code = code;
    }

    public string Code { get; }
}
