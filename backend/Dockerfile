FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY Directory.Build.props ./Directory.Build.props
COPY backend/ControleGastos.sln ./backend/ControleGastos.sln
COPY backend/src/ControleGastos.Api/ControleGastos.Api.csproj ./backend/src/ControleGastos.Api/
COPY backend/src/ControleGastos.Core/ControleGastos.Core.csproj ./backend/src/ControleGastos.Core/
COPY backend/src/ControleGastos.Infrastructure/ControleGastos.Infrastructure.csproj ./backend/src/ControleGastos.Infrastructure/
COPY backend/tests/ControleGastos.UnitTests/ControleGastos.UnitTests.csproj ./backend/tests/ControleGastos.UnitTests/
COPY backend/tests/ControleGastos.IntegrationTests/ControleGastos.IntegrationTests.csproj ./backend/tests/ControleGastos.IntegrationTests/

RUN dotnet restore backend/ControleGastos.sln

COPY backend ./backend
WORKDIR /src/backend/src/ControleGastos.Api
RUN dotnet publish -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /app/data

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "ControleGastos.Api.dll"]
