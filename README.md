# Panel Seguro

Aplicacion web de autenticacion y gestion de usuarios con arquitectura SOA.

## Arquitectura

```
panel-seguro/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (auth)/                 # Grupo de rutas publicas
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── dashboard/              # Ruta protegida
│   │   │   └── page.tsx
│   │   ├── api/
│   │   │   ├── actions/            # Server Actions
│   │   │   │   ├── auth.actions.ts
│   │   │   │   └── external.actions.ts
│   │   │   ├── logs/route.ts       # API REST para logs
│   │   │   └── user/route.ts       # API REST para usuario
│   │   ├── layout.tsx
│   │   └── page.tsx                # Landing
│   │
│   ├── components/                 # Componentes UI
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   ├── dashboard/
│   │   │   ├── ActionLogs.tsx
│   │   │   └── ExternalData.tsx
│   │   └── ui/
│   │       └── VideoBackground.tsx
│   │
│   ├── lib/                        # Infraestructura
│   │   ├── db.ts                   # Cliente Drizzle
│   │   ├── validations.ts          # Schemas Zod
│   │   └── security/
│   │       ├── auth.ts             # bcrypt, JWT, tokens
│   │       ├── rate-limit.ts       # Rate limiting
│   │       └── headers.ts          # Headers OWASP
│   │
│   ├── services/                   # Capa de servicios
│   │   └── postgres/
│   │       └── schema.ts           # Tablas Drizzle
│   │
│   ├── store/                      # Estado global
│   │   └── authStore.ts            # Zustand
│   │
│   ├── types/                      # Tipos TypeScript
│   │   └── index.ts
│   │
│   └── middleware.ts               # Auth + Security headers
│
├── public/
│   └── bg-vault.mp4                # Video de fondo
│
├── docker-compose.yml              # PostgreSQL
├── drizzle.config.ts               # Config Drizzle ORM
└── package.json
```

## Stack

| Capa | Tecnologia |
|------|-----------|
| Frontend | Next.js 14, React 18, Tailwind CSS |
| Lenguaje | TypeScript |
| Base de datos | PostgreSQL 16, Drizzle ORM |
| Estado | Zustand |
| Validacion | Zod |
| Auth | bcrypt, JWT, cookies HttpOnly |
| Seguridad | Rate limiting, OWASP headers, XSS filter |
| Contenedores | Docker |

## Flujo de datos

```
Usuario -> Middleware (auth check + headers)
  -> Server Action (validacion Zod + rate limit)
    -> Drizzle ORM (query segura)
      -> PostgreSQL
    -> Audit Log (registra accion)
  <- Respuesta al cliente
```

## Seguridad implementada

- Contrasenas hexadecimales (min 6 caracteres)
- Filtro de caracteres no permitidos en todos los inputs
- bcrypt para hash de contrasenas
- JWT con algoritmo HS256
- Rate limiting (login: 5/15min, registro: 3/hora)
- Headers OWASP (CSP, HSTS, X-Frame-Options)
- Cookies HttpOnly, Secure, SameSite
- Audit trail de todas las acciones

## Ramas Git

- `main` - produccion
- `develop` - desarrollo
- `feature/*` - funcionalidades

## Comandos

```bash
docker-compose up -d          # levantar base de datos
npm install                   # instalar dependencias
npx drizzle-kit generate      # generar migraciones
npx drizzle-kit migrate       # ejecutar migraciones
npm run dev                   # servidor desarrollo
npm run build                 # compilar produccion
```
