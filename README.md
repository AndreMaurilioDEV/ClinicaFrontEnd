# ClinicCenter Front-End

Interface web do **ClinicCenter**, um sistema de gestao clinica criado para centralizar a rotina administrativa de uma clinica: acompanhamento por dashboard, cadastro de pacientes, cadastro de medicos, agendamento de consultas e fluxo de recuperacao de senha.

O projeto foi desenvolvido com foco em uma experiencia clara para equipes administrativas, oferecendo telas objetivas, navegacao simples e integracao com uma API REST em Spring Boot.

## Visao geral

O ClinicCenter permite que a equipe da clinica acompanhe informacoes importantes, gerencie cadastros e organize consultas em um unico ambiente web.

A aplicacao possui:

- area de login;
- dashboard com indicadores;
- gerenciamento de pacientes;
- gerenciamento de medicos/profissionais;
- gerenciamento de consultas;
- visualizacao detalhada de pacientes;
- recuperacao e redefinicao de senha;
- notificacoes visuais para acoes do usuario.

## Principais telas

### Login e autenticacao

Tela de acesso com autenticacao integrada ao back-end. Apos o login, o token JWT e armazenado no navegador e enviado automaticamente nas requisicoes protegidas.

### Dashboard

Painel principal para acompanhamento da clinica, com indicadores e informacoes resumidas para facilitar a leitura rapida da operacao.

### Pacientes

Fluxo para cadastro, listagem e visualizacao detalhada de pacientes, incluindo dados pessoais, contato, endereco, plano de saude e status.

### Medicos e profissionais

Telas para cadastro e listagem de profissionais da clinica, com informacoes como nome, CPF, CRM e especialidade.

### Consultas

Area para listagem e cadastro de consultas, relacionando paciente, medico, data, horario, tipo de atendimento e status.

### Recuperacao de senha

Fluxo de solicitacao, validacao e redefinicao de senha, integrado aos endpoints de autenticacao do back-end.

## Funcionalidades

- Autenticacao com JWT.
- Persistencia do token de acesso no navegador.
- Interceptor de requisicoes com Axios para envio automatico do token.
- Dashboard administrativo.
- Cadastro e listagem de pacientes.
- Detalhamento de paciente.
- Cadastro e listagem de medicos/profissionais.
- Cadastro e listagem de consultas.
- Atualizacao de status de consultas.
- Recuperacao e alteracao de senha.
- Feedback visual com notificacoes.
- Consumo de API REST.
- Organizacao de rotas publicas e autenticadas.

## Tecnologias utilizadas

- React 18
- TypeScript
- Vite
- React Router DOM
- Axios
- React Query
- Material UI
- Material UI Icons
- Chart.js
- React Chart.js 2
- React Bootstrap
- Notistack
- Day.js
- React Datepicker
- React Input Mask
- React OTP Input
- ESLint

## Arquitetura do front-end

```text
src
|-- api/                 # Configuracao da comunicacao com a API
|-- assets/              # Imagens e recursos estaticos
|-- components/          # Componentes reutilizaveis
|-- hooks/               # Hooks e provider de autenticacao
|-- interface/           # Interfaces TypeScript
|-- Layout/              # Estruturas de layout
|-- Outlet/              # Layout principal das rotas internas
|-- pages/               # Paginas da aplicacao
|   |-- AdminPage/
|   |-- ClientePage/
|   |-- ConsultaPages/
|   |-- DashboardPage/
|   |-- LoginPage/
|   |-- ProfissionalPage/
|   |-- SenhaPages/
|-- theme/               # Contexto de tema
|-- themeProvider/       # Provider visual da aplicacao
|-- utils/               # Funcoes auxiliares
|-- App.jsx              # Rotas da aplicacao
|-- main.tsx             # Inicializacao do React
```

## Rotas da aplicacao

### Rotas publicas

| Rota | Descricao |
| --- | --- |
| `/` | Login |
| `/esqueci-senha` | Solicitacao de redefinicao de senha |
| `/verificacao` | Validacao do codigo/token de redefinicao |
| `/redefinir-senha` | Redefinicao de senha |
| `/redefinir-senha-obrigatoria` | Alteracao obrigatoria de senha |

### Rotas internas

| Rota | Descricao |
| --- | --- |
| `/dashboard` | Painel principal |
| `/consultas` | Listagem de consultas |
| `/cadastro-consulta` | Cadastro de consulta |
| `/visualizar-pacientes` | Listagem de pacientes |
| `/cadastro-paciente` | Cadastro de paciente |
| `/visualizar-pacientes-detalhes/:id` | Detalhes do paciente |
| `/visualizar-doutores` | Listagem de medicos/profissionais |
| `/cadastro-doutor` | Cadastro de medico/profissional |

## Integracao com o back-end

Este front-end foi desenvolvido para consumir a API REST do projeto ClinicCenter Back-End, responsavel por autenticacao, persistencia dos dados e regras de negocio.

Principais recursos consumidos:

- login e autenticacao;
- recuperacao e redefinicao de senha;
- pacientes;
- medicos;
- consultas;
- atualizacao de status.

A comunicacao com a API e centralizada em:

```text
src/api/api.ts
```

## Como executar em ambiente de desenvolvimento

> Esta secao e destinada a desenvolvedores que desejam rodar o projeto localmente.

Instale as dependencias:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Gere a versao de producao:

```bash
npm run build
```

Execute uma previa do build:

```bash
npm run preview
```

## Scripts disponiveis

| Comando | Descricao |
| --- | --- |
| `npm run dev` | Inicia o ambiente de desenvolvimento |
| `npm run build` | Gera a versao de producao |
| `npm run lint` | Executa a verificacao com ESLint |
| `npm run preview` | Executa uma previa local do build |

## Status do projeto

Projeto em desenvolvimento, criado como uma aplicacao full stack para gestao clinica, com front-end em React e back-end em Spring Boot.
