using System;
using ControleGastos.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;

#nullable disable

namespace ControleGastos.Infrastructure.Migrations;

[DbContext(typeof(AppDbContext))]
partial class AppDbContextModelSnapshot : ModelSnapshot
{
    protected override void BuildModel(ModelBuilder modelBuilder)
    {
        modelBuilder
            .HasAnnotation("ProductVersion", "10.0.9");

        modelBuilder.Entity("ControleGastos.Core.Entities.Pessoa", b =>
        {
            b.Property<Guid>("Id")
                .ValueGeneratedNever()
                .HasColumnType("TEXT");

            b.Property<int>("Idade")
                .HasColumnType("INTEGER");

            b.Property<string>("Nome")
                .IsRequired()
                .HasMaxLength(120)
                .HasColumnType("TEXT");

            b.HasKey("Id");

            b.ToTable("Pessoas", (string)null);
        });

        modelBuilder.Entity("ControleGastos.Core.Entities.Transacao", b =>
        {
            b.Property<Guid>("Id")
                .ValueGeneratedNever()
                .HasColumnType("TEXT");

            b.Property<string>("Descricao")
                .IsRequired()
                .HasMaxLength(200)
                .HasColumnType("TEXT");

            b.Property<Guid>("PessoaId")
                .HasColumnType("TEXT");

            b.Property<int>("Tipo")
                .HasColumnType("INTEGER");

            b.Property<long>("ValorEmCentavos")
                .HasColumnType("INTEGER");

            b.HasKey("Id");

            b.HasIndex("PessoaId");

            b.ToTable("Transacoes", (string)null);
        });

        modelBuilder.Entity("ControleGastos.Core.Entities.Transacao", b =>
        {
            b.HasOne("ControleGastos.Core.Entities.Pessoa", "Pessoa")
                .WithMany("Transacoes")
                .HasForeignKey("PessoaId")
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();

            b.Navigation("Pessoa");
        });

        modelBuilder.Entity("ControleGastos.Core.Entities.Pessoa", b =>
        {
            b.Navigation("Transacoes");
        });
    }
}
