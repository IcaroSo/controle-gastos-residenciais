using System;
using ControleGastos.Infrastructure.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ControleGastos.Infrastructure.Migrations;

[DbContext(typeof(AppDbContext))]
[Migration("20260704220000_InitialCreate")]
public partial class InitialCreate : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "Pessoas",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "TEXT", nullable: false),
                Nome = table.Column<string>(type: "TEXT", maxLength: 120, nullable: false),
                Idade = table.Column<int>(type: "INTEGER", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Pessoas", x => x.Id);
            });

        migrationBuilder.CreateTable(
            name: "Transacoes",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "TEXT", nullable: false),
                Descricao = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                ValorEmCentavos = table.Column<long>(type: "INTEGER", nullable: false),
                Tipo = table.Column<int>(type: "INTEGER", nullable: false),
                PessoaId = table.Column<Guid>(type: "TEXT", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Transacoes", x => x.Id);
                table.ForeignKey(
                    name: "FK_Transacoes_Pessoas_PessoaId",
                    column: x => x.PessoaId,
                    principalTable: "Pessoas",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateIndex(
            name: "IX_Transacoes_PessoaId",
            table: "Transacoes",
            column: "PessoaId");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(name: "Transacoes");
        migrationBuilder.DropTable(name: "Pessoas");
    }
}
