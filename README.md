# 🍀 Shannon Iris Pub — Cocktail AI

Web app que crea cócteles personalizados según la personalidad del cliente,
usando IA (Claude de Anthropic). Disponible en español e inglés,
con opción de cóctel con o sin alcohol.

---

## Requisitos

- Node.js 18 o superior → https://nodejs.org
- Una API key de Anthropic → https://console.anthropic.com

---

## Instalación local

```bash
# 1. Entra en la carpeta
cd shannon-iris-pub

# 2. Instala dependencias
npm install

# 3. Crea el archivo de configuración
cp .env.example .env

# 4. Abre .env con cualquier editor y pon tu API key real:
#    ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxx

# 5. Arranca el servidor
npm start

# 6. Abre en el navegador
#    http://localhost:3000
```

---

## Estructura de archivos

```
shannon-iris-pub/
├── server.js          ← servidor Node.js (proxy seguro hacia Anthropic)
├── package.json
├── .env.example       ← plantilla de configuración
├── .gitignore
└── public/
    └── index.html     ← toda la app (HTML + CSS + JS)
```

---

## Despliegue en producción

### Opción A — Render.com (gratis, recomendado)

1. Sube la carpeta a un repositorio GitHub
2. Ve a https://render.com → "New Web Service"
3. Conecta tu repo
4. En "Environment Variables" añade `ANTHROPIC_API_KEY`
5. Build command: `npm install`
6. Start command: `npm start`
7. ¡Listo! Render te da una URL pública gratis

### Opción B — Railway.app

1. https://railway.app → "New Project" → "Deploy from GitHub"
2. Añade la variable `ANTHROPIC_API_KEY` en Settings → Variables
3. Se despliega automáticamente

### Opción C — VPS / servidor propio

```bash
# Instala pm2 para que el servidor no se caiga
npm install -g pm2

# Arranca en segundo plano
pm2 start server.js --name shannon-pub

# Para que arranque solo al reiniciar el servidor
pm2 startup
pm2 save
```

Luego configura Nginx como reverse proxy apuntando al puerto 3000.

---

## Personalización

### Cambiar los sabores disponibles
En `public/index.html`, busca la función `buildPrompt()` y edita las líneas de `flavours`.

### Añadir más preguntas
En el objeto `L` (dentro de `public/index.html`), añade entradas al array `qs`
tanto en `es` como en `en`.

### Cambiar colores / logo
Las variables CSS están al inicio de `<style>` en `public/index.html`:
```css
:root {
  --gold:   #c9922a;   /* dorado principal */
  --dark:   #1a1208;   /* fondo oscuro */
  --green:  #1b4332;   /* verde irlandés */
  --cream:  #f5edd8;   /* texto claro */
}
```

---

## Seguridad

- La API key **nunca** llega al navegador del cliente.
- El servidor actúa de proxy: el navegador llama a `/api/cocktail` (tu propio servidor)
  y el servidor llama a Anthropic con la key guardada en el entorno.
- En producción, considera añadir rate limiting (p.ej. `express-rate-limit`).
