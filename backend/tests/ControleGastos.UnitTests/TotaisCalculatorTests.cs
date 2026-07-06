using ControleGastos.Core.Enums;
using ControleGastos.Core.Models;
using ControleGastos.Core.Services;

namespace ControleGastos.UnitTests;

public sealed class TotaisCalculatorTests
{
    [Fact]
    public void Deve_retornar_lista_vazia_e_total_zerado_quando_nao_houver_pessoas()
    {
        var resultado = TotaisCalculator.Calcular([], []);

        Assert.Empty(resultado.Pessoas);
        Assert.Equal(0, resultado.TotalGeral.TotalReceitasEmCentavos);
        Assert.Equal(0, resultado.TotalGeral.TotalDespesasEmCentavos);
        Assert.Equal(0, resultado.TotalGeral.SaldoEmCentavos);
    }

    [Fact]
    public void Deve_calcular_totais_positivos_negativos_zerados_e_multiplas_pessoas()
    {
        var pessoaComSaldoPositivo = Guid.NewGuid();
        var pessoaComSaldoNegativo = Guid.NewGuid();
        var pessoaSemTransacao = Guid.NewGuid();

        var resultado = TotaisCalculator.Calcular(
            [
                new PessoaResumo(pessoaComSaldoPositivo, "Ana"),
                new PessoaResumo(pessoaComSaldoNegativo, "Bruno"),
                new PessoaResumo(pessoaSemTransacao, "Clara")
            ],
            [
                new TransacaoAgregadoResultado(pessoaComSaldoPositivo, TipoTransacao.Receita, 10000),
                new TransacaoAgregadoResultado(pessoaComSaldoPositivo, TipoTransacao.Despesa, 2000),
                new TransacaoAgregadoResultado(pessoaComSaldoNegativo, TipoTransacao.Despesa, 5000)
            ]);

        var ana = Assert.Single(resultado.Pessoas, pessoa => pessoa.PessoaId == pessoaComSaldoPositivo);
        Assert.Equal(10000, ana.TotalReceitasEmCentavos);
        Assert.Equal(2000, ana.TotalDespesasEmCentavos);
        Assert.Equal(8000, ana.SaldoEmCentavos);

        var bruno = Assert.Single(resultado.Pessoas, pessoa => pessoa.PessoaId == pessoaComSaldoNegativo);
        Assert.Equal(0, bruno.TotalReceitasEmCentavos);
        Assert.Equal(5000, bruno.TotalDespesasEmCentavos);
        Assert.Equal(-5000, bruno.SaldoEmCentavos);

        var clara = Assert.Single(resultado.Pessoas, pessoa => pessoa.PessoaId == pessoaSemTransacao);
        Assert.Equal(0, clara.TotalReceitasEmCentavos);
        Assert.Equal(0, clara.TotalDespesasEmCentavos);
        Assert.Equal(0, clara.SaldoEmCentavos);

        Assert.Equal(10000, resultado.TotalGeral.TotalReceitasEmCentavos);
        Assert.Equal(7000, resultado.TotalGeral.TotalDespesasEmCentavos);
        Assert.Equal(3000, resultado.TotalGeral.SaldoEmCentavos);
    }
}
