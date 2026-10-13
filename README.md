# KwendaBiz Backend 🚀

API backend escalável e robusta desenvolvida para a plataforma **KwendaBiz**, focada na gestão de identidades, negócios e investimentos (ligando empreendedores a investidores).

Este projeto foi desenhado para demonstrar práticas de engenharia de software de nível sênior, com foco em desacoplamento, segurança e testabilidade.

---

## 🎯 Destaques Arquiteturais & Engenharia

* **Domain-Driven Design (DDD) & Arquitetura Hexagonal (Ports & Adapters)**:
  * Domínio 100% puro, sem acoplamento a frameworks, banco de dados ou bibliotecas externas.
  * Regras de negócio orquestradas por Casos de Uso isolados que dependem de portas (interfaces abstratas).
* **Segurança por Design (*Defense in Depth*)**:
  * Separação estrita de *Bounded Contexts* (`Identity` vs `Authentication`): credenciais e hashes criptográficos isolados em tabela própria (`Credential`), prevenindo vazamento acidental de dados em consultas de perfil.
  * Autenticação via JWT, hashing de senhas com Bcrypt e verificação de contactos multi-canal.
* **Validação em Duas Camadas**:
  * **No Domínio**: *Value Objects* (`Email`, `Iban`, `PhoneNumber`, `InvestmentAmount`, `UserRoles`) que garantem invariantes de negócio e auto-validação.
  * **Na Borda HTTP**: Schemas **Zod** integrados via `ZodValidationPipe` customizado no NestJS, devolvendo respostas `400 Bad Request` detalhadas antes de atingir os casos de uso.
* **Modelagem de Dados com PostgreSQL & Prisma**:
  * Enums nativos (`AccountStatus`, `Role`, `VerificationChannel`) mapeados via Prisma para consistência de integridade relacional.
* **Alta Testabilidade**:
  * Testes unitários e de casos de uso rápidos com **Vitest**, executados de forma determinística com repositórios *In-Memory* implementando as portas do domínio.

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologias |
| :--- | :--- |
| **Linguagem & Runtime** | Node.js (ESModules), TypeScript |
| **Framework & HTTP** | NestJS, Express |
| **Arquitetura** | Hexagonal (Ports & Adapters), DDD |
| **Validação** | Zod + Value Objects customizados |
| **Banco de Dados & ORM** | PostgreSQL, Prisma ORM, Docker Compose |
| **Autenticação & Criptografia** | JWT (`@nestjs/jwt`), Bcrypt |
| **Testes & Qualidade** | Vitest, Oxlint |
| **Documentação** | Swagger / OpenAPI |

---

## 📂 Estrutura do Projeto

```text
src/
├── module/
│   ├── identity/          # Bounded Context de Perfis e Permissões
│   ├── authentication/    # Bounded Context de Credenciais, Sessões e Tokens
│   ├── business/          # Bounded Context de Negócios e Contas Bancárias
│   └── investment/        # Bounded Context de Investimentos
│       ├── domain/        # Entidades, Value Objects e Erros de Domínio
│       ├── application/   # Casos de Uso e Portas (Interfaces)
│       └── adapters/      # Inbound (HTTP/Controllers/DTOs) & Outbound (Persistência)
├── shared/                # Classes base DDD (ValueObject, Erros) e Pipes HTTP
└── bootstrap/             # Módulos e inicialização do NestJS
```

---

## ⚡ Como Executar

### 1. Pré-requisitos
* Node.js 20+
* pnpm (`npm install -g pnpm`)
* Docker & Docker Compose

### 2. Instalação e Inicialização
```bash
# Instalar dependências
pnpm install

# Subir banco de dados PostgreSQL
docker compose up -d

# Gerar cliente do Prisma
pnpm prisma:generate

# Iniciar servidor em desenvolvimento
pnpm start:dev
```

### 3. Testes e Qualidade
```bash
# Executar todos os testes com Vitest
pnpm test

# Executar linter ultra-rápido (oxlint)
pnpm lint
```

---

## 📖 Documentação da API

Com a aplicação em execução, aceda à documentação interativa:

* **Swagger UI**: `http://localhost:3000/docs`
* **OpenAPI Spec**: `http://localhost:3000/docs/openapi.json`