## 🌐 Demo

**[👉 Acesse o projeto em produção](https://spotify-app-self.vercel.app/artists/0xRXCcSX89eobfrshSVdyu)**

## 🚀 Tecnologias

Este projeto foi desenvolvido com as seguintes tecnologias:

### Core
- **[React 19](https://react.dev/)** - Biblioteca JavaScript para construção de interfaces
- **[TypeScript](https://www.typescriptlang.org/)** - Superset JavaScript com tipagem estática
- **[Vite](https://vite.dev/)** (Rolldown) - Build tool e dev server

### Roteamento e Estado
- **[TanStack Router](https://tanstack.com/router)** - Roteador type-safe com file-based routing
- **[TanStack Query](https://tanstack.com/query)** - Gerenciamento de estado server-side com cache inteligente
- **[nuqs](https://nuqs.47ng.com/)** - Type-safe search params state management

### UI e Estilização
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Framework CSS utility-first
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes reutilizáveis e acessíveis
- **[Radix UI](https://www.radix-ui.com/)** - Primitivos de UI não estilizados e acessíveis
- **[Lucide React](https://lucide.dev/)** - Biblioteca de ícones

### Formulários e Validação
- **[React Hook Form](https://react-hook-form.com/)** - Formulários performáticos e flexíveis
- **[Zod](https://zod.dev/)** - Schema validation TypeScript-first

### Dados e Visualização
- **[TanStack Table](https://tanstack.com/table)** - Tabelas headless e poderosas
- **[Recharts](https://recharts.org/)** - Biblioteca de gráficos para React

### Internacionalização
- **[i18next](https://www.i18next.com/)** - Framework de internacionalização
- **[react-i18next](https://react.i18next.com/)** - Plugin React para i18next

### Qualidade de Código
- **[Biome](https://biomejs.dev/)** - Linter e formatter ultra-rápido
- **[Babel React Compiler](https://react.dev/learn/react-compiler)** - Compilador experimental do React

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado em sua máquina:

- **[Node.js](https://nodejs.org/)** (versão 18 ou superior)
- **[pnpm](https://pnpm.io/)** (gerenciador de pacotes recomendado)

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd kanastra
```

2. Instale as dependências:
```bash
pnpm install
```

## ⚙️ Configuração

### Variáveis de Ambiente

O projeto utiliza variáveis de ambiente para configurar a API do Spotify. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Spotify API Credentials
VITE_SPOTIFY_CLIENT_ID=seu_client_id_aqui
VITE_SPOTIFY_CLIENT_SECRET=seu_client_secret_aqui

# Spotify API Base URL
VITE_BASE_SPOTIFY_URL=https://api.spotify.com/v1
```

### Como obter as credenciais do Spotify

1. Acesse o [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Faça login com sua conta Spotify
3. Clique em "Create app" para criar uma nova aplicação
4. Preencha os dados obrigatórios:
   - **App name**: Nome da sua aplicação
   - **App description**: Descrição da aplicação
   - **Redirect URI**: `http://localhost:5173` (para desenvolvimento local)
5. Após criar, você terá acesso ao **Client ID** e **Client Secret**
6. Copie essas credenciais para o arquivo `.env`

## 🎯 Scripts Disponíveis

```bash
# Iniciar servidor de desenvolvimento
pnpm dev

# Criar build de produção
pnpm build
```

## 📁 Estrutura do Projeto

```
src/
├── assets/              # Arquivos estáticos
├── components/          # Componentes React
│   ├── core/           # Componentes principais (Header, LanguageSwitcher)
│   └── ui/             # Componentes do shadcn/ui
├── constants/          # Constantes da aplicação
├── hooks/              # Hooks customizados
├── i18n/               # Configuração de internacionalização
│   └── locales/        # Arquivos de tradução (pt, en)
├── lib/                # Utilitários e configurações
├── pages/              # Páginas da aplicação
│   ├── artists/        # Listagem de artistas
│   ├── artistDetails/  # Detalhes do artista
│   └── favorites/      # Gerenciamento de favoritos
├── routers/            # Definição de rotas (file-based)
├── types/              # Definições de tipos TypeScript
└── utils/              # Funções utilitárias
```
