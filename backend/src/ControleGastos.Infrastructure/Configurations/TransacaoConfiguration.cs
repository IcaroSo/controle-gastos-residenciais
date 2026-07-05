using ControleGastos.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ControleGastos.Infrastructure.Configurations;

public sealed class TransacaoConfiguration : IEntityTypeConfiguration<Transacao>
{
    public void Configure(EntityTypeBuilder<Transacao> builder)
    {
        builder.ToTable("Transacoes");

        builder.HasKey(transacao => transacao.Id);

        builder.Property(transacao => transacao.Descricao)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(transacao => transacao.ValorEmCentavos)
            .HasColumnType("INTEGER")
            .IsRequired();

        builder.Property(transacao => transacao.Tipo)
            .HasConversion<int>()
            .IsRequired();

        builder.Property(transacao => transacao.PessoaId)
            .IsRequired();

        // O cascade fica no banco: ao excluir a pessoa, o SQLite remove as transacoes relacionadas.
        builder
            .HasOne(transacao => transacao.Pessoa)
            .WithMany(pessoa => pessoa.Transacoes)
            .HasForeignKey(transacao => transacao.PessoaId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
