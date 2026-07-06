# Frontend

Este é o lado web do Controle de Gastos Residenciais. Ele cuida das telas de pessoas, transações e totais, conversando com a API do backend.

A aplicação foi feita para ser direta: cadastrar uma pessoa, registrar receitas ou despesas e enxergar os totais sem precisar navegar por muitos lugares.

## Como rodar

Dentro da pasta `frontend`:

```bash
cp .env.example .env
npm install
npm run dev
```

No Windows PowerShell, se preferir:

```powershell
Copy-Item .env.example .env
```

Depois acesse:

```text
http://localhost:5173
```

O arquivo `.env.example` já aponta para a API local:

```text
VITE_API_URL=http://localhost:5000/api
```

Para validar o frontend:

```bash
npm run lint
npm run build
npm run test -- --run
```

## Telas

A aplicação usa React Router e tem três rotas principais:

```text
/pessoas
/transacoes
/totais
```

`/pessoas` é onde a pessoa é cadastrada, listada e excluída. A exclusão pede confirmação e deixa claro que as transações vinculadas também serão apagadas.

`/transacoes` é onde entram receitas e despesas. A tela carrega as pessoas, permite escolher uma delas e registra a transação. Se a pessoa escolhida tiver menos de 18 anos, a opção de receita fica bloqueada antes mesmo de enviar para a API.

`/totais` mostra o resumo por pessoa e o total geral. Os valores são exibidos em reais usando a formatação brasileira.

## Organização do código

As páginas ficam em `src/pages`. Elas montam a experiência da tela, mas tentam não carregar detalhes demais de chamada HTTP ou transformação de erro.

Os hooks em `src/hooks` concentram o estado de cada fluxo:

```text
usePessoas
useTransacoes
useTotais
```

O serviço em `src/services/api.ts` centraliza o `fetch`, monta a URL base com `VITE_API_URL` e transforma erros da API em um formato mais fácil de usar na tela.

Os tipos compartilhados com a API ficam em `src/types/api.ts`, e formatações simples, como moeda e mensagens de erro, ficam em `src/utils/formatters.ts`.

## Decisões do frontend

O projeto não usa Redux, Zustand ou React Query porque o estado ainda é pequeno. Cada tela tem um fluxo bem definido, então hooks locais deixam o código mais simples de seguir.

A API continua sendo a fonte da verdade. O frontend bloqueia receita para menor de idade para dar um retorno mais rápido ao usuário, mas a regra também existe no backend. Se alguém chamar a API direto, a validação continua valendo.

O `fetch` nativo foi mantido, mas encapsulado. Assim, as páginas não precisam repetir montagem de URL, headers, JSON e tratamento de erro.

Tailwind entra para resolver estilo com pouco atrito. A UI fica em componentes simples, com estados de carregamento, vazio, sucesso e erro aparecendo perto da ação do usuário.

## Docker e Nginx

No Docker, o frontend é compilado com:

```text
VITE_API_URL=/api
```

Depois o Nginx serve os arquivos estáticos e encaminha chamadas de `/api/` para a API no container `api`.

O fluxo fica assim:

```text
Browser -> Nginx -> API
```

Isso evita depender de uma URL fixa da API dentro do build de produção.

## Testes

Hoje os testes cobrem os pontos mais importantes da interface:

```text
src/pages/PessoasPage.test.tsx
src/pages/TransacoesPage.test.tsx
```

Eles verificam a mensagem de confirmação ao excluir pessoa com cascade e o bloqueio de receita para pessoa menor de idade. São testes pequenos, mas focados nas regras que mais podem causar confusão para quem usa a tela.
