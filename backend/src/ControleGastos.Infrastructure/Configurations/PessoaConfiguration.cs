using ControleGastos.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ControleGastos.Infrastructure.Configurations;

public sealed class PessoaConfiguration : IEntityTypeConfiguration<Pessoa>
{
    public void Configure(EntityTypeBuilder<Pessoa> builder)
    {
        builder.ToTable("Pessoas");

        builder.HasKey(pessoa => pessoa.Id);

        builder.Property(pessoa => pessoa.Nome)
            .HasMaxLength(120)
            .IsRequired();

        builder.Property(pessoa => pessoa.Idade)
            .IsRequired();

        builder.Navigation(pessoa => pessoa.Transacoes)
            .UsePropertyAccessMode(PropertyAccessMode.Field);
    }
}
