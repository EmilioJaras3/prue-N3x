# Consola de Investigación Pokémon (Obsidian Dex)

Este proyecto es una plataforma de gestión e investigación Pokémon desarrollada como prueba técnica, enfocada en altos estándares de ingeniería, seguridad y experiencia de usuario (UX).

## 🛡️ Propósito y Alcance
La **Consola de Investigación Pokémon** es un sistema de gestión de especímenes que permite a los investigadores buscar, escanear y persistir datos de Pokémon en una base de datos segura. El proyecto demuestra la capacidad de integrar servicios externos (PokéAPI) con una arquitectura de persistencia local robusta, utilizando tecnologías de vanguardia en el ecosistema de JavaScript/TypeScript.

---

## 🚀 Stack Tecnológico

| Capa | Tecnología | Razón de Elección |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router) | Renderizado híbrido (SSR/CSR) y optimización de rutas automáticas. |
| **Lenguaje** | TypeScript | Tipado estático para garantizar la integridad del flujo de datos. |
| **Estilos** | CSS / Tailwind CSS v4 | Diseño de alta fidelidad con animaciones fluidas y glassmorphism. |
| **Base de Datos** | PostgreSQL 16 | Relacional y escalable para la persistencia de colecciones. |
| **ORM** | Drizzle ORM | Ligero, con tipado completo y migraciones controladas. |
| **Estado Global** | Zustand | Gestión de estado minimalista y eficiente. |
| **Seguridad** | JWT + bcrypt + Zod | Triada estándar para autenticación, hashing y validación de tipos. |

---

## ⚙️ Características Principales

### 1. Búsqueda Inteligente (Fuzzy Search)
Implementación del algoritmo de **Distancia de Levenshtein** en el servidor para permitir búsquedas con tolerancia a errores tipográficos. Si el usuario escribe "Pikachu" incorrectamente (ej. "Pikashu"), el sistema sugiere o redirige al espécimen correcto mediante una validación de similitud semántica.

### 2. Persistencia en "Caja PC"
A diferencia de aplicaciones simples que solo consumen APIs, este sistema permite "capturar" Pokémon, guardando sus stats base, ID y arte oficial en una base de datos local para acceso offline o histórico, vinculando cada colección de forma segura a su respectivo investigador.

### 3. Observabilidad y Auditoría
Cada acción crítica (login, registro, captura) genera un rastro de auditoría (`action_logs`) que registra la IP del cliente, el User-Agent y el timestamp, siguiendo las mejores prácticas de seguridad bancaria y corporativa.

### 4. Resiliencia y Manejo de Errores
El sistema monitorea la salud de la PokéAPI en tiempo real. Si el servicio externo presenta fallos, la interfaz notifica dinámicamente al usuario mediante alertas de mantenimiento, manteniendo la integridad operativa de las funciones locales.

---

## 🏗️ Arquitectura del Sistema

```text
panel-seguro/
├── src/
│   ├── app/                    # Next.js App Router (Estructura de Rutas)
│   ├── api/actions/            # Server Actions (Lógica de Negocio en Servidor)
│   ├── components/             # UI Components (Átomos y Moléculas)
│   ├── lib/                    # Infraestructura (Seguridad, Validaciones, DB)
│   ├── services/postgres/      # Definición de Esquemas y Modelos
│   └── store/                  # Estado Global con Zustand
├── docker-compose.yml          # Orquestación de Base de Datos
└── drizzle.config.ts           # Configuración del ORM
```

---

## 🔐 Medidas de Seguridad Implementadas

1.  **Protección de Identidad**: Hashing de contraseñas con `bcrypt` y salt rounds de nivel industrial.
2.  **Validación Rigurosa**: Validación de esquemas en tiempo de ejecución con `Zod`.
3.  **Seguridad de Capa**: 
    *   Cookies `HttpOnly`, `Secure` y `SameSite: Lax`.
    *   Headers OWASP (CSP, HSTS, X-Frame-Options) configurados vía Middleware.
    *   Rate Limiting para mitigar ataques de fuerza bruta en autenticación.
4.  **Higiene de Datos**: Sanitización de inputs para prevenir inyecciones y XSS.

---

## 🛠️ Instalación y Ejecución

1. **Clonar el repositorio e instalar dependencias:**
   ```bash
   npm install
   ```

2. **Levantar el entorno de datos (Docker):**
   ```bash
   docker-compose up -d
   ```

3. **Ejecutar migraciones de base de datos:**
   ```bash
   npx drizzle-kit push
   ```

4. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

---

**Desarrollado como Proyecto de Ingeniería para Prueba Técnica (2025).**
