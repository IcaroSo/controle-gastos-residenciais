# Controle de Gastos Residenciais

Sistema full-stack para cadastro de pessoas, cadastro de transacoes, consulta de totais por pessoa e total geral consolidado, com persistencia em SQLite.

## Funcionalidades

- Criacao, listagem e exclusao de pessoas.
- Criacao e listagem de transacoes.
- Transacoes vinculadas obrigatoriamente a uma pessoa existente.
- Exclusao de pessoa com cascade no banco para transacoes vinculadas.
- Totais por pessoa: receitas, despesas e saldo.
- Total geral: receitas, despesas e saldo liquido.
- Persistencia local e em Docker usando arquivo SQLite.
- Swagger e health check da API.

## Tecnologias

- Back-end: .NET 10, ASP.NET Core Web API com Controllers, EF Core, SQLite, Swagger, xUnit.
- Front-end: React, TypeScript, Vite, React Router, Tailwind CSS, fetch nativo encapsulado, Vitest e React Testing Library.
- Infraestrutura: Docker, Docker Compose, Nginx e volume nomeado para SQLite.

## Arquitetura

```text
backend/
  ControleGastos.sln
  src/
    ControleGastos.Api
    ControleGastos.Core
    ControleGastos.Infrastructure
  tests/
    ControleGastos.UnitTests
    ControleGastos.IntegrationTests
frontend/
  src/
    components/
    hooks/
    pages/
    services/
    types/
    utils/
docker-compose.yml
.env.example
```

Dependencias entre camadas:

- `ControleGastos.Api` usa `Core` e `Infrastructure` apenas para composicao.
- `ControleGastos.Infrastructure` usa `Core`.
- `ControleGastos.Core` nao depende de ASP.NET Core, EF Core ou SQLite.

## Modelo de dados

Pessoa:

- `Id: Guid`, gerado no servidor.
- `Nome: string`, obrigatorio, com `Trim()`, entre 2 e 120 caracteres.
- `Idade: int`, entre 0 e 130.

Transacao:

- `Id: Guid`, gerado no servidor.
- `Descricao: string`, obrigatoria, com `Trim()`, entre 2 e 200 caracteres.
- `ValorEmCentavos: long`, persistido como `INTEGER` no SQLite.
- `Tipo: Receita | Despesa`.
- `PessoaId: Guid`, obrigatorio.

## Regras de negocio

- Menores de 18 anos podem possuir apenas transacoes do tipo `Despesa`.
- Pessoas com exatamente 18 anos podem possuir `Receita` e `Despesa`.
- Pessoa inexistente em transacao retorna `400` com codigo `person_not_found`.
- Receita para menor retorna `400` com codigo `minor_income_not_allowed`.
- Transacoes nao possuem edicao nem exclusao individual.
- Pessoas sem transacao aparecem nos totais com valores zero.
- Sem pessoas, `/api/totais` retorna lista vazia e total geral zerado.

## Estrategia monetaria

A API recebe e retorna dinheiro como `decimal` em JSON:

```json
{ "valor": 125.90 }
```

O banco persiste centavos inteiros:

```text
125.90 -> 12590
```

A conversao fica centralizada em `MoneyConverter`, rejeita valores menores ou iguais a zero, rejeita mais de duas casas decimais e usa conversao `checked` para `long`.

## Endpoints

Base da API: `/api`.

```text
POST   /api/pessoas
GET    /api/pessoas
DELETE /api/pessoas/{id}

POST   /api/transacoes
GET    /api/transacoes

GET    /api/totais
GET    /health
```

Swagger:

```text
http://localhost:5000/swagger
```

## Execucao com Docker

```bash
docker compose up --build
```

Servicos:

- Web: `http://localhost:3000`
- API: `http://localhost:5000`
- Swagger: `http://localhost:5000/swagger`

O Compose usa SQLite em `/app/data/controle-gastos.db` com volume nomeado `controle-gastos-data`. Para parar sem apagar os dados:

```bash
docker compose down
```

Para apagar tambem o volume e o banco:

```bash
docker compose down -v
```

## Execucao sem Docker

Back-end, a partir da raiz:

```bash
dotnet restore backend/ControleGastos.sln
dotnet build backend/ControleGastos.sln
dotnet ef database update \
  --project backend/src/ControleGastos.Infrastructure \
  --startup-project backend/src/ControleGastos.Api
dotnet run --project backend/src/ControleGastos.Api \
  --urls http://localhost:5000
```

Front-end:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

URLs locais:

- Front-end: `http://localhost:5173`
- API: `http://localhost:5000`
- Swagger: `http://localhost:5000/swagger`

## Migrations

A migration inicial versionada esta em:

```text
backend/src/ControleGastos.Infrastructure/Migrations/20260704220000_InitialCreate.cs
```

A aplicacao cria o diretorio do arquivo SQLite antes de abrir conexao. Migrations podem ser aplicadas automaticamente com:

```text
Database__ApplyMigrationsOnStartup=true
```

Aplicacao manual:

```bash
dotnet ef database update \
  --project backend/src/ControleGastos.Infrastructure \
  --startup-project backend/src/ControleGastos.Api
```

`EnsureCreated()` nao e usado como substituto de migrations.

## Variaveis de ambiente

```text
ConnectionStrings__DefaultConnection
Database__ApplyMigrationsOnStartup
Cors__AllowedOrigins__0
VITE_API_URL
```

Valores principais:

```text
Data Source=./data/controle-gastos.db;Foreign Keys=True
Data Source=/app/data/controle-gastos.db;Foreign Keys=True
```

## Testes

Back-end:

```bash
dotnet restore backend/ControleGastos.sln
dotnet build backend/ControleGastos.sln --no-restore
dotnet test backend/ControleGastos.sln --no-build
```

Front-end:

```bash
cd frontend
npm install
npm run lint
npm run build
npm run test -- --run
```

Os testes de integracao usam `WebApplicationFactory` com SQLite em arquivo temporario isolado, nao usam EF InMemory e verificam cascade diretamente no banco.

## Decisoes tecnicas

- Controllers recebem DTOs e nao expõem entidades.
- Regras que dependem de dados ficam em servicos do `Core`.
- A consulta de totais soma `ValorEmCentavos` no banco e combina o resultado com todas as pessoas.
- O front-end usa hooks pequenos por dominio e `fetch` encapsulado em `services/api.ts`.
- O Nginx serve o build estatico e encaminha `/api/` para `http://api:8080/api/`.
- `NuGetAuditLevel` esta configurado como `critical` porque a versao transitiva mais recente disponivel de `SQLitePCLRaw.lib.e_sqlite3` sinaliza alerta alto via EF Core SQLite; dependencias npm de producao foram auditadas sem vulnerabilidades.

## Limitacoes conhecidas

- Nao ha autenticacao ou controle de usuarios.
- Nao ha edicao de pessoas ou transacoes.
- Nao ha categorias, totais por categoria ou relatorios fora do escopo.
- O front-end usa confirmacao nativa do navegador para exclusao.

## Melhorias futuras

- Filtros e paginacao para listas grandes.
- Testes end-to-end no fluxo Docker.
- Exportacao CSV dos totais.
- Modal acessivel customizado para confirmacao de exclusao.
