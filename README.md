# 🚀 Tecnologias

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

### Spotify API

Este projeto utiliza a API do Spotify. Você precisa configurar as credenciais da API:

1. Acesse o [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Crie uma nova aplicação
3. Configure as variáveis de ambiente necessárias no arquivo de autenticação

## 🎯 Scripts Disponíveis

```bash
# Iniciar servidor de desenvolvimento
pnpm dev

# Criar build de produção
pnpm build

# Visualizar build de produção
pnpm preview

# Executar linter
pnpm lint
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
