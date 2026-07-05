using ControleGastos.Core.Enums;

namespace ControleGastos.Core.Models;

public sealed record TransacaoAgregadoResultado(Guid PessoaId, TipoTransacao Tipo, long TotalEmCentavos);
