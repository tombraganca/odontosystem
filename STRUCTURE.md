# Estrutura do Frontend - Odonto System

## 📁 Estrutura de Pastas

```
src/
├── components/           # Componentes reutilizáveis
│   ├── ui/              # Componentes básicos de interface (Shadcn UI)
│   └── layout/          # Componentes de layout (sidebar, navbar, etc)
├── pages/               # Páginas da aplicação (TanStack Router)
│   ├── _auth/          # Páginas de autenticação
│   ├── _app/           # Páginas do sistema (protegidas)
│   └── __root.tsx      # Layout raiz
├── services/            # Serviços de API e integrações
├── context/             # Contextos React
├── hooks/               # Hooks customizados
├── types/               # Tipos e interfaces TypeScript
├── constants/           # Constantes globais
├── lib/                 # Utilitários
├── integrations/        # Integrações externas
├── assets/              # Arquivos estáticos
└── config.ts           # Configurações globais
```

## 🚀 Principais Melhorias

### 1. **Serviços Organizados**
- `services/api.ts`: Instância configurada do Axios
- `services/auth.ts`: Serviços de autenticação
- `services/users.ts`: Serviços de usuários
- Interceptors para token automático e tratamento de erros

### 2. **Tipagem Completa**
- `types/index.ts`: Interfaces globais
- Tipagem forte para API responses
- Melhor IntelliSense e detecção de erros

### 3. **Configurações Centralizadas**
- `config.ts`: URLs, timeouts, configurações globais
- `constants/routes.ts`: Rotas da aplicação e API
- Fácil manutenção e alteração

### 4. **Hooks Customizados**
- `hooks/useAuth.ts`: Guards de autenticação
- Reutilização de lógica comum
- Melhor organização do estado

### 5. **Estrutura de Layout**
- `components/layout/`: Componentes de layout organizados
- Separação clara entre UI e layout

## 📋 Próximos Passos

1. ✅ Reorganizar estrutura de pastas
2. ✅ Configurar serviços de API com Axios
3. ✅ Implementar tipagem TypeScript
4. ✅ Criar hooks customizados
5. ⏳ Migrar componentes para nova estrutura
6. ⏳ Implementar testes unitários
7. ⏳ Adicionar documentação de componentes

## 🔧 Configurações

- **Biome**: Formatação com semicolons "asNeeded"
- **TanStack Router**: File-based routing
- **Axios**: Interceptors para autenticação
- **TypeScript**: Tipagem forte em toda aplicação
