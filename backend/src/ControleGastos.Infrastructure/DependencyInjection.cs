using ControleGastos.Core.Interfaces;
using ControleGastos.Infrastructure.Data;
using ControleGastos.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ControleGastos.Infrastructure;

public static class DependencyInjection
{
    private const string DefaultConnectionString = "Data Source=./data/controle-gastos.db;Foreign Keys=True";

    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? configuration["Database:ConnectionString"]
            ?? DefaultConnectionString;

        DatabasePath.EnsureDirectory(connectionString);

        services.AddDbContext<AppDbContext>(options =>
        {
            options.UseSqlite(connectionString);
        });

        services.AddScoped<IPessoaRepository, PessoaRepository>();
        services.AddScoped<ITransacaoRepository, TransacaoRepository>();
        services.AddScoped<ITotaisConsultaRepository, TotaisConsultaRepository>();

        return services;
    }
}
