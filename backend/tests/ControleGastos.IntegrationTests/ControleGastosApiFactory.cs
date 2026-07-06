using ControleGastos.Infrastructure.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace ControleGastos.IntegrationTests;

public sealed class ControleGastosApiFactory : WebApplicationFactory<Program>
{
    private readonly bool _deleteDatabaseOnDispose;

    public ControleGastosApiFactory(string? databasePath = null, bool deleteDatabaseOnDispose = true)
    {
        DatabasePath = databasePath ?? Path.Combine(Path.GetTempPath(), $"controle-gastos-{Guid.NewGuid():N}.db");
        _deleteDatabaseOnDispose = deleteDatabaseOnDispose;
    }

    public string DatabasePath { get; }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("IntegrationTests");
        builder.ConfigureAppConfiguration((_, configuration) =>
        {
            configuration.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Database:ApplyMigrationsOnStartup"] = "true",
                ["Cors:AllowedOrigins:0"] = "http://localhost:5173"
            });
        });

        builder.ConfigureServices(services =>
        {
            var connectionString = $"Data Source={DatabasePath};Foreign Keys=True";
            var directory = Path.GetDirectoryName(DatabasePath);
            if (!string.IsNullOrWhiteSpace(directory))
            {
                Directory.CreateDirectory(directory);
            }

            services.RemoveAll<DbContextOptions<AppDbContext>>();
            services.AddDbContext<AppDbContext>(options => options.UseSqlite(connectionString));
        });
    }

    protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);

        if (!_deleteDatabaseOnDispose)
        {
            return;
        }

        SqliteConnection.ClearAllPools();
        DeleteIfExists(DatabasePath);
        DeleteIfExists(DatabasePath + "-shm");
        DeleteIfExists(DatabasePath + "-wal");
    }

    private static void DeleteIfExists(string path)
    {
        if (!File.Exists(path))
        {
            return;
        }

        try
        {
            File.Delete(path);
        }
        catch (IOException)
        {
            // Windows can keep SQLite handles briefly after TestServer disposal; stale temp files are harmless.
        }
    }
}
