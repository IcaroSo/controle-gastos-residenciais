# Backend

Este é o lado da API do Controle de Gastos Residenciais. Ele recebe os cadastros feitos pela tela, aplica as regras do sistema, salva tudo em SQLite e devolve os dados que o frontend precisa mostrar.

A ideia aqui foi manter o backend pequeno, mas com uma separação clara entre regra de negócio, banco de dados e HTTP. Assim fica mais fácil entender onde mexer quando uma regra muda.

## Como rodar

Da raiz do projeto:

```bash
dotnet restore backend/ControleGastos.sln
dotnet build backend/ControleGastos.sln
dotnet ef database update --project backend/src/ControleGastos.Infrastructure --startup-project backend/src/ControleGastos.Api
dotnet run --project backend/src/ControleGastos.Api --urls http://localhost:5000
```

Enquanto desenvolve, estes endereços ajudam bastante:

```text
API:     http://localhost:5000
Swagger: http://localhost:5000/swagger
Health:  http://localhost:5000/health
```

Para rodar os testes:

```bash
dotnet test backend/ControleGastos.sln
```

## Onde cada coisa fica

O backend está dividido em três projetos:

```text
ControleGastos.Core
ControleGastos.Infrastructure
ControleGastos.Api
```

O `Core` guarda o que é regra do sistema: pessoas, transações, cálculo de totais, validações e contratos de repositório. Ele não sabe nada sobre ASP.NET, EF Core ou SQLite. Isso deixa as regras menos presas a ferramenta.

O `Infrastructure` é a parte que conversa com o banco. Ali ficam o `DbContext`, os mapeamentos do EF Core, as migrations e as implementações dos repositórios.

O `Api` é a entrada HTTP. Ele configura controllers, Swagger, CORS, health check, tratamento de erro e injeção de dependências.

Em termos de dependência, o desenho é este:

```text
Api -> Core
Api -> Infrastructure
Infrastructure -> Core
Core -> nada externo
```

## Regras principais

Pessoa tem nome e idade. O nome é aparado antes de salvar, precisa ter pelo menos 2 caracteres e não pode passar de 120. A idade fica entre 0 e 130.

Transação tem descrição, valor, tipo e pessoa vinculada. O valor precisa ser positivo e ter no máximo duas casas decimais. A descrição também é aparada e precisa ter tamanho mínimo.

A regra mais importante do sistema é a de menor de idade: pessoa com menos de 18 anos só pode ter despesa. Receita para menor é rejeitada pela API.

Quando uma pessoa é excluída, as transações dela também são removidas. Essa escolha está refletida no relacionamento do banco com cascade.

## Dinheiro

A API recebe dinheiro como decimal:

```json
{ "valor": 125.90 }
```

No banco, o valor é salvo em centavos:

```text
125.90 -> 12590
```

Foi feito assim para evitar problemas comuns de arredondamento em soma de valores monetários. O `MoneyConverter` centraliza essa conversão, valida as casas decimais e devolve decimal de novo nas respostas.

## Banco de dados

Localmente, a connection string padrão é:

```text
Data Source=./data/controle-gastos.db;Foreign Keys=True
```

No Docker, ela muda para:

```text
Data Source=/app/data/controle-gastos.db;Foreign Keys=True
```

O `Foreign Keys=True` é importante no SQLite porque garante que o cascade funcione de verdade.

As migrations ficam versionadas em:

```text
src/ControleGastos.Infrastructure/Migrations/
```

No Docker, a API aplica migrations ao iniciar. Rodando localmente, você pode fazer isso manualmente com `dotnet ef database update`.

## Endpoints

A base da API é `/api`.

```text
POST   /api/pessoas
GET    /api/pessoas
DELETE /api/pessoas/{id}

POST   /api/transacoes
GET    /api/transacoes

GET    /api/totais
GET    /health
```

O Swagger fica em `/swagger`.

## Erros

O backend tenta devolver erros previsíveis, em vez de jogar uma mensagem solta para a tela. Validações e regras conhecidas viram `ProblemDetails` ou `ValidationProblemDetails`.

Alguns códigos usados:

```text
validation_failed
person_not_found
minor_income_not_allowed
unexpected_error
```

Isso ajuda o frontend a exibir uma mensagem melhor sem precisar adivinhar o que aconteceu.

## Testes

Tem testes unitários para as regras de domínio, conversão de dinheiro e cálculo de totais. Também existem testes de integração com `WebApplicationFactory` e SQLite em arquivo temporário, para pegar o fluxo mais perto do uso real.

Os testes de integração cobrem criação, listagem, pessoa inexistente, regra de menor de idade, cascade e totais persistidos.

## Docker

O `backend/Dockerfile` usa build em duas etapas: primeiro compila e publica com a imagem SDK do .NET, depois roda com a imagem de runtime ASP.NET. Dentro do container, a API escuta na porta `8080`; no `docker-compose.yml`, ela aparece para a máquina na porta `5000`.
