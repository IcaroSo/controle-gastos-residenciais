using ControleGastos.Core.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastos.Api.Middleware;

public sealed class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (KnownApplicationException ex)
        {
            await WriteKnownProblemAsync(context, ex);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro inesperado ao processar a requisicao.");
            await WriteUnexpectedProblemAsync(context);
        }
    }

    private static Task WriteKnownProblemAsync(HttpContext context, KnownApplicationException exception)
    {
        var statusCode = exception is ResourceNotFoundException
            ? StatusCodes.Status404NotFound
            : StatusCodes.Status400BadRequest;

        var title = exception switch
        {
            ResourceNotFoundException => "Recurso nao encontrado",
            BusinessRuleException => "Regra de negocio invalida",
            _ => "Requisicao invalida"
        };

        var problem = new ProblemDetails
        {
            Title = title,
            Status = statusCode,
            Detail = exception.Message,
            Instance = context.Request.Path
        };
        problem.Extensions["code"] = exception.Code;

        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/problem+json";
        return context.Response.WriteAsJsonAsync(problem);
    }

    private static Task WriteUnexpectedProblemAsync(HttpContext context)
    {
        var problem = new ProblemDetails
        {
            Title = "Erro inesperado",
            Status = StatusCodes.Status500InternalServerError,
            Detail = "Nao foi possivel processar a requisicao.",
            Instance = context.Request.Path
        };
        problem.Extensions["code"] = "unexpected_error";

        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        context.Response.ContentType = "application/problem+json";
        return context.Response.WriteAsJsonAsync(problem);
    }
}
