using ControleGastos.Core.Enums;
using ControleGastos.Core.Models;

namespace ControleGastos.Core.Services;

public static class TotaisCalculator
{
    public static TotaisResultado Calcular(
        IReadOnlyList<PessoaResumo> pessoas,
        IReadOnlyList<TransacaoAgregadoResultado> agregados)
    {
        var agregadosPorPessoa = agregados
            .GroupBy(item => item.PessoaId)
            .ToDictionary(
                grupo => grupo.Key,
                grupo => new
                {
                    Receitas = grupo.Where(item => item.Tipo == TipoTransacao.Receita).Sum(item => item.TotalEmCentavos),
                    Despesas = grupo.Where(item => item.Tipo == TipoTransacao.Despesa).Sum(item => item.TotalEmCentavos)
                });

        var pessoasComTotais = pessoas.Select(pessoa =>
        {
            agregadosPorPessoa.TryGetValue(pessoa.PessoaId, out var totais);
            return new PessoaTotalResultado(
                pessoa.PessoaId,
                pessoa.Nome,
                totais?.Receitas ?? 0,
                totais?.Despesas ?? 0);
        }).ToList();

        var totalGeral = new TotalGeralResultado(
            pessoasComTotais.Sum(pessoa => pessoa.TotalReceitasEmCentavos),
            pessoasComTotais.Sum(pessoa => pessoa.TotalDespesasEmCentavos));

        return new TotaisResultado(pessoasComTotais, totalGeral);
    }
}
