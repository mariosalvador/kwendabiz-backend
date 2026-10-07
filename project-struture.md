# Estrutura padrão para projetos NestJS com DDD e Arquitetura Hexagonal

Este documento define uma estrutura base para projetos individuais construídos com
NestJS, TypeScript, Domain-Driven Design (DDD) e Arquitetura Hexagonal
(Ports and Adapters).

O objetivo é manter uma organização consistente entre projetos, permitindo que a
aplicação cresça sem acoplar as regras de negócio ao NestJS, Prisma, HTTP, Redis,
filas, serviços cloud ou qualquer outro detalhe externo.

> O nome deste arquivo mantém `project-struture` para compatibilidade com a
> convenção solicitada. Em novos repositórios, `project-structure.md` seria a
> grafia recomendada.

## 1. Princípios arquiteturais

Todo projeto deve seguir estes princípios:

1. **O domínio é independente de frameworks.**
2. **Casos de uso dependem de portas, nunca de adaptadores concretos.**
3. **Adaptadores implementam portas da aplicação.**
4. **A composição das dependências acontece na borda da aplicação.**
5. **Cada bounded context deve possuir seus próprios modelos, casos de uso e
   adaptadores.**
6. **Controllers são adaptadores finos, não locais para regras de negócio.**
7. **Persistência não deve vazar para entidades ou casos de uso.**
8. **Cada módulo deve ter uma responsabilidade de negócio clara.**

Regra de dependência:

```text
Inbound adapters ─┐
Outbound adapters ─┼──> Application ───> Domain
Bootstrap ────────┘
```

As dependências sempre apontam para dentro:

```text
adapters → application → domain
```

Nunca devem existir dependências como:

```text
domain → NestJS
domain → Prisma
domain → Redis
domain → AWS SDK
domain → HTTP
application → PrismaService
application → Express.Request
```

## 2. Estrutura padrão do projeto

```text
.
├── src/
│   ├── shared/
│   │   ├── core/
│   │   │   ├── entities/
│   │   │   │   ├── aggregate-root.ts
│   │   │   │   ├── entity.ts
│   │   │   │   └── unique-entity-id.ts
│   │   │   ├── events/
│   │   │   │   ├── domain-event.ts
│   │   │   │   ├── domain-events.ts
│   │   │   │   └── event-handler.ts
│   │   │   ├── errors/
│   │   │   ├── either.ts
│   │   │   ├── pagination.ts
│   │   │   └── types/
│   │   ├── application/
│   │   │   └── ports/
│   │   │       ├── clock.ts
│   │   │       ├── id-generator.ts
│   │   │       └── logger.ts
│   │   └── infra/
│   │       └── config/
│   │           ├── env.ts
│   │           └── env.service.ts
│   │
│   ├── modules/
│   │   ├── <bounded-context>/
│   │   │   ├── domain/
│   │   │   │   ├── entities/
│   │   │   │   ├── value-objects/
│   │   │   │   ├── aggregates/
│   │   │   │   ├── events/
│   │   │   │   ├── services/
│   │   │   │   └── errors/
│   │   │   │
│   │   │   ├── application/
│   │   │   │   ├── use-cases/
│   │   │   │   ├── ports/
│   │   │   │   │   ├── repositories/
│   │   │   │   │   ├── services/
│   │   │   │   │   └── events/
│   │   │   │   ├── dto/
│   │   │   │   └── errors/
│   │   │   │
│   │   │   ├── adapters/
│   │   │   │   ├── inbound/
│   │   │   │   │   ├── http/
│   │   │   │   │   │   ├── controllers/
│   │   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── presenters/
│   │   │   │   │   │   ├── pipes/
│   │   │   │   │   │   └── guards/
│   │   │   │   │   ├── events/
│   │   │   │   │   └── cli/
│   │   │   │   │
│   │   │   │   └── outbound/
│   │   │   │       ├── persistence/
│   │   │   │       │   └── prisma/
│   │   │   │       │       ├── repositories/
│   │   │   │       │       ├── mappers/
│   │   │   │       │       └── prisma.service.ts
│   │   │   │       ├── cache/
│   │   │   │       ├── messaging/
│   │   │   │       ├── storage/
│   │   │   │       └── cryptography/
│   │   │   │
│   │   │   ├── <bounded-context>.module.ts
│   │   │   └── index.ts
│   │   │
│   │   └── <outro-bounded-context>/
│   │
│   ├── bootstrap/
│   │   ├── app.module.ts
│   │   ├── dependency-injection.ts
│   │   ├── http.ts
│   │   └── routes.ts
│   │
│   └── main.ts
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── test/
│   ├── integration/
│   ├── e2e/
│   ├── factories/
│   └── helpers/
│
├── docs/
│   ├── architecture/
│   └── decisions/
│
├── .env.example
├── eslint.config.mjs
├── nest-cli.json
├── package.json
├── tsconfig.json
└── README.md
```

`<bounded-context>` deve ser substituído por um contexto real do negócio, como
`identity`, `billing`, `catalog`, `forum` ou `notifications`.

## 3. Responsabilidade de cada camada

### 3.1 `shared`

Contém apenas abstrações realmente compartilhadas por mais de um bounded context.

Exemplos adequados:

- `Entity`;
- `AggregateRoot`;
- `UniqueEntityId`;
- `Either`;
- eventos genéricos;
- paginação;
- erros base;
- portas técnicas como relógio, gerador de ID e logger.

Não use `shared` como uma pasta para colocar qualquer arquivo que não tenha uma
localização clara. Se algo pertence apenas a um contexto, deve permanecer dentro
desse contexto.

### 3.2 `domain`

É o núcleo do negócio:

- entidades;
- agregados;
- objetos de valor;
- eventos de domínio;
- serviços de domínio;
- invariantes;
- erros de negócio.

O domínio não deve importar NestJS nem bibliotecas de infraestrutura.

Exemplo:

```ts
export class Order extends AggregateRoot<OrderProps> {
  cancel(reason: CancellationReason): void {
    if (this.status === OrderStatus.Delivered) {
      throw new OrderAlreadyDeliveredError(this.id);
    }

    this.status = OrderStatus.Cancelled;
    this.addDomainEvent(new OrderCancelledEvent(this, reason));
  }
}
```

Uma entidade deve proteger suas invariantes. Não exponha setters públicos que
permitam modificar o estado sem validação.

### 3.3 `application`

Contém a orquestração dos casos de uso e as portas necessárias para o negócio:

- casos de uso;
- comandos e resultados;
- interfaces de repositórios;
- interfaces de serviços externos;
- contratos de publicação de eventos;
- erros específicos da aplicação.

Uma porta pertence à aplicação porque representa uma necessidade do caso de uso.

```ts
export abstract class OrdersRepository {
  abstract findById(id: OrderId): Promise<Order | null>;
  abstract save(order: Order): Promise<void>;
}
```

O caso de uso conhece `OrdersRepository`, mas não conhece
`PrismaOrderRepository`.

### 3.4 `adapters/inbound`

Recebe comandos externos e os converte para chamadas da aplicação:

- controllers REST;
- consumidores de mensagens;
- comandos CLI;
- webhooks;
- DTOs de entrada;
- validação específica do transporte;
- presenters e serializers.

Um controller deve realizar apenas:

1. receber a entrada;
2. validar o formato;
3. obter o contexto do usuário;
4. chamar o caso de uso;
5. traduzir o resultado para o protocolo externo.

### 3.5 `adapters/outbound`

Implementa as portas usando tecnologias concretas:

- Prisma;
- PostgreSQL;
- Redis;
- S3/R2;
- JWT;
- SMTP;
- filas;
- APIs de terceiros.

Mappers devem converter entre o modelo externo e o modelo de domínio. O modelo
Prisma não deve ser retornado diretamente pelos casos de uso.

### 3.6 `bootstrap`

É a composição da aplicação:

- criação do Nest application;
- registro dos módulos;
- configuração global;
- pipes, filtros e interceptors;
- composição de adapters;
- inicialização de listeners;
- graceful shutdown.

Essa camada pode conhecer todas as outras, pois está na borda do sistema.

## 4. Organização por bounded context

Cada bounded context deve ser o mais autônomo possível:

```text
modules/
├── identity/
├── forum/
├── notifications/
└── billing/
```

Um contexto não deve importar classes internas de outro contexto. Para integração,
use uma destas alternativas:

1. portas públicas expostas pelo contexto;
2. eventos de integração;
3. contratos compartilhados mínimos;
4. chamadas a uma API externa quando forem realmente sistemas separados.

Exemplo:

```text
forum ── publica ──> AnswerCreatedIntegrationEvent
                         │
                         ▼
notifications ── consome e cria uma notificação
```

Não faça isto:

```ts
import { User } from '@/modules/identity/domain/entities/user';
```

dentro de detalhes internos do módulo `forum`, caso a necessidade possa ser
atendida por um `authorId`, um contrato público ou um evento.

## 5. Portas e adaptadores

### Porta de entrada

Uma porta de entrada é uma operação que o mundo externo pode solicitar:

```ts
export interface CreateOrderInput {
  customerId: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
}

export interface CreateOrderOutput {
  orderId: string;
}
```

Na prática, o caso de uso representa essa porta:

```ts
export class CreateOrderUseCase {
  async execute(input: CreateOrderInput): Promise<CreateOrderOutput> {
    // Orquestra o domínio sem conhecer HTTP ou NestJS.
  }
}
```

### Porta de saída

Uma porta de saída representa uma dependência:

```ts
export abstract class PaymentGateway {
  abstract authorize(
    input: AuthorizePaymentInput,
  ): Promise<AuthorizePaymentOutput>;
}
```

O adapter concreto pode usar Stripe, PayPal ou outro provedor sem alterar o caso
de uso:

```ts
export class StripePaymentGateway implements PaymentGateway {
  async authorize(
    input: AuthorizePaymentInput,
  ): Promise<AuthorizePaymentOutput> {
    // Implementação específica do Stripe.
  }
}
```

## 6. Composição de dependências no NestJS

Cada bounded context deve possuir um módulo próprio:

```ts
@Module({
  controllers: [CreateOrderController],
  providers: [
    CreateOrderUseCase,
    {
      provide: OrdersRepository,
      useClass: PrismaOrderRepository,
    },
    {
      provide: PaymentGateway,
      useClass: StripePaymentGateway,
    },
  ],
})
export class OrdersModule {}
```

Para portas baseadas em classes abstratas, a abstração pode ser usada diretamente
como token. Para contratos TypeScript puros, use tokens explícitos:

```ts
export const CLOCK = Symbol('CLOCK');

@Module({
  providers: [
    {
      provide: CLOCK,
      useClass: SystemClock,
    },
  ],
})
export class SharedInfraModule {}
```

O `app.module.ts` deve apenas importar os módulos dos contextos e módulos técnicos
globais:

```ts
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    IdentityModule,
    OrdersModule,
    NotificationsModule,
  ],
})
export class AppModule {}
```

Evite um `AppModule` com centenas de controllers e providers. A composição deve
ser delegada aos módulos dos contextos.

## 7. Convenções de nomenclatura

Use nomes consistentes e em inglês no código:

| Elemento | Convenção | Exemplo |
| --- | --- | --- |
| Arquivos | `kebab-case` | `create-order.use-case.ts` |
| Classes | `PascalCase` | `CreateOrderUseCase` |
| Variáveis | `camelCase` | `ordersRepository` |
| Interfaces | nome orientado ao papel | `OrdersRepository` |
| Portas | nome da capacidade | `PaymentGateway` |
| Adaptadores | tecnologia + capacidade | `StripePaymentGateway` |
| Erros | condição + `Error` | `OrderNotFoundError` |
| Eventos | fato ocorrido + `Event` | `OrderCreatedEvent` |
| DTOs | ação + `Dto` | `CreateOrderDto` |
| Controllers | ação + `Controller` | `CreateOrderController` |
| Mappers | tecnologia + entidade + `Mapper` | `PrismaOrderMapper` |

Use `*.use-case.ts`, `*.controller.ts`, `*.repository.ts`, `*.mapper.ts` e
`*.module.ts` para tornar o papel do arquivo evidente.

## 8. Regras para entidades e agregados

### Entidade

Possui identidade própria e comportamento:

```text
domain/entities/customer.ts
```

### Objeto de valor

É definido por seu valor e deve ser imutável sempre que possível:

```text
domain/value-objects/email.ts
domain/value-objects/money.ts
```

### Agregado

É o limite transacional e de consistência do domínio. O acesso às entidades
internas deve ocorrer através da raiz do agregado.

```text
Order
├── OrderItem
└── ShippingAddress
```

Não transforme cada tabela do banco automaticamente em um agregado. O desenho deve
seguir invariantes e transações do negócio.

## 9. Persistência e Prisma

O Prisma deve ficar restrito ao adapter de saída:

```text
modules/orders/adapters/outbound/persistence/prisma/
├── prisma-order.repository.ts
├── prisma-order.mapper.ts
└── prisma.service.ts
```

Fluxo de persistência:

```text
Domain entity
    ↓
Prisma mapper
    ↓
Prisma model
    ↓
PostgreSQL
```

Regras:

- não retornar `Prisma.Order` para a aplicação;
- não importar tipos Prisma no domínio;
- manter queries e `include` dentro dos repositórios;
- mapear explicitamente campos e relações;
- versionar migrations;
- utilizar transações quando a operação ultrapassar um agregado ou exigir
  consistência atômica.

## 10. HTTP, autenticação e autorização

HTTP é um detalhe de entrada:

```text
adapters/inbound/http/
├── controllers/
├── dto/
├── presenters/
├── pipes/
├── guards/
└── decorators/
```

Autenticação pode estar em um bounded context `identity`, enquanto autorização
deve ser expressa por políticas ou serviços de aplicação, não por verificações
espalhadas em controllers.

O controller não deve decidir se um usuário pode alterar um recurso. Deve passar
o ator para o caso de uso:

```ts
await updateOrder.execute({
  actorId: currentUser.id,
  orderId,
  changes,
});
```

O caso de uso ou o domínio aplica a regra de autorização.

## 11. Eventos de domínio e integração

Use eventos de domínio para comunicar fatos dentro de um bounded context:

```text
Order.cancel()
    ↓
OrderCancelledDomainEvent
    ↓
subscriber interno
```

Use eventos de integração quando outro contexto precisa reagir:

```text
forum
  └── QuestionAnsweredIntegrationEvent
          ↓
notifications
```

Não use eventos apenas para esconder chamadas síncronas simples. Eventos devem
representar fatos relevantes e ter comportamento de retry, idempotência e
observabilidade quando forem assíncronos.

## 12. Testes

A estrutura de testes deve acompanhar a arquitetura:

```text
modules/orders/
├── domain/
│   └── entities/order.spec.ts
├── application/
│   └── use-cases/create-order.spec.ts
└── adapters/
    └── inbound/http/controllers/create-order.controller.spec.ts

test/
├── integration/
├── e2e/
├── factories/
└── helpers/
```

Prioridade recomendada:

1. testes unitários das entidades e objetos de valor;
2. testes unitários dos casos de uso com fakes das portas;
3. testes de integração dos repositórios;
4. testes e2e dos fluxos HTTP mais importantes.

Testes de casos de uso não devem depender de PostgreSQL, Redis ou serviços cloud.
Essas dependências devem ser substituídas por fakes ou mocks controlados.

## 13. Critérios para adicionar algo em `shared`

Antes de mover um arquivo para `shared`, responda:

- ele é usado por mais de um bounded context?
- possui significado técnico ou de negócio realmente genérico?
- compartilhar esse tipo não criará acoplamento entre contextos?
- sua API está estável?

Se a resposta for não, mantenha o arquivo dentro do contexto que o utiliza.

O `shared` deve ser pequeno. Um `shared` grande geralmente indica que os limites
dos bounded contexts não estão claros.

## 14. Estrutura mínima recomendada para um novo projeto

Para projetos pequenos, comece com esta versão e expanda apenas quando necessário:

```text
src/
├── shared/
│   └── core/
├── modules/
│   └── identity/
│       ├── domain/
│       ├── application/
│       ├── adapters/
│       └── identity.module.ts
├── bootstrap/
│   └── app.module.ts
└── main.ts
```

Quando um segundo contexto surgir, não mova regras para pastas globais. Adicione
outro módulo:

```text
modules/
├── identity/
└── catalog/
```

## 15. Checklist de cada novo bounded context

Antes de considerar um contexto pronto, confirme:

- [ ] O contexto tem uma responsabilidade de negócio clara.
- [ ] As entidades protegem as próprias invariantes.
- [ ] Os casos de uso não importam NestJS, Prisma ou SDKs externos.
- [ ] As portas estão em `application/ports`.
- [ ] Os adapters de saída implementam essas portas.
- [ ] Controllers são finos.
- [ ] DTOs não são usados como entidades de domínio.
- [ ] Modelos Prisma não atravessam a camada de persistência.
- [ ] Existe um módulo NestJS específico para o contexto.
- [ ] As dependências são compostas no módulo ou no bootstrap.
- [ ] Há testes unitários dos casos de uso.
- [ ] Integrações entre contextos usam contratos ou eventos.
- [ ] Não há dependência circular entre bounded contexts.
- [ ] Erros de negócio são explícitos e mapeados para o transporte.

## 16. Evolução recomendada

Adote a estrutura em etapas:

1. identificar os bounded contexts;
2. separar domínio, aplicação e adapters;
3. mover interfaces de repositório para `application/ports`;
4. mover Prisma, Redis, storage e JWT para `adapters/outbound`;
5. mover controllers para `adapters/inbound`;
6. criar um módulo NestJS por bounded context;
7. centralizar a composição no bootstrap;
8. adicionar testes por camada;
9. introduzir eventos de integração somente quando houver necessidade real;
10. documentar decisões arquiteturais relevantes em `docs/decisions`.

Evite começar com microserviços, event sourcing ou mensageria distribuída apenas
por preferência arquitetural. A estrutura hexagonal permite iniciar como um
modular monolith e extrair contextos no futuro quando houver uma necessidade
operacional ou de negócio comprovada.

## Resumo

A estrutura padrão recomendada é:

```text
src/
├── shared/
├── modules/
│   └── <bounded-context>/
│       ├── domain/
│       ├── application/
│       └── adapters/
├── bootstrap/
└── main.ts
```

O princípio essencial é manter o centro do sistema estável e independente:

```text
Domain
  ← Application
  ← Inbound adapters
  ← Outbound adapters
```

Assim, o banco de dados, o framework HTTP ou um serviço externo podem ser
substituídos sem reescrever as regras centrais do negócio.
