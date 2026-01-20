# MAT32 Hub - Deployment Guide

Guía completa de despliegue para MAT32HUB V22 en diferentes plataformas.

## 📋 Índice

1. [Requisitos Previos](#requisitos-previos)
2. [Despliegue en Vercel](#despliegue-en-vercel)
3. [Despliegue en Replit](#despliegue-en-replit)
4. [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)
5. [Testing del Entorno](#testing-del-entorno)

## 🔧 Requisitos Previos

- Cuenta de GitHub (ya configurada)
- Clave API de Gemini (obtener en https://ai.google.dev)
- Cuenta de Supabase (para backend)
- Node.js 18+ instalado localmente para pruebas

## 🚀 Despliegue en Vercel

### Opción 1: Desde GitHub (Recomendado)

1. **Conectar Repositorio**
   - Ir a https://vercel.com/new
   - Seleccionar "Import Git Repository"
   - Elegir `mat32dev/mat32hub-v22`

2. **Configurar Proyecto**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Variables de Entorno**
   ```
   GEMINI_API_KEY=tu_clave_aqui
   VITE_SUPABASE_URL=tu_supabase_url
   VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
   ```

4. **Deploy**
   - Click en "Deploy"
   - Esperar ~2-3 minutos
   - URL de producción estará disponible

### Opción 2: Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Desplegar
vercel

# Para producción
vercel --prod
```

## 🔄 Despliegue en Replit

### Configuración Inicial

1. **Importar desde GitHub**
   - Ir a https://replit.com
   - Click en "Create Repl"
   - Seleccionar "Import from GitHub"
   - URL: `https://github.com/mat32dev/mat32hub-v22`

2. **Configuración Automática**
   - Replit detectará automáticamente el archivo `.replit`
   - La configuración ya está optimizada

3. **Variables de Entorno (Secrets)**
   - Click en el icono de candado (Secrets)
   - Añadir:
     ```
     GEMINI_API_KEY=tu_clave_aqui
     ```

4. **Ejecutar**
   - Click en "Run"
   - La app estará disponible en la URL del Repl

### Modo Desarrollo vs Producción

**Desarrollo:**
```bash
npm run dev
```

**Build para producción:**
```bash
npm run build
npm run preview
```

## 🔐 Configuración de Variables de Entorno

### Local (.env.local)

```env
# Gemini API
GEMINI_API_KEY=tu_clave_de_gemini

# Supabase
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anon

# Opcional: Instagram API
VITE_INSTAGRAM_TOKEN=tu_token_instagram

# Opcional: Google Calendar
VITE_GOOGLE_CALENDAR_API_KEY=tu_clave_google
```

### Obtener Claves API

#### 1. Gemini API
- Ir a https://ai.google.dev
- Crear proyecto o usar existente
- "Get API Key"
- Copiar clave

#### 2. Supabase
- Ir a https://supabase.com
- Crear nuevo proyecto
- Settings > API
- Copiar URL y anon/public key

#### 3. Configurar Base de Datos Supabase

```sql
-- Tabla de Discos
CREATE TABLE records (
  id TEXT PRIMARY KEY,
  artist TEXT NOT NULL,
  title TEXT NOT NULL,
  genre TEXT,
  price NUMERIC,
  description TEXT,
  coverUrl TEXT,
  format TEXT,
  condition TEXT,
  discogsLink TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de Eventos
CREATE TABLE events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT,
  venue TEXT,
  description TEXT,
  imageUrl TEXT,
  price NUMERIC,
  ticketUrl TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de Reservas
CREATE TABLE bookings (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  date TEXT NOT NULL,
  guests INTEGER,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de Posts de Comunidad
CREATE TABLE community_posts (
  id TEXT PRIMARY KEY,
  author TEXT NOT NULL,
  content TEXT,
  imageUrl TEXT,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🧪 Testing del Entorno

### Test Local

```bash
# Clonar repositorio
git clone https://github.com/mat32dev/mat32hub-v22.git
cd mat32hub-v22

# Instalar dependencias
npm install

# Crear .env.local con tus claves
cp .env.example .env.local
# Editar .env.local con tus credenciales

# Ejecutar en desarrollo
npm run dev

# Visitar http://localhost:5173
```

### Test de Build

```bash
# Compilar para producción
npm run build

# Preview del build
npm run preview

# Verificar dist/ folder
ls -la dist/
```

### Checklist de Funcionalidad

- [ ] Homepage carga correctamente
- [ ] Navegación entre páginas funciona
- [ ] Panel Admin accesible en `/#/admin`
- [ ] Integración con Gemini AI funciona
- [ ] Formularios de contacto/reservas funcionan
- [ ] Responsive design en mobile
- [ ] Tienda de vinilos muestra productos
- [ ] Calendario de eventos visible

## 🔧 Troubleshooting

### Error: "Module not found"
```bash
npm install
npm run build
```

### Error: "GEMINI_API_KEY is not defined"
- Verificar variables de entorno en Vercel/Replit
- Asegurar que `.env.local` existe localmente

### Error 404 en rutas
- Verificar que `vercel.json` tiene rewrites configurados
- En Vercel: Settings > General > "Rewrite all requests to /index.html"

### Puerto ocupado en Replit
- El archivo `.replit` ya maneja el puerto correcto (5173)
- Reiniciar el Repl si hay problemas

## 📦 Estructura del Proyecto

```
mat32hub-v22/
├── components/       # Componentes React reutilizables
├── context/         # React Context (FavoritesContext)
├── pages/           # Páginas de la aplicación
├── public/          # Assets estáticos
├── services/        # Servicios (dataService, geminiService)
├── .replit          # Configuración Replit
├── vercel.json      # Configuración Vercel
├── package.json     # Dependencias
├── tsconfig.json    # TypeScript config
└── vite.config.ts   # Vite config
```

## 🎯 Próximos Pasos

1. **Configurar dominio personalizado** en Vercel
2. **Activar Analytics** (Vercel Analytics)
3. **Configurar CI/CD** con GitHub Actions
4. **Implementar testing** (Vitest + Testing Library)
5. **Optimizar SEO** (metadata, sitemap)

## 📞 Soporte

Para problemas o preguntas:
- GitHub Issues: https://github.com/mat32dev/mat32hub-v22/issues
- Email: hola@mat32.com

---

**Última actualización:** Enero 2026  
**Versión:** 1.4.6
