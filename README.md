# Controle de Gastos Residenciais

Este projeto é uma aplicação simples para organizar gastos de casa. Ele tem uma API em .NET, uma interface em React e usa SQLite para guardar os dados.

Este README é só para colocar o projeto de pé. Os detalhes de cada parte ficam nos READMEs dos módulos:

- [Backend](backend/README.md)
- [Frontend](frontend/README.md)

## Antes de começar

Para rodar com Docker, você precisa de:

- Docker
- Docker Compose

Para rodar sem Docker, você precisa de:

- .NET SDK 10
- Node.js 20 ou mais recente
- npm
- ferramenta `dotnet-ef`, caso queira aplicar migrations manualmente

## Rodando com Docker

Da raiz do projeto, rode:

```bash
docker compose up --build
```

Quando tudo terminar de subir, acesse:

```text
Frontend: http://localhost:3000
API:      http://localhost:5000
Swagger:  http://localhost:5000/swagger
Health:   http://localhost:5000/health
```

O banco SQLite fica em um volume do Docker chamado `controle-gastos-data`. Você pode parar os containers sem perder os dados com:

```bash
docker compose down
```

Se quiser apagar tudo, inclusive o banco:

```bash
docker compose down -v
```

## Rodando localmente

Abra um terminal para o backend e rode, a partir da raiz:

```bash
dotnet restore backend/ControleGastos.sln
dotnet build backend/ControleGastos.sln
dotnet ef database update --project backend/src/ControleGastos.Infrastructure --startup-project backend/src/ControleGastos.Api
dotnet run --project backend/src/ControleGastos.Api --urls http://localhost:5000
```

Depois, em outro terminal, suba o frontend:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

No Windows PowerShell, se preferir, troque o `cp` por:

```powershell
Copy-Item .env.example .env
```

Com isso, a aplicação fica em:

```text
Frontend: http://localhost:5173
API:      http://localhost:5000
Swagger:  http://localhost:5000/swagger
```

## Testando

Backend:

```bash
dotnet restore backend/ControleGastos.sln
dotnet build backend/ControleGastos.sln --no-restore
dotnet test backend/ControleGastos.sln --no-build
```

Frontend:

```bash
cd frontend
npm install
npm run lint
npm run build
npm run test -- --run
```

Docker:

```bash
docker compose config
docker compose up --build -d
docker compose ps
docker compose down
```

## Um teste rápido pela tela

Depois que o projeto estiver no ar, dá para conferir o básico assim:

1. Cadastre uma pessoa adulta.
2. Cadastre uma receita para essa pessoa.
3. Cadastre uma pessoa menor de 18 anos.
4. Tente cadastrar uma receita para a pessoa menor de idade.
5. Veja se a tela bloqueia essa receita e permite apenas despesa.
6. Abra a tela de totais e confira os valores.
7. Exclua uma pessoa com transações e veja se os lançamentos dela também somem.

## Variáveis de ambiente

O exemplo principal está em [.env.example](.env.example).

As variáveis mais usadas são:

```text
ConnectionStrings__DefaultConnection
Database__ApplyMigrationsOnStartup
Cors__AllowedOrigins__0
VITE_API_URL
```

No Docker, o Compose já passa o que a API e o frontend precisam. Rodando localmente, o frontend usa `frontend/.env`, e a API usa os valores de `appsettings.json` ou variáveis de ambiente.
