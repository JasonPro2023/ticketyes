# Descripción del Stack de TicketYes

## 🟢 Node.js

**Qué es**: Un entorno que ejecuta JavaScript (o TypeScript) fuera del navegador, en el servidor.

**Por qué lo usamos**: Nos permite usar un solo lenguaje (JavaScript/TypeScript) en frontend y backend.

**Cómo se ve en nuestro proyecto**:
```typescript
// archivo: backend/src/index.ts
import express from 'express';
const app = express();
app.listen(3000, () => console.log('Server on port 3000'));
```

**Concepto clave**: Node NO es un lenguaje, es un *runtime*. El lenguaje es JavaScript/TypeScript.

---

## 🔵 TypeScript

**Qué es**: JavaScript con tipos. Es un "superconjunto" de JS que añade verificación de tipos en tiempo de desarrollo.

**Por qué lo usamos**:
- Detecta errores ANTES de ejecutar el código
- Autocompletado más inteligente en VS Code
- Refactorización más segura
- Estándar de la industria

**Cómo se ve en nuestro proyecto**:
```typescript
// JavaScript normal
function addUser(name, age) {
  return { name, age };
}

// TypeScript
function addUser(name: string, age: number): User {
  return { name, age };
}
```

**Concepto clave**: TypeScript se compila a JavaScript antes de ejecutarse. El navegador/Node nunca ve TypeScript directamente, solo el JS compilado.

**Modos importantes de tsconfig.json**:
- `strict: true` → máxima verificación (lo usaremos)
- `noImplicitAny: true` → no permite "cualquier cosa" sin tipar
- `target` → a qué versión de JS compilar

---

## 🟣 Express

**Qué es**: Un framework minimalista para crear servidores web y APIs en Node.js.

**Por qué lo usamos**:
- Es el estándar de facto para APIs en Node
- Simple pero potente
- Gran ecosistema de middleware

**Cómo se ve en nuestro proyecto**:
```typescript
import express from 'express';
const app = express();

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/tickets', (req, res) => {
  // crear ticket
});
```

**Conceptos clave**:
- **Ruta** (`/tickets`): la URL
- **Método HTTP** (`GET`, `POST`, `PUT`, `DELETE`): la acción
- **Request (req)**: lo que el cliente envía
- **Response (res)**: lo que el servidor responde
- **Middleware**: funciones que se ejecutan antes de llegar a la ruta (auth, logging, etc.)

---

## 🟡 Prisma

**Qué es**: Un ORM (Object-Relational Mapping). Es una capa que te permite hablar con la base de datos usando TypeScript en vez de SQL crudo.

**Por qué lo usamos**:
- Type-safe: si escribes mal un campo, TypeScript te avisa
- Migraciones automáticas
- Genera tipos automáticamente desde el schema
- Más amigable que SQL crudo para juniors

**Cómo se ve en nuestro proyecto**:
```prisma
// archivo: backend/src/prisma/schema.prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  password  String
  createdAt DateTime @default(now())
  tickets   Ticket[]
}

model Ticket {
  id       String @id @default(uuid())
  title    String
  content  String
  category String?
  priority String?
  userId   String
  user     User   @relation(fields: [userId], references: [id])
}
```

```typescript
// Uso en código
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Crear usuario
const user = await prisma.user.create({
  data: { email: 'test@test.com', name: 'Test', password: 'hash' }
});

// Buscar tickets
const tickets = await prisma.ticket.findMany({
  where: { userId: user.id }
});
```

**Conceptos clave**:
- **Schema** (`schema.prisma`): defines tus modelos de datos ahí
- **Migración**: cuando cambias el schema, generas una migración que actualiza la DB
- **Cliente Prisma**: la clase que usas en tu código para hacer queries

---

## 🔐 JWT (JSON Web Token)

**Qué es**: Un estándar para autenticar usuarios. Es un "token" (cadena larga) que el servidor genera cuando el usuario hace login, y el cliente envía en cada petición posterior para identificarse.

**Por qué lo usamos**:
- Stateless: el servidor no guarda sesiones (más escalable)
- Estándar de la industria
- Funciona bien con frontends separados

**Flujo**:
```
1. Cliente → POST /login con email+password
2. Servidor verifica credenciales, genera JWT, lo devuelve
3. Cliente guarda el JWT (en memoria o localStorage)
4. Cliente → GET /tickets con header "Authorization: Bearer <token>"
5. Servidor verifica el JWT y deja pasar o rechaza
```

**Cómo se ve en nuestro proyecto**:
```typescript
import jwt from 'jsonwebtoken';

// Generar token al hacer login
const token = jwt.sign(
  { userId: user.id },
  process.env.JWT_SECRET!,
  { expiresIn: '7d' }
);

// Verificar token en middleware
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const payload = jwt.verify(token, process.env.JWT_SECRET!);
  req.userId = payload.userId;
  next();
}
```

**Concepto clave**: El token tiene 3 partes: `header.payload.signature`. La firma garantiza que no fue alterado.

---

## 🔒 bcrypt

**Qué es**: Una librería para hashear contraseñas. Nunca guardes contraseñas en texto plano.

**Por qué lo usamos**: Estándar de la industria para hashing de passwords.

**Cómo se ve en nuestro proyecto**:
```typescript
import bcrypt from 'bcrypt';

// Al registrar
const hashedPassword = await bcrypt.hash(plainPassword, 10);

// Al hacer login
const isValid = await bcrypt.compare(plainPassword, user.password);
```

**Concepto clave**: `hash` es unidireccional (no se puede "desencriptar"). `compare` verifica si una contraseña plana corresponde a un hash.

---

## ✅ Zod

**Qué es**: Una librería de validación de datos. Define un "schema" de cómo deben verse los datos y Zod verifica que coincidan.

**Por qué lo usamos**:
- TypeScript-first
- Mensajes de error claros
- Infiere tipos automáticamente

**Cómo se ve en nuestro proyecto**:
```typescript
import { z } from 'zod';

const createTicketSchema = z.object({
  title: z.string().min(3).max(200),
  content: z.string().min(10),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional()
});

// Validar
const result = createTicketSchema.safeParse(req.body);
if (!result.success) {
  return res.status(400).json({ errors: result.error.flatten() });
}
// result.data ya está tipado y validado
```

**Concepto clave**: Nunca confíes en los datos que envía el cliente. SIEMPRE valida en el backend.

---

## 🌐 CORS (Cross-Origin Resource Sharing)

**Qué es**: Un mecanismo de seguridad del navegador. Por defecto, un frontend en `localhost:5173` no puede hacer requests a un backend en `localhost:3000` (son "orígenes" diferentes).

**Por qué lo usamos**: Nuestro frontend (Vite) y backend (Express) correrán en puertos distintos. CORS le dice al navegador "está bien, deja pasar".

**Cómo se ve en nuestro proyecto**:
```typescript
import cors from 'cors';
app.use(cors({
  origin: 'http://localhost:5173' // URL del frontend en dev
}));
```

---

## 📦 dotenv

**Qué es**: Una librería para cargar variables de entorno desde un archivo `.env`.

**Por qué lo usamos**: Para no hardcodear secretos (claves de DB, JWT secret) en el código.

**Cómo se ve en nuestro proyecto**:
```bash
# archivo: backend/.env (NO se sube a Git)
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
JWT_SECRET="un-secreto-muy-largo-y-aleatorio"
PORT=3000
```

```typescript
import 'dotenv/config';
console.log(process.env.DATABASE_URL);
```

**Concepto clave**: El archivo `.env` está en `.gitignore`. Solo subimos `.env.example` con la estructura (sin valores reales).

---

## 🐍 Python (ML Service)

**Qué es**: El lenguaje que usaremos para el servicio de Machine Learning. Será un microservicio independiente.

**Por qué lo usamos**:
- Ecosistema de ML más maduro (scikit-learn, pandas, NLTK)
- Sintaxis clara y legible
- Integración con FastAPI (moderno y rápido)

**Cómo se ve en nuestro proyecto**:
```python
# archivo: ml-service/app/main.py
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class TicketRequest(BaseModel):
    title: str
    content: str

@app.post("/predict")
def predict(req: TicketRequest):
    # Aquí iría la lógica del modelo ML
    return {
        "category": "TECHNICAL",
        "priority": "HIGH"
    }
```

---

## 🧠 Conceptos transversales

### Arquitectura en capas

```
Request HTTP
    ↓
[Routes] ← define las URLs
    ↓
[Controllers] ← recibe req, valida, llama a servicios
    ↓
[Services] ← lógica de negocio
    ↓
[Prisma] ← habla con la DB
    ↓
[Response HTTP]
```

**Por qué**: Separar responsabilidades hace el código más mantenible y testeable.

### Variables de entorno

Son valores de configuración que cambian entre desarrollo, pruebas y producción. Nunca van en el código.

### Conventional Commits

Formato estándar para mensajes de commit:
- `feat: nueva funcionalidad`
- `fix: corrección de bug`
- `docs: solo documentación`
- `style: formato (espacios, comas)`
- `refactor: cambio interno sin nueva feature`
- `test: agregar tests`
- `chore: tareas de mantenimiento`

---

## 🗺️ Mapa mental del stack

```
TicketYes
│
├── Frontend (lo que ve el usuario)
│   ├── React          → interfaz de usuario
│   ├── TypeScript     → tipos
│   ├── Vite           → herramienta de build
│   ├── TailwindCSS    → estilos
│   └── Axios/Fetch    → para llamar a la API
│
├── Backend (la lógica de negocio)
│   ├── Node.js        → runtime
│   ├── TypeScript     → tipos
│   ├── Express        → servidor web
│   ├── Prisma         → ORM
│   ├── JWT            → autenticación
│   ├── bcrypt         → hash de passwords
│   ├── Zod            → validación
│   └── CORS           → permisos cross-origin
│
├── ML Service (la inteligencia)
│   ├── Python         → lenguaje
│   ├── FastAPI        → servidor web
│   ├── scikit-learn   → modelos ML
│   ├── NLTK           → procesamiento de texto
│   └── Pandas         → manipulación de datos
│
└── Base de datos
    └── PostgreSQL     → almacenamiento (vía Neon en la nube)
```
